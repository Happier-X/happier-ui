# Design Tokens（happier-ui）

## 权威

- 文件：`src/styles/tokens.css`（`src/tokens.css` 仅为 re-export，避免双源）
- 前缀：`--h-*`
- 包导出：
  - **`happier-ui/styles`**（主推）：tokens + `@theme` + 组件 BEM
  - **`happier-ui/tokens.css`**：仅变量（可选）

宿主（Tailwind v4）入口：

```css
@import "tailwindcss";
@import "happier-ui/styles";
```

## Cascade layer 顺序（防引入顺序敏感）

- `src/styles/index.css` 顶部（注释后、首个 `@import` 前）须前置声明 `@layer theme, base, components, utilities;`；`emitHappierUiStyles` 内联组装后该行保留在 `dist/styles.css` 首行。
- 组件 BEM 裸包在 `@layer components { ... }`；层的相对顺序由**首次出现顺序**决定。不前置声明时，消费方若先 `@import "happier-ui/styles"` 再 `@import "tailwindcss"`，Tailwind 的 `base`（preflight reset）会排在 `components` 之后并覆盖组件样式（`.h-button` 等呈裸样式）。前置声明锁定 `components` 相对 `base` 的位置，库对引入顺序不再敏感。
- 层名取 Tailwind v4 默认约定 `theme, base, components, utilities`。修改 styles 入口时勿删这行。

playground：

```css
/* playground/src/style.css */
@import "tailwindcss";
@import "happier-ui/styles";
```

## `@theme` / `h-` utility

- 映射文件：`src/styles/theme.css`
- 公共 utility **带 `h-` 命名空间**，与 `--h-*` 对应，例如：
  - `--h-color-primary` → `bg-h-primary` / `text-h-primary`
  - `--h-space-md` → `p-h-md` / `gap-h-md`
  - `--h-radius-control` → `rounded-h-control`
- **不**把无前缀 `bg-primary` 作为库公共契约
- 组件级尺寸 token（如 `--h-button-height-md`）可只做 CSS 变量，不必全部 utility 化

## 兼容别名

同文件内 `--muses-* → var(--h-*)`，供 Muses 存量样式字符串过渡。  
**新组件与新 CSS 只写 `--h-*`。**

## 视觉源

- 对齐 **HeroUI Native** 的角色语义（surface / accent / muted / separator、soft radius、状态观感）；token 同时服务 Web 与移动端。
- Primary 色阶对齐 HeroUI common.blue（`--h-primary-50` … `--h-primary-900`，主色 `--h-color-primary`）。
- **禁止** Material elevation / 重阴影。

## 使用方式

```css
/* 组件层 BEM 或业务 CSS */
.color {
  color: var(--h-color-ink-muted, #92949c);
  border-radius: var(--h-radius-control, 12px);
  min-height: var(--h-touch-target, 48px);
}
```

```html
<div class="bg-h-surface text-h-ink rounded-h-control p-h-md">…</div>
```

- 组件 CSS 中 `var(--h-…, fallback)` 推荐带 fallback。
- 禁止在组件里重新定义一套全局 `:root` 色板。

## 明 / 暗两态（库自洽，不依赖宿主）

- 语义中性色为**库内自洽基色**，不 fallback 到 `--ion-*`（历史耦合已移除）。浅色态默认值即原 ion fallback 观感（surface `#ffffff`、ink `#000000` 等）。
- **暗色触发 = 方案 C（media 跟随系统 + class 手动覆盖）**，三段式：
  1. base `:root` 定浅色默认值；
  2. `@media (prefers-color-scheme: dark) { :root:not(.light) { … } }` 跟随系统偏好翻暗；
  3. `:root.dark, .dark { … }` 手动强制暗色（无视系统偏好）。
- **class 覆盖 media**：`:root.dark`（0,2,0）赢过 base `:root`；`.light` 类使 media 块 `:not(.light)` 不命中 → 系统暗色下强制回浅。`:root.dark` 供全局（`<html>`，如 VitePress）、`.dark` 供局部容器。
- 只覆盖**决定明暗观感的中性色**：`--h-color-surface`/`surface-secondary`/`ink`/`ink-muted`/`border-subtle`/`cover-placeholder`/`bg-muted`/`bg-hover`。主色阶 / `success` / `warning` / `danger` / 间距 / 圆角**不随明暗变**。
- 派生 token（`--h-color-separator`、各 `--h-*-bg` 引用 surface）与 `--muses-*` 别名通过 `var()` 自动继承暗色，无需单独覆盖。
- media 块与 class 块两组暗色值须**逐字一致**，避免漂移。
- `--h-color-surface-dark`（`#1f1f1f`，沉浸播放态专用）不参与本主题，保持不动。
- 三段式覆盖块与 base `:root` 均在 unlayered 区（非 `@layer` 内），靠特异性 + 源序决胜，勿放进 `@layer components`。

## 分组（文件内）

