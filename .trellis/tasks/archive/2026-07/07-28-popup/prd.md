# 封装移动端 Popup 组件

## Goal

提供面向移动端的**通用浮层基础组件 `HPopup`**，通过 `position` prop 统摄底部面板（bottom/top/left/right）、居中弹窗（center）与相对触发点定位（trigger）四类弹层形态。本轮同时将 `HBottomSheet` 与 `HDialog` 内部重构为基于 `HPopup`（公共导出名与 API 完全不变）；新增 `useScrollLock` composable 统一滚动锁定。

## Background

- 仓库已有 `HBottomSheet`（仅 bottom，`role="dialog"`+overlay+Esc）、`HDialog`（仅 center，同）、`HToast`（提示）、`HTooltip`（hover/focus/tap 悬浮提示，滚动即隐藏、相对 trigger 四向+翻转）。`HSelect` 内部用 `fixed`+`getBoundingClientRect` 做下方/上方翻转（listbox 语义，无 overlay）。
- 四个浮层组件唯一共享的是 `src/composables/useTeleportTarget.ts`（解析 teleport 目标，SSR 安全）。**再无共享浮层底座**：open/close 状态管理、`requestClose`、overlay 关闭、Esc、open→focus root、`close` emit 等模式在 `HBottomSheet`/`HDialog` 各重复一份。
- **现有浮层均无 body 滚动锁定**（全仓库无 `documentElement`/`body` style 操作）。
- 规范严禁实现 Modal/ActionSheet/Alert 调度引擎；`HPopup` 是语义 UI 基础件，不是调度器。
- 视觉/命名/分层：`H*.vue` + `src/styles/components/*.css`（`@layer components`）+ `--h-*` token；类前缀一律 `h-*`；teleport 默认 `body`。
- z-index 现状：`--h-z-nav/tab=30`、`--h-z-floating-bubble=999`、`--h-z-select=1150`、`--h-z-bottom-sheet=1200`、`--h-z-dialog=1210`、`--h-z-toast=1220`、`--h-z-tooltip=1200`。需新增 `--h-z-popup` token（居中/贴边形态 ≈1200；relative-to-trigger 介于 bubble 与 select 之间，暂定 1160 个体可覆盖）。
- 外部参考：Vant `Popup`（`position bottom/top/left/right/center` + `close-on-click-overlay` + `closeable`+`close-icon-position` + `before-close` + `teleport`）、React Aria 浮层分层（`useOverlay`/`useModal`/`useOverlayPosition`/`useOverlayTrigger`）、NN/g 建议浮层应提供可见 Close 按钮避免误触关闭。

## Key Decisions

| # | 决策 | 选择 | 理由 |
|---|------|------|------|
| D1 | 范围 | **全形态通用**（bottom/top/left/right/center/relative-trigger） | 一个组件统摄所有弹层定位，统一底座 |
| D2 | 相对 trigger 定位 | **含**：`getBoundingClientRect` + 边缘翻转 + resize/scroll 重算 | 补齐项目最大缺口——无相对定位 popover 基础件 |
| D3 | HBottomSheet/HDialog | **内部重构、外部保留**：两者改为基于 `HPopup`(position: bottom/center)，公共导出名与 API 完全不变 | 消除重复实现、统一底座、零破坏 |
| D4 | 滚动锁定 | **本轮新增 `useScrollLock`**，HPopup 默认 enabled（`lockScroll: true`），HBottomSheet/HDialog 重构后自然获得 | 补移动端缺口 |
| D5 | 关闭按钮 | **内置 `closeable: boolean`**（默认 false，对齐现有行为），`closeIconPosition: top-left | top-right | bottom-left | bottom-right`（默认 top-right），图标走 `HIcon` Lucide `X` | NN/g 建议；默认 false 保证重构零视觉漂移 |
| D6 | before-close 拦截 | **不提供**：宿主通过受控 v-model 在 @close/@update:modelValue 不写回即取消，天然拦截 | 规范不造引擎；保证 D3"API 完全不变"不注水 |

