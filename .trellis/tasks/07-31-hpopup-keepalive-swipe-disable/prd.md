# HPopup keepAlive 保活选项 + fullscreen 下滑手势禁用开关

## Goal

Muses（宿主 app）希望把沉浸式播放器 PlayerPage 从自建 overlay 迁移到 `HPopup position="fullscreen"`（GitHub issue #13）。当前 happier-ui@0.0.7 的 HPopup 有两个能力缺口：关闭即卸载 slot 内容（`v-if="visible"`），以及 fullscreen 下滑手势无法关闭。本任务为 HPopup 增加两个增强选项，使宿主迁移可行，同时保持 0.0.7 既有行为零回归。

## Background（已确认事实，来自 issue #13 + 代码证据）

- `src/components/HPopup.vue`：slot 锚点用 `<div v-if="visible" :key="transitionKey" class="h-popup__slot-anchor">`，关闭即卸载内容；`transitionKey` 每次打开自增强制重挂载以重放入场动画。
- fullscreen 下滑手势：`onTouchStart/Move/End` 绑定在 `rootEl`，仅在 `position==='fullscreen' && visible` 且 panel `scrollTop===0` 时接管；≥80px 或 ≥0.3px/ms 触发 `requestClose()`，否则 250ms 回弹。手势期间 panel 设 `touch-action: none`（`.h-popup--dragging`）。
- fullscreen panel CSS：`touch-action: pan-y; overscroll-behavior-y: contain`（`src/styles/components/popup.css`）。
- Muses PlayerPage 已有 200+ 行自建手势（横向切面板、纵向关闭、进度条 seek 含 `seekGestureLocked`/`touch-action-none`），且面板含多个独立滚动容器，会让 HPopup 的 `panel.scrollTop===0` 判断失效。
- PlayerPage 关闭再打开时，AMLL `BackgroundRender`（WebGL 动态背景）若重建会闪默认底；宿主当前靠"组件常驻 + `visibility:hidden` + `contain:paint`"保活。
- 验收要求转场动画、滚动锁（useScrollLock）、z-index 行为与现状一致。
- 验证手段：`npm run build:lib` / `build:playground` / `docs:build`（无单测设施）；playground `App.vue` 有 HPopup 演示段；`docs/components/popup.md` 有 API 表。

## Requirements

### R1：keepAlive 保活选项（prop `keepAlive?: boolean`，默认 `false`）

- `false`（默认）：行为与 0.0.7 完全一致——关闭卸载内容、打开重挂载并重放入场动画。
- `true`：slot 锚点常驻 DOM（首次渲染即挂载），关闭仅隐藏（`display:none`），再打开时内容不重建、入场动画照常重放；AMLL 背景 DOM 不销毁。
- 隐藏态不响应任何交互：overlay 点击 / Esc / close icon / 手势均不触发（现有 `rootStyle` visibility:hidden + pointer-events:none 保证）。
- 滚动锁（useScrollLock）仍随 `visible` 释放/恢复，与 keepAlive 无关。
- 对全部 7 种 position 通用（不仅 fullscreen）。

### R2：fullscreen 下滑手势禁用开关（prop `swipeClose?: boolean`，默认 `true`）

- 仅在 `position="fullscreen"` 有意义，其他 position 为 no-op。
- `false`：关闭内置下滑手势——touch 监听不再生效（无 preventDefault），面板 `touch-action` 从 `pan-y` 复位为 `auto`（宿主全权控制手势）。
- `true`（默认）：与 0.0.7 完全一致。
- 保留：转场动画、useScrollLock、overlay/Esc/closeable 关闭通道、z-index 行为不变。
- `modelValue`/`requestClose` 链路不变——宿主用自己的手势调 `update:modelValue(false)` 关闭。

### R3：文档与演示

- 更新 `docs/components/popup.md`：Props 表新增 `keepAlive` / `swipeClose`，fullscreen 段补充说明与示例。
- playground `App.vue` HPopup 演示段补充新 prop 用例（keepAlive 计数器保活 + swipeClose 关闭手势演示）。

## Acceptance Criteria

- [ ] **AC1**: `keepAlive=false`（默认）时 0.0.7 行为完全不变——关闭卸载、打开重挂载重放入场动画（无回归）。
- [ ] **AC2**: `keepAlive=true` 时关闭后 slot 内容不卸载；再打开内容仍在（不重建）、入场动画重放；首次渲染即挂载。
- [ ] **AC3**: keepAlive 隐藏态无任何交互响应（overlay 点击/Esc/手势不触发关闭）；滚动锁随 visible 正常释放恢复。
- [ ] **AC4**: `swipeClose=false` 时 fullscreen 不再响应下滑关闭（touch 监听不生效），面板 `touch-action: auto`。
- [ ] **AC5**: `swipeClose=false` 时转场动画、滚动锁、overlay/Esc/closeable 关闭、z-index 与现状一致。
- [ ] **AC6**: 其他 6 种 position 与默认 prop 组合无回归。
- [ ] **AC7**: `npm run build:lib` / `build:playground` / `docs:build` 全绿；`dist/HPopup.vue.d.ts` 含新 prop 类型；`dist/styles.css` 含 swipe-disabled 规则。
- [ ] **AC8**: 文档 `docs/components/popup.md` 更新到位（API 表 + 示例）。

## Out of Scope

- HBottomSheet / HDialog 薄包装透传 keepAlive / swipeClose prop（Muses 直接用 HPopup；包装保持现有 API 不动）。
- `dismissable` 语义（一并禁用 overlay/Esc/closeable）——本任务只禁手势。
- 发布 npm 版本（发布作为独立后续任务，同 0.0.7 流程）。
- 双指捏合/缩放等新手势。
- 自定义手势参数（阈值等）暴露。

## Key Decisions（已与用户确认）

| # | 决策 | 选择 | 理由 |
|---|------|------|------|
| D1 | keepAlive prop 命名 | **`keepAlive`**（默认 `false`） | 与 Vue `<KeepAlive>` 心智一致，issue 原文建议 |
| D2 | 手势禁用 prop 命名 | **`swipeClose`**（默认 `true`） | 与现有正向命名家族一致（`closeOnEsc`/`closeOnOverlay`/`lockScroll`/`closeable`）；`dismissable` 语义过宽（易误解为连 overlay/Esc 一起禁） |
