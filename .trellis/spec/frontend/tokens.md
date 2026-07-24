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

## 分组（文件内）

| 组 | 示例 |
|----|------|
| 主色阶 | `--h-primary-500` |
| 语义色 | `--h-color-primary`、`--h-color-surface`、`--h-color-danger`、`--h-color-success` / `warning`、`--h-color-focus-ring` |
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
| 层级 | `--h-z-nav`、`--h-z-tab`、`--h-z-mini-player`、`--h-z-player` |

## 已知债

- 部分 token 仍 fallback 到 `--ion-*`（历史宿主耦合）；长期应收敛为纯 `--h-*` 默认值。
- `--muses-*` 别名仍保留供 Muses 存量字符串过渡；新代码只写 `--h-*`。

## 反模式

- 在 Muses 与本库各维护一份分叉色板且不别名。
- 组件内写死 `#006fee` 而不走 `--h-color-primary`。
- 新增 elevation shadow token「看起来更立体」。
- 把无前缀 `bg-primary` 等写成库公共 utility 契约（易与宿主冲突）。
- 继续文档化 `0.0.1` 的「只引 style.css、无需 Tailwind」路径。
