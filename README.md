# web · 前端灵感库

收藏每次用 AI "vibe" 出来的前端页面：仓库根目录下**每个子文件夹是一个独立的页面项目**，跑一次脚本自动完成构建、首屏截图和索引生成，集合页提供搜索 + 瀑布流浏览，点击卡片即可打开真实的可交互页面。

![灵感库集合页](docs/thumbnails/interactive-3p-insomnia-webpage-small.jpg)

## 目录结构

```
web/
├── generate_gallery.py             # 核心脚本：构建 + 截图 + 生成索引
├── interactive-3p-insomnia-webpage/  # 页面项目（每个页面一个文件夹）
│   ├── meta.json                   # 可选元数据（名称/描述/标签）
│   └── ...                         # 页面源码
└── docs/                           # GitHub Pages 发布目录（脚本自动维护）
    ├── index.html                  # 集合页（手写的，脚本不会动它）
    ├── data/pages.json|pages.js    # 页面索引（脚本生成）
    ├── thumbnails/<ID>.jpg         # 首屏大图 1440×900
    ├── thumbnails/<ID>-small.jpg   # 集合页小图 720×450
    └── pages/<ID>/                 # 每个页面的构建产物
```

## 环境准备（一次性）

- **Python 3.9+**（macOS 自带即可）
- **Node.js LTS**（构建 Vite/React 等工程项目用）：https://nodejs.org
- Python 依赖：

```bash
pip3 install --user playwright pillow
python3 -m playwright install chromium   # 下载无头浏览器内核，约 150MB
```

## 日常使用

### 1. 添加一个新页面

把页面源码放进仓库根目录的新文件夹（文件夹名用英文/数字/连字符，它会成为 URL 的一部分）。支持两类页面：

- **工程项目**（含 `package.json`）：脚本自动 `npm install && npm run build`，自动识别 `dist`/`build`/`out` 产物目录
- **纯静态页面**（直接一个 `index.html`）：直接整体收录

可选：在页面文件夹里放一个 `meta.json` 定制展示信息（不写则用文件夹名）：

```json
{
  "name": "页面名称",
  "description": "一句话描述，会显示在卡片上，也会被搜索命中",
  "tags": ["React", "暗色", "滚动叙事"]
}
```

### 2. 生成 / 更新集合页

```bash
python3 generate_gallery.py             # 增量模式：源码没变的页面直接跳过
python3 generate_gallery.py --force     # 强制全部重新构建和重新截图
```

脚本流程：扫描页面 → 构建 → 无头浏览器截首屏（1440×900 大图 + 720×450 小图）→ 更新索引。源码已删除的页面会自动清理产物。

### 3. 本地预览

直接双击打开 `docs/index.html` 即可（数据以 `pages.js` 方式内联加载，不依赖服务器）。

### 4. 提交发布

```bash
git add -A && git commit -m "gallery: 更新灵感库" && git push
```

## 启用 GitHub Pages（一次性）

1. 打开仓库 **Settings → Pages**
2. **Source** 选 `Deploy from a branch`，分支选 `main`，目录选 `/docs`
3. 保存后等几分钟，即可通过 `https://aosgu.github.io/web/` 在线访问集合页和所有页面

## 常见问题

- **某个页面构建/截图失败**：不影响其他页面，终端会明确标注失败的页面，集合页里该卡片显示占位图
- **截图是半截动画状态**：脚本默认等网络空闲后再等 2 秒；动画特别长的页面可以用 `--force` 重试，或改 `generate_gallery.py` 里的 `SETTLE_WAIT_MS`
- **npm 下载慢**：可以临时用国内镜像跑脚本：`npm config set registry https://registry.npmmirror.com`
- **改了 meta.json**：直接重跑脚本即可，秒级完成（不会重新构建和截图）
