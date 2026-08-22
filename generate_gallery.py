#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
前端灵感库生成脚本

扫描仓库根目录下的页面文件夹，自动构建、截取首屏缩略图、生成索引到 docs/，
供 GitHub Pages 或本地浏览器使用。

用法：
    python3 generate_gallery.py            # 增量生成（源码没变的页面直接跳过）
    python3 generate_gallery.py --force    # 忽略缓存，全部重新构建和截图

页面文件夹的识别规则（放在仓库根目录下）：
    - 含 package.json 的工程项目：自动 npm install + npm run build，取 dist/build/out 产物
    - 仅含 index.html 的静态页面：直接整体复制
    - 可选 meta.json：{ "name": "...", "description": "...", "tags": ["..."] }
"""

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import threading
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DOCS = ROOT / "docs"
PAGES_OUT = DOCS / "pages"
THUMBS = DOCS / "thumbnails"
DATA = DOCS / "data"

# 扫描仓库根目录时跳过的文件夹
EXCLUDED_DIRS = {"docs", ".git", "node_modules", ".idea", ".vscode", "__pycache__"}

VIEWPORT_W, VIEWPORT_H = 1440, 900   # 首屏截图（大图）
SMALL_W, SMALL_H = 720, 450          # 集合页用小图
JPEG_QUALITY = 85
SETTLE_WAIT_MS = 2000                # 页面加载完成后再等待，让入场动画播完


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


def npm_install(page_dir):
    lock = page_dir / "package-lock.json"
    base = ["--no-audit", "--no-fund"]
    if lock.exists():
        r = subprocess.run(["npm", "ci"] + base, cwd=page_dir)
        if r.returncode == 0:
            return
    r = subprocess.run(["npm", "install"] + base, cwd=page_dir)
    if r.returncode != 0:
        raise subprocess.CalledProcessError(r.returncode, "npm install")


def build_page(page_dir, page_id):
    """构建页面并把产物复制到 docs/pages/<id>/，返回是否成功。"""
    out = PAGES_OUT / page_id
    try:
        pkg = page_dir / "package.json"
        if pkg.exists():
            log(f"🔨 构建工程项目 {page_id}（npm install + build）…")
            npm_install(page_dir)
            subprocess.run(["npm", "run", "build"], cwd=page_dir, check=True)
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
        log(f"❌ {page_id}：构建失败（exit {e.returncode}），已跳过")
        return False


def serve_docs():
    class QuietHandler(SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    handler = lambda *a, **kw: QuietHandler(*a, directory=str(DOCS), **kw)
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def take_screenshots(page_ids):
    """对给定页面截取首屏大图，并用 Pillow 缩出集合页小图。"""
    from playwright.sync_api import Error as PWError, sync_playwright
    from PIL import Image

    server = serve_docs()
    port = server.server_address[1]
    failed = []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
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


def main():
    ap = argparse.ArgumentParser(description="生成灵感库集合页数据")
    ap.add_argument("--force", action="store_true", help="忽略缓存，全部重新构建和截图")
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
    log(f"发现 {len(page_dirs)} 个页面文件夹")

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
            if not build_page(pd, pid):
                continue
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

    if need_shots:
        log(f"📷 需要截图：{', '.join(need_shots)}")
        try:
            failed = take_screenshots(need_shots)
        except ImportError:
            log("❌ 未安装 playwright，请先执行：")
            log("   pip3 install --user playwright pillow")
            log("   python3 -m playwright install chromium")
            sys.exit(1)
        for pid in failed:
            for e in entries:
                if e["id"] == pid:
                    e["thumb"] = ""  # 截图失败的页面在集合页显示占位图

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
    log(f"✅ 完成：共 {len(entries)} 个页面，索引已写入 docs/data/")
    log("提交并 push 后，GitHub Pages 会自动更新")


if __name__ == "__main__":
    main()
