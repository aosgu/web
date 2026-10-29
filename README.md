# web · 前端灵感库

收藏每次用 AI "vibe" 出来的前端页面：仓库根目录下**每个子文件夹是一个独立的页面项目**，跑一次脚本自动完成构建、首屏截图和索引生成，集合页提供搜索 + 瀑布流浏览，点击卡片即可打开真实的可交互页面。

在线地址：https://aosgu.github.io/web/

![灵感库集合页](docs/thumbnails/interactive-3p-insomnia-webpage-small.jpg)

<!-- GALLERY:START -->
## 已收录页面（13）

按最近更新排序，点名称直接打开线上可交互页面。

| 页面 | 说明 | 标签 |
|---|---|---|
| [Index · 视觉作品集长页](https://aosgu.github.io/web/pages/visual-portfolio-index/) | 以版面、SVG 形状与滚动动效构成的作品集：形状实验室、调色板、绘制网格与字体实验区依次展开，自定义光标全程跟随。 | React、SVG、作品集、滚动叙事、悬停交互、亮色 |
| [绿茵牧场 · 3D 羊群交互](https://aosgu.github.io/web/pages/pastoral-meadow-diorama/) | Three.js 搭建的牧场微缩景观：羊群在草地上活动，可切换场景与时段、点选小羊，配程序化纹理与环境音效。 | React、Three.js、3D、小游戏、悬停交互 |
| [Nova Voss · 设计师作品集](https://aosgu.github.io/web/pages/nova-voss-portfolio/) | 虚构设计师 Nova Voss 的个人站：米白纸感底色上，字体实验室、动效研究与作品陈列随滚动推进，衬线与等宽字混排。 | React、作品集、滚动叙事、亮色、极简 |
| [20 个渐变 3D 形体 · 抽象物件集](https://aosgu.github.io/web/pages/gradient-3d-object-collection/) | Three.js 渲染的 20 个抽象几何体，统一渐变材质与配色主题，可切换色彩方案逐个查看形体的光影与质感。 | React、Three.js、3D、暗色、极简 |
| [负荷悖论 · 肌肉生长数据探索](https://aosgu.github.io/web/pages/interactive-hypertrophy-data-visualization/) | 基于 Lees 等 2025 年论文的交互长页：从解剖图选肌肉，逐步查看抗阻训练负荷与肌肉增长的证据链及个体差异分布。 | React、Framer Motion、数据可视化、暗色、科普 |
| [HOW IT SPREAD · Vox 式滚动纪录片](https://aosgu.github.io/web/pages/vox-style-scroll-explainer/) | 纪录片视觉语言的滚动叙事长页，九个场景依次展开：手绘路线图、沙盘推演、批注文件、柱状竞赛、自绘折线图与小倍数图。 | React、Framer Motion、SVG、滚动叙事、数据可视化、复古 |
| [Roomtone 独立电台 · 红蓝杂志风](https://aosgu.github.io/web/pages/roomtone-independent-radio/) | 虚构独立电台 Roomtone 的落地页：深蓝夜色底配红蓝撞色，选频率、挑心情、点开唱片即可收听，大字排版与网格卡片营造杂志质感。 | React、Tailwind、暗色、极简、落地页 |
| [增肌个体差异 · 研究图谱海报](https://aosgu.github.io/web/pages/muscle-hypertrophy-research-atlas/) | 3600×1280 超宽 SVG 图谱：按年份堆叠的文献山峰、标题标签网格与贝塞尔连线，一屏看尽增肌个体差异研究的脉络与分类。 | SVG、数据可视化、科普、复古 |
| [抗阻训练个体差异 · Ahtiainen 2016](https://aosgu.github.io/web/pages/interactive-muscle-study-visualization/) | 可视化 Ahtiainen 等 2016 年研究：不同年龄男女抗阻训练后力量与肌肉量的反应差异，径向增益图、区间带、坡度图与响应者韦恩图。 | React、SVG、数据可视化、科普、暗色 |
| [磨砂文件夹 · 玻璃拟态组件](https://aosgu.github.io/web/pages/pure-frontend-folder-effect/) | 复刻 macOS 风格的磨砂玻璃文件夹交互组件：拟物纸张、悬浮按钮、细腻阴影，纯 React + CSS 过渡实现。 | React、Tailwind、玻璃拟态、亮色 |
| [溯流 · AI 支出流向可视化](https://aosgu.github.io/web/pages/interactive-ai-spending-visualization/) | 花在 AI 上的钱最终流向谁？从用户订阅一路追到云、芯片、光刻机、矿场与热量，桑基图 + 滚动叙事 + 交互模拟器，墨金色编辑风。 | React、Framer Motion、数据可视化、暗色、滚动叙事 |
| [听力损失机制图谱 · 交互科普页](https://aosgu.github.io/web/pages/hearing-loss-risk-mechanism-page/) | 章节式滚动叙事讲解听力损失的生物学机制：从细胞基础到通向全身性疾病的路径，再到干预手段，黑底颗粒质感。 | React、Framer Motion、暗色、科普、滚动叙事 |
| [失眠 3P 模型 · 交互科普页](https://aosgu.github.io/web/pages/interactive-3p-insomnia-webpage/) | 用滚动叙事讲解失眠的三因素模型：Predisposing（易感）、Precipitating（诱发）、Perpetuating（维持），React + Framer Motion 驱动动画。 | React、Framer Motion、暗色、滚动叙事 |

> 这张表由 `python3 generate_gallery.py --update-readme` 自动生成，不要手动改。
<!-- GALLERY:END -->

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
```

截图用的浏览器二选一（推荐前者，省掉 150MB 下载）：

```bash
# 1) 用本机已装的 Chrome / Edge：脚本会自动探测，或手动指定
export PW_CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# 2) 下载 playwright 自带内核（约 150MB）
python3 -m playwright install chromium
```

## 日常使用

### 1. 添加一个新页面

把页面源码放进仓库根目录的新文件夹（文件夹名用英文/数字/连字符，它会成为 URL 的一部分）。支持两类页面：

- **工程项目**（含 `package.json`）：脚本自动 `npm install && npm run build`，自动识别 `dist`/`build`/`out` 产物目录
- **纯静态页面**（直接一个 `index.html`）：直接整体收录

可选但强烈建议：在页面文件夹里放一个 `meta.json` 定制展示信息（不写则只显示文件夹名）。编写规范见下节：

```json
{
  "name": "页面名称",
  "description": "一句话描述，会显示在卡片上，也会被搜索命中",
  "tags": ["React", "暗色", "滚动叙事"]
}
```

### meta.json 编写规范（人和 AI 都照这个写）

**name（名称）**

- 中文为主，推荐格式「主题 · 亮点」，例如 `失眠 3P 模型 · 交互科普页`
- 控制在 20 字以内；过长在卡片上会截断（悬浮有完整提示）

**description（简介）**

- 一句话，30–60 字，说清「这个页面是什么 + 最亮的点」
- 自然地带上可能被搜索的中英文关键词（技术名、主题名等）

**tags（标签）**

- 每页 3–6 个（脚本最多保留 8 个），搜索时对大小写不敏感
- **技术栈标签用英文官方名**：`React`、`Vue`、`Svelte`、`Tailwind`、`Framer Motion`、`GSAP`、`Three.js`、`Canvas`、`SVG`
- **其余标签统一用中文**，优先从下面的常用词里选，保持全库一致：
  - 风格：`暗色` `亮色` `渐变` `玻璃拟态` `极简` `复古` `霓虹` `3D`
  - 交互/动效：`滚动叙事` `视差` `入场动画` `悬停交互` `拖拽` `粒子`
  - 类型：`落地页` `科普` `数据可视化` `作品集` `仪表盘` `小游戏`
- 常用词不合适可以造新词，但之后的页面要**复用同一个词**，避免同义分裂（例如不要 `动画` / `动效` 混用，选一个固定下来）

### 给 AI 助手的指令模板（复制即用）

让其他 AI 收录新页面时，直接把下面这段发给它：

```text
把 <页面源码目录> 收录进这个前端灵感库：
1. 在仓库根目录建英文命名的文件夹（kebab-case，如 my-cool-page），放入页面源码
2. 读一遍页面源码，按 README「meta.json 编写规范」在文件夹里写 meta.json
   （中文名称 + 一句话简介 + 3~6 个规范标签，标签优先复用常用词表）
3. 运行 `python3 generate_gallery.py --only <新文件夹名> --update-readme`，确认构建和截图成功
4. 提交并 push
```

### 2. 生成 / 更新集合页

```bash
python3 generate_gallery.py                  # 增量模式：源码没变的页面直接跳过
python3 generate_gallery.py --force          # 强制全部重新构建和重新截图
```

常用开关：

| 参数 | 用途 |
|---|---|
| `--only ID [ID ...]` | 只处理指定页面，其余页面的产物和索引原样保留 |
| `--skip-install` | 依赖已装好，跳过 `npm install`（依赖指纹没变时脚本本来也会自动跳过） |
| `--no-screenshot` | 只构建不截图，用来快速验证能否编译通过 |
| `--update-readme` | 顺带重建 README 里的页面表格（需保留 `<!-- GALLERY:START/END -->` 标记） |
| `--jobs N` | 并行构建页面数，默认按 CPU 核数（上限 4），设 1 为串行（`npm install` 始终串行，避免抢缓存锁） |

脚本流程：扫描页面 → 并行构建 → 无头浏览器截首屏（1440×900 大图 + 720×450 小图）→ 更新索引。源码已删除的页面会自动清理产物。

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
- **npm 下载慢**：可以临时用国内镜像跑脚本：`npm config set registry https://registry.npmmirror.com`（或只对他单次生效：`npm_config_registry=https://registry.npmmirror.com python3 generate_gallery.py`）
- **依赖装了很久**：脚本会记录每个页面的依赖指纹（仓库根 `.cache/installed.json`），指纹没变就跳过 `npm install`；多个页面默认并行安装，想串行用 `--jobs 1`
- **`node_modules` 装一半被系统拦掉**（典型症状 `vite: command not found`）：脚本构建前会自动修补 —— 补 `.bin` 软链、缺 `@rollup` 原生包时从同仓库其他项目借一份；仍失败就删掉该页面 `node_modules` 重跑
- **改了 meta.json**：直接重跑脚本即可，秒级完成（不会重新构建和截图）
