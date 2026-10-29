#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
前端灵感库生成脚本

扫描仓库根目录下的页面文件夹，自动构建、截取首屏缩略图、生成索引到 docs/，
供 GitHub Pages 或本地浏览器使用。

用法：
    python3 generate_gallery.py                  # 增量生成（源码/依赖没变的页面直接跳过）
    python3 generate_gallery.py --only a b       # 只处理指定页面（其余页面的产物保持不变）
    python3 generate_gallery.py --skip-install   # 依赖已装好，跳过 npm install
    python3 generate_gallery.py --no-screenshot  # 只构建，不截图
    python3 generate_gallery.py --update-readme  # 顺带重建 README 里的页面表格
    python3 generate_gallery.py --force          # 忽略缓存，全部重新构建和截图
    python3 generate_gallery.py --jobs 4         # 并行构建 N 个页面（默认按 CPU 核数，上限 4）

环境变量：
    PW_CHROME_PATH=/path/to/chrome   指定截图用的浏览器（不设则自动找本机 Chrome/Edge）
    GALLERY_BASE_URL=https://xxx/    生成 README 表格时用的站点前缀

页面文件夹的识别规则（放在仓库根目录下）：
    - 含 package.json 的工程项目：自动 npm install + npm run build，取 dist/build/out 产物
    - 仅含 index.html 的静态页面：直接整体复制
    - 可选 meta.json：{ "name": "...", "description": "...", "tags": ["..."] }
