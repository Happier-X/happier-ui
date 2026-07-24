# 图标按钮 HIconButton

## Goal

为 happier-ui 新增独立的图标按钮组件 `HIconButton`，用于移动端与 Web 高频的纯图标操作（返回、关闭、更多、收藏等）。结构与无障碍独立于 `HButton`，配色与 token 与 `HButton` 共享，避免颜色定义漂移。

## Background / Confirmed Facts

- `HIconButton` 曾在减法收敛阶段被移除，记录于 `.trellis/spec/frontend/component-guidelines.md` 的「已移除（勿再导出）」清单。本任务经显式评审后重新引入，需同步更新该清单与「当前导出」表。
- 现有 `HButton`（`src/components/HButton.vue` + `src/styles/components/button.css`）提供 7 个 variant：`primary / secondary / tertiary / outline / ghost / danger / danger-soft`，尺寸 `sm / md / lg`，靠 `padding-x + min-height` 撑胶囊形状。
- variant 配色规则、`active / disabled / focus-visible` 行为、token 命名以 `button.css` 为权威来源，需被 `HIconButton` 复用。
- `HIcon`（`src/components/HIcon.vue`）为 Lucide 组件包装，`size` 支持 `sm/md/lg/number`，可作为图标插槽内容或 `:icon` 传入。
- 相关 token 已存在：`--h-button-height-sm/md/lg = 32/40/48px`、`--h-radius-control = 12px`、`--h-image-radius-full = 999px`、`--h-color-danger-rgb`、`--h-touch-target = 48px`。
- 组件规范要求：`src/components/H*.vue` + `src/styles/components/*.css`（`@layer components`）+ `src/index.ts` 导出 + `playground` 演示 + `docs/components` 文档页；类前缀一律 `h-*`；无大块 scoped 视觉 CSS。

## Requirements

### R1 组件与 API
- 新建 `src/components/HIconButton.vue`，SFC 结构遵循规范（template → script setup，无大块 scoped 视觉 CSS）。
- Props：
  - `icon: Component`（必填，Lucide 组件；内部通过 `HIcon` 渲染）
  - `ariaLabel: string`（**必填**，类型层面 required，提供可访问名）
  - `variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger' | 'danger-soft'`，默认 `'primary'`（与 HButton 对齐）
  - `size?: 'sm' | 'md' | 'lg'`，默认 `'md'`
  - `shape?: 'square' | 'circle'`，默认 `'square'`
  - `disabled?: boolean`，默认 `false`
  - `type?: 'button' | 'submit' | 'reset'`，默认 `'button'`
- Emits：`click: [event: MouseEvent]`（`disabled` 时不触发），与 HButton 一致。

### R2 形状与尺寸
- 渲染为正方形：宽高相等，等于对应尺寸的 `--h-button-height-*`（sm/md/lg = 32/40/48px），图标居中。
- `shape="square"` 用 `--h-radius-control`（12px）圆角矩形；`shape="circle"` 用 `--h-image-radius-full`（999px）圆形。
- 图标尺寸随按钮尺寸联动（sm/md/lg 映射到合理的图标像素，参考 HIcon 的 16/20/24）。

### R3 配色与状态复用
- variant 配色、`:active`、`:disabled`、`:focus-visible` 行为与 HButton 视觉一致，复用相同 `--h-*` token，不新增魔法数颜色。
- 新增 `src/styles/components/icon-button.css`，在 `@layer components` 写视觉规则；`src/styles/components.css` 增加 `@import`。variant 颜色以复用 HButton token 为准，避免两份颜色定义漂移。

### R4 导出与集成
- `src/index.ts` 导出 `HIconButton`。
- `playground/src/App.vue` 增加演示段：variant × size 矩阵、square/circle 两形状、disabled 态。
- 新增 `docs/components/icon-button.md`：示例 + API 表（props/emits），与源码一致。
- 更新 `.trellis/spec/frontend/component-guidelines.md`：从「已移除」清单移出 `HIconButton`，补入「当前导出」表与 API 约定表。

### R5 无障碍
- 原生 `<button>`；`disabled` 时不可点。
- `ariaLabel` 必填并映射到 `aria-label`。
- 内部图标为装饰性（`aria-hidden`），可访问名来自 `ariaLabel`。
- 保留 `:focus-visible` 焦点环，与 HButton 一致。

## Acceptance Criteria

- [ ] `HIconButton` 渲染原生 `<button>`，`ariaLabel` 为类型必填并输出到 `aria-label`；内部图标 `aria-hidden`。
- [ ] 7 个 variant 的配色/active/disabled/focus-visible 与 HButton 视觉一致，且复用相同 token，无新增颜色魔法数。
- [ ] `size` sm/md/lg 渲染为 32/40/48px 正方形，图标居中且尺寸联动。
- [ ] `shape="square"` 为 12px 圆角矩形，`shape="circle"` 为圆形。
- [ ] 未 `disabled` 时点击触发 `click(MouseEvent)`；`disabled` 时不触发。
- [ ] `src/index.ts` 导出 `HIconButton`；`playground` 演示段覆盖 variant×size、两形状、disabled。
- [ ] `docs/components/icon-button.md` 存在且 API 与源码一致。
- [ ] `component-guidelines.md` 的「已移除」清单不再含 `HIconButton`，「当前导出」表已补入。
- [ ] `npm run build:playground` 通过；改 docs 时 `npm run docs:build` 通过。

## Key Decisions

- 独立组件而非 HButton 加 `iconOnly`：结构与无障碍（`ariaLabel` 必填）独立，配色与 token 共享。
- 形状支持 `square` + `circle` 两种（选项 A），一次覆盖工具栏与导航两类场景。
- variant 集合与 HButton 的 7 个完全对齐，不裁剪。

## Out of Scope

- 加载态（loading spinner）、badge/角标、长按手势。
- 圆形以外的其他形状、尺寸自定义（number size）。
- HButton 自身的重构或 `iconOnly` 支持。

## Notes

- 轻量任务，PRD-only。实现按规范「新组件清单」5 步 + docs 页 + spec 更新执行。