## Requirements

### R1：全形态定位（`position`）

- `bottom`：底部面板（对齐 HeroUI Native Bottom Sheet 观感，圆角上移 + `translateY` 进入动画 + safe-area-inset-bottom 补齐）
- `top`：顶部面板（圆角下移、`translateY(-100%→0)` 动画 + safe-area-inset-top 补齐）
- `left`：左侧面板（圆角右侧、`translateX(-100%→0)` 动画）
- `right`：右侧面板（圆角左侧、`translateX(100%→0)` 动画）
- `center`：居中弹窗（缩放动画 `translateY(+scale)` + overlay）
- `relative`：相对触发元素定位**不铺 overlay**、`borderRect` + `fixed` 计算、四向边缘翻转、scroll/resize 重算位置（含 float/auto 选项——上下空间感测选择最优方向）
- 各形态宽度约束：left/right/center 用 `max-width` token（可 props 覆盖）；bottom/top 自适宽度、贴边。

### R2：滚动锁定（`lockScroll`）

- `lockScroll: true`（默认）：打开时锁 `document.documentElement` 滚动（`overflow: hidden` + `paddingRight` 补滚动条宽度避免页面横跳），关闭时还原。
- `lockScroll: false`：不动 body。
- 逻辑走 `src/composables/useScrollLock.ts`（SSR 安全、onBeforeUnmount 清理）。

### R3：overlay + 关闭策略（`closeOnOverlay` / `closeOnEsc`）

- `closeOnOverlay: true`（默认）：点击 overlay 调 `requestClose()`，除 `position=relative` 本无 overlay。
- `closeOnEsc: true`（默认）：Esc 键调 `requestClose()`（relative 也 Esc 可关，但无 overlay 背景无 click）。键盘：打开后 `rootEl.focus()`（nextTick），若 rootEl 不天然可聚焦则 `tabindex=-1`。
- `close` emit 每次关闭发出（含 overlay/Esc/关闭按钮/v-model 外部写 false），`update:modelValue: false` 同时发出。

### R4：关闭按钮（`closeable` / `closeIconPosition`）

- `closeable: false`（默认）：无内置关闭图标。
- `closeable: true`：面板内渲染关闭图标按钮（Lucide `X`），默认位置 `top-right`；`closeIconPosition` 四向可选；点击调用 `requestClose`（→ `update:modelValue: false` + `close`）。

### R5：open/close 生命周期事件

- `open`：v-model 由 false→true 时 emit（DOM 已就绪，nextTick）。
- `close`：每次关闭 emit（含 overlay/Esc/关闭按钮/外部 v-model∶false）。
- `after-leave`：CSS 过渡结束后 emit（供宿主做销毁/清理，可选作用域）。

### R6：标题栏（`title` / `#title`）

- `title?: string`：prop 标题文本，无 slot 时自动绑定 `aria-labelledby`。
- `#title` slot：覆盖 prop，宿主自写标题区域。

### R7：content / body

- **必填** default slot：承载弹层内容。无 `min-height`；由内容与宿主驱动高度。
- 可选 `#footer` slot：底部操作区（居中形态经典用，贴边形态可选）。

### R8：Teleport

- 默认 `body`；复用 `useTeleportTarget`；`teleport?: string | HTMLElement | false`（false 就地渲染，向后兼容逃生口）。

### R9：视觉 token 与样式

- `src/styles/tokens.css` 新增：
  - `--h-popup-z`（默认 ≈1200，贴边/居中；relative 可覆盖低值 ≈1160 避免与 select 同层冲突）
  - `--h-popup-overlay-bg`（默认复用 `--h-bottom-sheet-overlay-bg: rgba(0,0,0,0.36)`）
  - `--h-popup-radius`（默认 `20px`）
  - `--h-popup-max-width-center`（默认 `420px`，继承 `--h-dialog-max-width`）
  - `--h-popup-max-width-side`（left/right 默认 `75vw` 或 `320px`）
  - `--h-popup-duration`（居中/贴边 panel 动画，默认 `220ms`）
  - `--h-popup-duration-overlay`（默认 `var(--h-duration-overlay, 220ms)`）
  - `--h-popup-close-gap` / `--h-popup-close-size`（关闭按钮尺寸/位置）