"""

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import threading
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DOCS = ROOT / "docs"
PAGES_OUT = DOCS / "pages"
THUMBS = DOCS / "thumbnails"
DATA = DOCS / "data"
CACHE = ROOT / ".cache"

# 扫描仓库根目录时跳过的文件夹
EXCLUDED_DIRS = {"docs", ".git", "node_modules", ".idea", ".vscode", "__pycache__", ".cache"}

VIEWPORT_W, VIEWPORT_H = 1440, 900   # 首屏截图（大图）
SMALL_W, SMALL_H = 720, 450          # 集合页用小图
JPEG_QUALITY = 85
SETTLE_WAIT_MS = int(os.environ.get("GALLERY_SETTLE_MS", 2000))  # 页面加载完成后再等，让入场动画播完

SITE_BASE = os.environ.get("GALLERY_BASE_URL", "https://aosgu.github.io/web/").rstrip("/") + "/"
README = ROOT / "README.md"
README_BEGIN = "<!-- GALLERY:START -->"
README_END = "<!-- GALLERY:END -->"

# 常见浏览器位置：优先用本机已装的，省掉下载 150MB chromium 内核
CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
]


def log(msg):
    print(f"[gallery] {msg}", flush=True)


def source_hash(page_dir):
    """对页面源码做内容指纹（排除依赖和构建产物），用于增量判断。"""
    h = hashlib.sha256()
    skip_parts = EXCLUDED_DIRS | {"dist", "build", "out"}
    files = []
    for p in page_dir.rglob("*"):
        if not p.is_file():
            continue
        parts = p.relative_to(page_dir).parts
        if any(part in skip_parts for part in parts):
            continue
        files.append((p.relative_to(page_dir).as_posix(), p))
    for rel, p in sorted(files):
        h.update(rel.encode("utf-8"))
        h.update(p.read_bytes())
    return h.hexdigest()[:16]


def dep_hash(page_dir):
    """依赖指纹：package.json + lock 文件内容。"""
    h = hashlib.sha256()
    for name in ("package.json", "package-lock.json", "pnpm-lock.yaml", "yarn.lock"):
        f = page_dir / name
        if f.exists():
            h.update(name.encode("utf-8"))
            h.update(f.read_bytes())
    return h.hexdigest()[:16]


def load_meta(page_dir, page_id):
    meta = {"name": page_id, "description": "", "tags": []}
    meta_path = page_dir / "meta.json"
    if meta_path.exists():
        try:
            data = json.loads(meta_path.read_text(encoding="utf-8"))
            meta["name"] = str(data.get("name") or page_id)
            meta["description"] = str(data.get("description") or "")
            meta["tags"] = [str(t) for t in (data.get("tags") or [])][:8]
        except (json.JSONDecodeError, OSError) as e:
            log(f"⚠️  {page_id}/meta.json 解析失败（{e}），已忽略并使用文件夹名")
    return meta


def discover_pages():
    pages = []
    for d in sorted(ROOT.iterdir()):
        if not d.is_dir() or d.name.startswith(".") or d.name in EXCLUDED_DIRS:
            continue
        if (d / "package.json").exists() or (d / "index.html").exists():
            pages.append(d)
    return pages


def repair_node_modules(page_dir):
    """
    修补被中断/被系统策略拦掉的 npm install 留下的半成品 node_modules：
    - .bin 里缺可执行入口（典型症状：vite: command not found）
    - 缺 @rollup 平台原生包（从同仓库其他项目借一份）
    """
    nm = page_dir / "node_modules"
    if not nm.exists():
        return
    bin_dir = nm / ".bin"
    bin_dir.mkdir(parents=True, exist_ok=True)
    for name, rel in (
        ("vite", "vite/bin/vite.js"),
        ("tsc", "typescript/bin/tsc"),
        ("esbuild", "esbuild/bin/esbuild"),
        ("tailwindcss", "tailwindcss/lib/cli.js"),
    ):
        target = nm / rel
        link = bin_dir / name
        if target.exists() and not link.exists():
            try:
                link.symlink_to(os.path.join("..", rel))
            except OSError:
                pass
    rollup = nm / "@rollup"
    if not rollup.exists() or not any(rollup.iterdir()):
        for sibling in sorted(ROOT.iterdir()):
            src = sibling / "node_modules" / "@rollup"
            if sibling.is_dir() and sibling.name != page_dir.name and src.is_dir() and any(src.iterdir()):
                rollup.mkdir(parents=True, exist_ok=True)
                for pkg in src.iterdir():
                    dst = rollup / pkg.name
                    if not dst.exists():
                        shutil.copytree(pkg, dst, symlinks=True)
                log(f"🔧 {page_dir.name}：从 {sibling.name} 借用了 @rollup 原生包")
                break


# npm install 必须串行：并行时多个 npm 进程会抢同一个缓存/代理 socket 而失败
_NPM_LOCK = threading.Lock()


def npm_install(page_dir, page_id):
    """装依赖。依赖指纹没变且 node_modules 已存在时直接跳过。"""
    state_path = CACHE / "installed.json"
    state = {}
    if state_path.exists():
        try:
            state = json.loads(state_path.read_text("utf-8"))
        except (json.JSONDecodeError, OSError):
            state = {}
    h = dep_hash(page_dir)
    nm = page_dir / "node_modules"
    if nm.exists() and any(nm.iterdir()) and state.get(page_id) == h:
        log(f"📦 {page_id}：依赖无变化，跳过 npm install")
        repair_node_modules(page_dir)
        return
    cmd = ["npm", "install", "--no-audit", "--no-fund", "--prefer-offline"]
    with _NPM_LOCK:
        r = subprocess.run(cmd, cwd=page_dir, capture_output=True, text=True)
    repair_node_modules(page_dir)
    if r.returncode != 0:
        tail = "\n".join((r.stderr or r.stdout or "").strip().splitlines()[-12:])
        raise subprocess.CalledProcessError(r.returncode, " ".join(cmd), output=tail)
    state[page_id] = h
    CACHE.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps(state, ensure_ascii=False, indent=2), "utf-8")


def build_page(page_dir, page_id, skip_install=False):
    """构建页面并把产物复制到 docs/pages/<id>/，返回是否成功。"""
    out = PAGES_OUT / page_id
    try:
        pkg = page_dir / "package.json"
        if pkg.exists():
            log(f"🔨 构建 {page_id}（npm install + build）…")
            if not skip_install:
                npm_install(page_dir, page_id)
            else:
                repair_node_modules(page_dir)
            r = subprocess.run(["npm", "run", "build"], cwd=page_dir, capture_output=True, text=True)
            if r.returncode != 0:
                tail = "\n".join((r.stderr or r.stdout or "").strip().splitlines()[-12:])
                log(f"❌ {page_id}：构建失败（exit {r.returncode}）\n{tail}")
                return False
            dist = next(
                (page_dir / c for c in ("dist", "build", "out") if (page_dir / c).exists()),
                None,
            )
            if dist is None:
                log(f"❌ {page_id}：构建完成但找不到产物目录（dist/build/out）")
                return False
        else:
            dist = page_dir  # 纯静态页面，整个文件夹就是产物
        if out.exists():
            shutil.rmtree(out)
        shutil.copytree(dist, out, ignore=shutil.ignore_patterns("node_modules", ".git"))
        return True
    except FileNotFoundError:
        log("❌ 找不到 npm 命令，请先安装 Node.js（https://nodejs.org）")
        return False
    except subprocess.CalledProcessError as e:
        log(f"❌ {page_id}：依赖安装失败（exit {e.returncode}）\n{e.output}")
        return False


def serve_docs():
    class QuietHandler(SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    handler = lambda *a, **kw: QuietHandler(*a, directory=str(DOCS), **kw)
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def find_chrome():
    """返回本机可用的浏览器路径，找不到就返回 None（交给 playwright 默认内核）。"""
    env = os.environ.get("PW_CHROME_PATH")
    if env:
        return env
    for p in CHROME_CANDIDATES:
        if Path(p).exists():
            return p
    for name in ("google-chrome", "chromium", "chromium-browser", "microsoft-edge"):
        p = shutil.which(name)
        if p:
            return p
    return None


def take_screenshots(page_ids):
    """对给定页面截取首屏大图，并用 Pillow 缩出集合页小图。"""
    from playwright.sync_api import Error as PWError, sync_playwright
    from PIL import Image

    server = serve_docs()
    port = server.server_address[1]
    failed = []
    exe = find_chrome()
    try:
        with sync_playwright() as pw:
            kwargs = {"args": ["--enable-unsafe-swiftshader"]}
            if exe:
                kwargs["executable_path"] = exe
                log(f"🌐 使用浏览器：{exe}")
            browser = pw.chromium.launch(**kwargs)
            for pid in page_ids:
                url = f"http://127.0.0.1:{port}/pages/{pid}/"
                try:
                    page = browser.new_page(
                        viewport={"width": VIEWPORT_W, "height": VIEWPORT_H}
                    )
                    try:
                        page.goto(url, wait_until="networkidle", timeout=45000)
                    except PWError:
                        pass  # networkidle 超时就继续，靠下面的固定等待兜底
                    page.wait_for_timeout(SETTLE_WAIT_MS)
                    big = THUMBS / f"{pid}.jpg"
                    page.screenshot(path=str(big), type="jpeg", quality=JPEG_QUALITY)
                    page.close()
                    small = THUMBS / f"{pid}-small.jpg"
                    with Image.open(big) as im:
                        im.convert("RGB").resize(
                            (SMALL_W, SMALL_H), Image.LANCZOS
                        ).save(small, "JPEG", quality=80, optimize=True)
                    log(f"📷 已截图 {pid}")
                except Exception as e:
                    failed.append(pid)
                    log(f"❌ {pid}：截图失败（{e}）")
            browser.close()
    finally:
        server.shutdown()
    return failed


def update_readme(entries):
    """重建 README 里 GALLERY 标记之间的页面表格。"""
    if not README.exists():
        log("⚠️  找不到 README.md，跳过表格更新")
        return
    text = README.read_text("utf-8")
    if README_BEGIN not in text or README_END not in text:
        log("⚠️  README.md 里没有 GALLERY 标记，跳过表格更新")
        return
    rows = ["| 页面 | 说明 | 标签 |", "|---|---|---|"]
    for e in entries:
        name = (e.get("name") or e["id"]).replace("|", "\\|")
        desc = (e.get("description") or "").replace("|", "\\|").replace("\n", " ")
        tags = "、".join(e.get("tags") or [])
        rows.append(f"| [{name}]({SITE_BASE}pages/{e['id']}/) | {desc} | {tags} |")
    block = "\n".join(
        [
            f"## 已收录页面（{len(entries)}）",
            "",
            "按最近更新排序，点名称直接打开线上可交互页面。",
            "",
            *rows,
            "",
            "> 这张表由 `python3 generate_gallery.py --update-readme` 自动生成，不要手动改。",
        ]
    )
    head, rest = text.split(README_BEGIN, 1)
    _, tail = rest.split(README_END, 1)
    README.write_text(f"{head}{README_BEGIN}\n{block}\n{README_END}{tail}", "utf-8")
    log(f"📝 README 页面表格已更新（{len(entries)} 个页面）")


def main():
    ap = argparse.ArgumentParser(description="生成灵感库集合页数据")
    ap.add_argument("--force", action="store_true", help="忽略缓存，全部重新构建和截图")
    ap.add_argument("--only", nargs="+", metavar="ID", help="只处理指定的页面文件夹")
    ap.add_argument("--skip-install", action="store_true", help="跳过 npm install（依赖已装好时）")
    ap.add_argument("--no-screenshot", action="store_true", help="只构建，不截图")
    ap.add_argument("--update-readme", action="store_true", help="同步更新 README 里的页面表格")
    ap.add_argument("--jobs", type=int, default=min(4, os.cpu_count() or 1),
                    help="并行构建页面数（默认按 CPU 核数，上限 4；设 1 为串行）")
    args = ap.parse_args()

    for d in (PAGES_OUT, THUMBS, DATA):
        d.mkdir(parents=True, exist_ok=True)

    index_path = DATA / "pages.json"
    old_index = {}
    if index_path.exists():
        try:
            old_index = {e["id"]: e for e in json.loads(index_path.read_text("utf-8"))}
        except (json.JSONDecodeError, KeyError, OSError):
            old_index = {}

    page_dirs = discover_pages()
    if args.only:
        wanted = set(args.only)
        missing = wanted - {d.name for d in page_dirs}
        if missing:
            log(f"⚠️  找不到页面文件夹：{', '.join(sorted(missing))}")
        page_dirs = [d for d in page_dirs if d.name in wanted]
    log(f"发现 {len(page_dirs)} 个页面文件夹")

    # 先算指纹判断谁需要重建（source_hash 全量扫一遍很快）
    plan = []          # (page_dir, page_id) 需要构建
    entries = []
    ok_ids = set()
    need_shots = []

    for pd in page_dirs:
        pid = pd.name
        meta = load_meta(pd, pid)
        h = source_hash(pd)
        prev = old_index.get(pid)
        cache_hit = (
            not args.force
            and prev
            and prev.get("hash") == h
            and (PAGES_OUT / pid).exists()
            and (THUMBS / f"{pid}.jpg").exists()
            and (THUMBS / f"{pid}-small.jpg").exists()
        )
        if cache_hit:
            updated = prev.get("updated")
        else:
            plan.append((pd, pid))
            if not args.no_screenshot:
                need_shots.append(pid)
            updated = datetime.now(timezone.utc).isoformat(timespec="seconds")
        ok_ids.add(pid)
        entries.append(
            {
                "id": pid,
                **meta,
                "hash": h,
                "updated": updated,
                "thumb": f"thumbnails/{pid}-small.jpg",
                "thumbLarge": f"thumbnails/{pid}.jpg",
                "path": f"pages/{pid}/",
            }
        )

    # 并行构建：构建是 CPU 密集，并行有明显收益；npm install 内部已串行化
    if plan:
        log(f"🔨 需要构建 {len(plan)} 个页面（并行 {args.jobs}）…")
        if args.jobs > 1 and len(plan) > 1:
            with ThreadPoolExecutor(max_workers=args.jobs) as ex:
                results = list(ex.map(lambda t: (t[1], build_page(t[0], t[1], args.skip_install)), plan))
        else:
            results = [(pid, build_page(pd, pid, args.skip_install)) for pd, pid in plan]
        built = {pid for pid, ok in results if ok}
        for pid, ok in results:
            if not ok:
                entries = [e for e in entries if e["id"] != pid]
                ok_ids.discard(pid)
                if pid in need_shots:
                    need_shots.remove(pid)

    if need_shots:
        log(f"📷 需要截图：{', '.join(need_shots)}")
        try:
            failed = take_screenshots(need_shots)
        except ImportError:
            log("❌ 未安装 playwright，请先执行：")
            log("   pip3 install --user playwright pillow")
            log("   也可以设置 PW_CHROME_PATH 直接用本机 Chrome，省掉下载内核")
            sys.exit(1)
        for pid in failed:
            for e in entries:
                if e["id"] == pid:
                    e["thumb"] = ""  # 截图失败的页面在集合页显示占位图

    # 只处理部分页面时，保留其余页面的原有索引与产物
    if args.only:
        for pid, e in old_index.items():
            if pid not in ok_ids:
                entries.append(e)
                ok_ids.add(pid)
        log("ℹ️  --only 模式：未处理页面的产物与索引保持不变")
    else:
        # 清理源码已删除的页面产物
        for d in PAGES_OUT.iterdir():
            if d.is_dir() and d.name not in ok_ids:
                shutil.rmtree(d)
                log(f"🧹 已移除失效产物 pages/{d.name}/")
        for f in THUMBS.iterdir():
            if f.stem.replace("-small", "") not in ok_ids:
                f.unlink()

    entries.sort(key=lambda e: e.get("updated") or "", reverse=True)
    index_path.write_text(json.dumps(entries, ensure_ascii=False, indent=2), "utf-8")
    # pages.js 让集合页在 file:// 双击打开时也能读取数据（fetch 在 file:// 下会被浏览器拦截）
    (DATA / "pages.js").write_text(
        "window.PAGES_DATA = " + json.dumps(entries, ensure_ascii=False, indent=2) + ";\n",
        "utf-8",
    )
    if args.update_readme:
        update_readme(entries)
    log(f"✅ 完成：共 {len(entries)} 个页面，索引已写入 docs/data/")
    log("提交并 push 后，GitHub Pages 会自动更新")


if __name__ == "__main__":
    main()
