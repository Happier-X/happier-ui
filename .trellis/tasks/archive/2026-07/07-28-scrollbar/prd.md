# 滚动条组件 HScrollbar

## Goal

提供 HeroUI 风格细窄主题滚动条的便捷封装：Web 端用原生 `::-webkit-scrollbar` / `scrollbar-color` 自定义外观，移动端回退浏览器原生滚动。纯 CSS，无 JS thumb / 虚拟滚动。

## Background

- 仓库现有组件均走 `H*` SFC + `src/styles/components/*.css`（`@layer components`）+ `--h-*` token；文档在 `docs/components/`。
- HeroUI v3 滚动条是 CSS 系统（`data-scrollbar` + `--scrollbar-*`），**不是** JS 组件。
- 同类 JS 自定义 thumb 库（如 custom-vue-scrollbar）与项目「对齐 HeroUI、Web+移动通用、无 elevation」定位冲突，不采用。
- 现有 tokens 已覆盖颜色与圆角；新增少量 `--h-scrollbar-*` 尺寸/色 token 即可。

## Requirements

### R1 容器语义
- 组件为 overflow 容器，默认 `overflow-y: auto`。
- 仅 default slot 承载滚动内容。

### R2 滚动条模式（`mode`）
- `thin`（默认）：HeroUI 细窄主题 thumb。
- `default`：浏览器原生滚动条。
- `none`：隐藏 thumb，内容仍可滚动。
- DOM 上写 `data-scrollbar="<mode>"`。

### R3 方向（`axis`）
- `y`（默认）/ `x` / `both`；控制 `overflow-x` / `overflow-y`。

### R4 尺寸（`size`）
- `sm` 4px / `md` 6px（默认）/ `lg` 8px，控制 thumb 宽度。

### R5 主题色（`color`）
- `default`（半透明灰，默认）/ `primary` / `success` / `warning` / `danger`。
- 基于 `var(--h-color-*)` + 透明度。

### R6 视觉
- thumb 使用 `var(--h-radius-pill)`；track 默认透明。
- 无 elevation、无 box-shadow。
- 移动端（`@media (hover: none) and (pointer: coarse)`）回退原生滚动，不强制自定义 thumb。

### R7 交付物
- `src/components/HScrollbar.vue`
- `src/styles/components/scrollbar.css` + `components.css` import
- `src/styles/tokens.css` 中 `--h-scrollbar-*`
- `src/index.ts` 导出组件与 `HScrollbarProps`
- `docs/components/scrollbar.md` + 侧栏入口
- playground smoke 演示

## Acceptance Criteria

- [ ] AC1: Chromium/Safari 下 `mode="thin"` 可见细窄主题色 thumb；Firefox 下 `scrollbar-width: thin` + `scrollbar-color` 生效。
- [ ] AC2: 移动端模拟（coarse pointer）下自定义 thumb 不强制显示，使用原生滚动。
- [ ] AC3: `mode="default"` 为浏览器原生样式；`mode="none"` 隐藏 thumb 且仍可滚动。
- [ ] AC4: `axis="x"|"y"|"both"` 对应正确 overflow 方向。
- [ ] AC5: `size` sm/md/lg 改变 thumb 宽度（4/6/8px）。
- [ ] AC6: `color` 五档使 thumb 着色为对应 `--h-color-*`。
- [ ] AC7: `src/index.ts` 可 import；文档页可访问；playground 有演示。
- [ ] AC8: `npm run typecheck` 通过。

## Out of Scope

- JS 模拟滚动 / 虚拟滚动 / 拖拽 thumb
- ResizeObserver 实时同步 thumb 尺寸
- 子树级联 `data-scrollbar`（框架级能力）
- both 时次要轴独立自定义（MVP 双向同规则）
- iOS 专属 touch 处理（宿主负责）
- `scrollbar-gutter` 布局预留

## Key Decisions

| 决策 | 选择 | 理由 |
|------|------|------|
| 实现路线 | CSS-only（路线 A） | 对齐 HeroUI；零 SSR；移动端自动原生 |
| 模式 API | `mode` prop → `data-scrollbar` | 与项目 prop 风格一致，DOM 仍可调试 |
| 高度 | 宿主控制 | 容器无固定 height，文档示例设高 |
| 颜色实现 | `color-mix` + rgba fallback | 现代优先，旧浏览器可退化 |

## Technical Notes

详见 `design.md`。要点：
- 无 emits、无 JS 副作用、无 SSR guard。
- webkit 伪元素（Chromium/Safari）+ 标准 `scrollbar-width`/`scrollbar-color`（Firefox）。
- 移动端媒体查询级联覆盖 thin 自定义。

## Risks

| 风险 | 缓解 |
|------|------|
| 宿主未设高度导致「不能滚」 | 文档与 playground 明确示例高度 |
| `color-mix` 兼容 | rgba 同声明 fallback |
| both 方向 webkit 宽/高 | CSS 同时设置 width 与 height |