| 组 | 示例 |
|----|------|
| 主色阶 | `--h-primary-500` |
| 语义色 | `--h-color-primary`、`--h-color-surface`、`--h-color-danger`、`--h-color-success` / `warning`、`--h-color-focus-ring`、`--h-color-bg-muted` / `bg-hover`（组件灰底/悬停底；明 `#f4f4f5`/`#f0f0f0`，暗 `#2a2a2a`/`#333333`） |
| 沉浸播放 | `--h-immersive-*`（播放器宿主可用，库组件按需） |
| 间距 / 圆角 / 字号 | `--h-space-*`、`--h-radius-*`、`--h-font-*` |
| 按钮 | `--h-button-height-*`、`--h-button-pad-x-*`、`--h-button-font-*` |
| 开关 | `--h-switch-track-*-w/h`、`--h-switch-thumb-*`、`--h-switch-pad` |
| 滑块 | `--h-range-track-*-h`、`--h-range-thumb-*`、`--h-range-fill`、`--h-range-track-bg`、`--h-range-thumb-bg/border`、`--h-range-duration` |
| 进度条 | `--h-progress-height-*`、`--h-progress-track-bg`、`--h-progress-fill`、`--h-progress-transition-duration`、`--h-progress-indeterminate-duration` |
| 底部面板 | `--h-bottom-sheet-z`、`--h-bottom-sheet-overlay-bg`、`--h-bottom-sheet-radius`、`--h-bottom-sheet-duration` |
| 对话框 | `--h-dialog-z`、`--h-dialog-overlay-bg`、`--h-dialog-radius`、`--h-dialog-max-width`、`--h-dialog-duration` |
| 轻提示 | `--h-toast-z`、`--h-toast-max-width`、`--h-toast-pad-x/y`、`--h-toast-radius`、`--h-toast-offset`、`--h-toast-duration` |
| 输入框 | `--h-input-height-*`、`--h-input-pad-x-*`、`--h-input-border`、`--h-input-border-invalid` |
| 复选框 | `--h-checkbox-size-*`、`--h-checkbox-radius`、`--h-checkbox-border`、`--h-checkbox-bg-checked` |
| 空状态 | `--h-empty-min-height`、`--h-empty-max-width`、`--h-empty-pad` |
| 图片 | `--h-image-bg`、`--h-image-fallback-ink`、`--h-image-radius-*` |
| 图标 | `--h-icon-size-sm/md/lg` |
| 底部导航 | `--h-tab-bar-height`、`--h-tab-bar-bg`、`--h-tab-bar-border`、`--h-tab-bar-label-font`、`--h-z-tab` |
| 顶部标题栏 | `--h-nav-bar-height`（内容高度 56px）、`--h-nav-bar-bg`、`--h-nav-bar-border`、`--h-z-nav`；顶部 safe-area 额外叠加 |
| 触控 / 列表 | `--h-touch-target`、`--h-song-row-height`、`--h-list-row-height-compact`、`--h-cover-size-sm` |
| 设置行 / 分组 | `--h-cell-min-height`、`--h-cell-pad-x/y`、`--h-cell-gap`、`--h-cell-bg`、`--h-cell-pressed-bg`、`--h-cell-chevron-color`、`--h-cell-group-radius`、`--h-cell-group-header-gap`（HCell / HCellGroup） |
| 动效 | `--h-duration-press`、`--h-ease-standard` |
| 浮动气泡 | `--h-floating-bubble-size`、`--h-floating-bubble-icon-size`、`--h-floating-bubble-gap`、`--h-floating-bubble-bg/color`、`--h-floating-bubble-radius`、`--h-floating-bubble-transition`、`--h-z-floating-bubble` |
| 侧边栏 | `--h-sidebar-width`（展开 240px，布局分组已有）、`--h-sidebar-collapsed-width`、`--h-sidebar-bg`、`--h-sidebar-border`、`--h-sidebar-item-radius`、`--h-sidebar-item-gap`、`--h-sidebar-transition`（HSidebar） |
| 热力图 | `--h-heatmap-cell-{sm,md,lg}`、`--h-heatmap-gap`、`--h-heatmap-radius`、`--h-heatmap-empty`（空日/0 值底色，回退 surface-secondary）、`--h-heatmap-level-{1..4}`（基于 `rgba(var(--h-color-primary-rgb), a)` 的蓝阶梯，随主题走）（HHeatmap） |
| 层级 | `--h-z-nav`、`--h-z-tab`、`--h-z-mini-player`、`--h-z-player`、`--h-z-floating-bubble` |

## 已知债

- ~~部分 token 仍 fallback 到 `--ion-*`（历史宿主耦合）~~ 已收敛（#11）：5 处 `--ion-*` 反向依赖全部替换为库内基色，全文无 `--ion-`。
- `--muses-*` 别名仍保留供 Muses 存量字符串过渡；新代码只写 `--h-*`。

## 反模式

- 在 Muses 与本库各维护一份分叉色板且不别名。
- 组件内写死 `#006fee` 而不走 `--h-color-primary`。
- 新增 elevation shadow token「看起来更立体」。
- 把无前缀 `bg-primary` 等写成库公共 utility 契约（易与宿主冲突）。
- 继续文档化 `0.0.1` 的「只引 style.css、无需 Tailwind」路径。
- 语义色 fallback 到宿主框架变量（`--ion-*` 等）；库 token 须自洽，暗色由库自带 media/class 提供，不「借」宿主。
- 暗色只在 media 块或只在 class 块写一处；两处须并存且值一致，否则手动切换与系统偏好行为不一致。