- `h-popup--position-*` BEM modifier 控制动画曲线（bottom: translateY(100%→0)、top: translateY(-100%→0)、left/right: translateX(±100%→0)、center: translateY(8px)+scale(0.96→1)）
- 贴边形态尊重 safe-area（`env(safe-area-inset-*)`）

### R10：`HBottomSheet` / `HDialog` 重构（API 不变）

- `HBottomSheet.vue` 内部改用 `<HPopup position="bottom" closeOnOverlay closeOnEsc showHandle lockScroll :title="..." :ariaLabel="..." :teleport="...">` + 保留 `#title` 与 default slot 透传。**导出名、props 集（modelValue/closeOnOverlay/showHandle/title/ariaLabel/teleport）、emits（update:modelValue/close）、`role="dialog"`（由 HPopup 提供）、`teleport` 默认 `body`、`closeOnOverlay` 默认 true、`showHandle` 默认 true——全部不变**。新增 `showHandle` 由 HPopup 内部渲染（`handle: boolean` prop），样式保持现有 `h-bottom-sheet__handle` 视觉效果。
- `HDialog.vue` 内部改用 `<HPopup position="center" closeOnOverlay closeOnEsc lockScroll :title="..." :description="..." :ariaLabel="..." :teleport="...">` + 保留 `#title/#description/default/#actions` slot 透传。导出名、props（modelValue/closeOnOverlay/closeOnEsc/title/description/ariaLabel/teleport）、emits（update:modelValue/close）、`role="dialog"`——全部不变。
- 过渡持续期：现有 dialog `180ms` vs HPopup center `220ms`——重构后 HPopup 默认用 `--h-popup-duration`；如有 token 级冲突，HDialog 复用的 HPopup 实例内可 `style` prop（`--h-popup-duration:180ms`）保持旧时序不变。

### R11：交付物清单

1. `src/composables/useScrollLock.ts`
2. `src/components/HPopup.vue`（含 `relative` 定位逻辑）
3. `src/styles/components/popup.css` + `src/styles/components.css` 导入
4. `src/styles/tokens.css` 中 `--h-popup-*` 与 `--h-z-popup`
5. 重构 `src/components/HBottomSheet.vue`：内部改走 HPopup（API 不变）
6. 重构 `src/components/HDialog.vue`：内部改走 HPopup（API 不变）
7. `src/styles/components/bottom-sheet.css` / `dialog.css` 样式是否合并到 popup.css 或保留为 empty proxy：决策 → **保留原文件但减重**：动画 keyframe 与 panel 装饰样式移入 popup.css（以 modifier `h-popup--position-bottom`/`center` 承载），bottom-sheet.css / dialog.css 仅保留 **别名导出**（eg `@import` 或空文件）使旧引用不炸，故而 `components.css` 仍 `@import` 它们、但实际规则来自 popup.css。
8. `src/index.ts` 导出 `HPopup`（HBottomSheet/HDialog 导出不变）
9. `docs/components/popup.md` + docs 侧栏入口（中文）
10. 更新 `.trellis/spec/frontend/component-guidelines.md`「当前导出」表
11. playground 演示段（覆盖 bottom/center/left/relative + closeable 用例）

## Acceptance Criteria

### AC: HPopup

- [ ] **AC1**: `position="bottom"` 底部面板：overlay 可见、面板 slide-up 动画、圆角上移、safe-area-bottom 补齐；`closeOnOverlay` 点蒙层关闭、Esc 关闭。
- [ ] **AC2**: `position="center"` 居中弹窗：overlay、缩放动画、`max-width` 限制、Esc 关闭。
- [ ] **AC3**: `position="top"/"left"/"right"` 对应贴边方向、各自位移动画与 safe-area 补齐。
- [ ] **AC4**: `position="relative"` 相对触发点定位：无 overlay、面板相对 trigger 出现（bottom/top 优先，翻转智能）、scroll/resize 时位置重算（不关闭）、窗口边界夹已防溢出。
- [ ] **AC5**: `lockScroll: true`（默认）打开时 body 不可滚；关闭后恢复。
- [ ] **AC6**: `closeable: false`（默认）无内置关闭按钮；`closeable: true` 渲染 X 图标并点击关闭。
- [ ] **AC7**: 键盘 Esc 关闭；open 时 `rootEl.focus()`；`role="dialog"` + `aria-modal="true"`（relative 仍 `role="dialog"` 但 `aria-modal="false"` 或无 modal）。
- [ ] **AC8**: `teleport` 默认 body；`teleport="false"` 就地渲染。
- [ ] **AC9**: `open`/`close` emits 正确触发。

### AC: HBottomSheet / HDialog 重构

- [ ] **AC10**: `HBottomSheet`/`HDialog` 在 `src/index.ts` 导出名不变、playground 现有演示段外观与行为无漂移。
- [ ] **AC11**: `HBottomSheet` prop `showHandle` 仍可控制拖拽条显隐（通过 HPopup 内部 `handle` prop 驱动）。
- [ ] **AC12**: `HDialog` prop `description` + `#description` / `#actions` slot 仍可用且输出与现有一致。
- [ ] **AC13**: 重构后两者均默认锁定 body 滚动。

### AC: useScrollLock

- [ ] **AC14**: `useScrollLock` SSR 安全不报错；`onBeforeUnmount` 自动还原 body style。

### AC: Token & 文档

- [ ] **AC15**: 新 `--h-popup-*` token 全在 `src/styles/tokens.css`；`--h-z-popup` 在 z-index 组正确位置。
- [ ] **AC16**: `npm run build:lib` 产物含 `popup.css`；`npm pack --dry-run` 不含源码/playground/任务目录。
- [ ] **AC17**: playground `npm run build:playground` 通过且新演示段可见可交互。
- [ ] **AC18**: `docs/components/popup.md` 中文页含 API 表 + 示例。

## Out of Scope

- 相对 trigger 定位时**跟随 Scrolling trigger 吸附**（滚动时重算位置但不跟随 anchor；与 React Aria `useOverlayPosition` `shouldUpdatePosition` 对齐、MVP 满足；若要完全跟随 anchor 移动另立需求）
- 内置 `before-close` 拦截 hook（受控 v-model 天然支持）
- popup 栈/队列管理（多弹层层级、历史返回关闭）
- 手势关闭 / snap-points（如 @gorhom/bottom-sheet 的 snap/detect、拖拽释放关闭）
- `HTooltip` / `HSelect` 重构为基于 HPopup（后续独立任务评审）
- `HToast` 与 HPopup 打通
- ResizeObserver 实时同步内容高度
- 触控热区 < 48px 的关闭按钮（走现有 `--h-touch-target`）
- `closeOnBack` 手机物理返回键拦截（宿主负责）
- 多步骤/流程式弹层（wizard、step-by-step）

## Risks

| 风险 | 缓解 |
|------|------|
| HBottomSheet/HDialog 重构后行为漂移（focus 时序、动画参数） | 严格对照现有 playground 演示；动画 token 复用旧值（180ms vs 220ms 按 D3 说明处理） |
| `lockScroll` 在多弹层并存时 body style 竞态 | 基于计数 ref 而非单布尔；useScrollLock 内引用计数器 |
| `relative` 定位计算复杂度与 HTooltip/HSelect 冲突 | 不与它们共享计算；HPopup 内源码独立 positionRelative 函数 |
| 新增 token 与旧 `--h-bottom-sheet-*` / `--h-dialog-*` 命名冲突 | 新增 `--h-popup-*`（带 popup 前缀）；旧 token 保留不做死但后续 task 可别名 |