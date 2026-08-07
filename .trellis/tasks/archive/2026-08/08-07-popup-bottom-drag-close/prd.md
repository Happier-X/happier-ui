# popup bottom 面板支持拖拽关闭（Issue #16）

## Goal

让 `HPopup` 的 `position="bottom"`（bottom sheet）支持原生 iOS/Android 式**拖拽关闭**：在面板顶部区域（或整个面板，scrollTop=0 时）向下拖动，面板跟随手指位移、遮罩渐隐；位移 ≥ 阈值或快速下滑松手后平滑滑出视口并关闭；未达阈值松手回弹。当前仅有 `fullscreen` 有下滑手势，`handle` 只是纯装饰。

关联 Issue：`#16`（enhancement）。复现场景：Muses 播放队列面板 `<h-popup position="bottom" handle>` 拖动无反馈。

## Background

- `HPopup.vue` 已有完整手势状态机（仅限 `fullscreen`）：`onTouchStart`（scrollTop=0 才接管）/ `onTouchMove`（向下+未滚动时 preventDefault）/ `onTouchEnd`（阈值/速度判定 + snapping 回弹）。常量 `SWIPE_DISTANCE_THRESHOLD=80`、`SWIPE_VELOCITY_THRESHOLD=0.3`、`SWIPE_SNAP_DURATION=250`。
- `swipeClose` prop（默认 `true`）当前仅控制 fullscreen 手势，文档注明"其他 position 无作用"。
- bottom 面板无离场 Transition（`h-popup-fade` 无任何 CSS 规则，关闭即卸载消失）；入场靠 panel `animation: h-popup-slide-up`。
- `handle` prop（bottom 专属）渲染纯视觉手柄，无任何交互绑定。
- 参考视觉 HeroUI Native Bottom Sheet（整面板可拖、拖动手柄/内容均可关闭）。

## Requirements

### R1：手势范围

- 手势启用：`position === 'bottom'`（默认开启）——**整面板可拖**（含 handle、头部、scrollTop=0 时的内容区），与 fullscreen 相同判定规则。
- `fullscreen` 手势行为**逐项保持不变**（零回归）。
- `top / left / right / center / relative` 不新增手势。

### R2：API 与开关

- **不新增 prop**：复用现有 `swipeClose`（默认 `true`），语义扩展为「bottom / fullscreen 下滑关闭手势开关」。
- `swipeClose: false` + bottom：手势完全禁用（touch 监听早退、不 preventDefault），面板 `touch-action` 复位 `auto`。
- 拖拽起点必须落在 **panel 内部**（`panel.contains(target)`），overlay 区域起拖不触发。

### R3：拖动跟随与遮罩

- 向下拖（deltaY > 0）时 panel `transform: translateY(delta)`；遮罩透明度随 delta 线性降低：`opacity = max(0, 1 - delta / viewportHeight)`。
- 向上 / 横向拖动不接管，交还内容。

### R4：关闭判定与离场

- 松手时位移 ≥ 80px **或** 速度 ≥ 0.3 px/ms → 关闭。
- **bottom 离场**：先 `swipeDeltaY → viewportHeight` 平滑滑出（snapping transition 250ms ease-out，遮罩同步渐隐），滑出结束后再 `requestClose()`（emit `update:modelValue(false)` + `close`）——bottom 无离场 Transition，直接卸载时面板已在视口外，无跳变。
- **fullscreen 离场**：保持现有实现（复位 + 立即 requestClose，离场动画由 `h-popup-fullscreen-out` 承担）。

### R5：回弹

- 未达阈值：250ms ease-out 回弹到 0（复用现有 snapping 机制），不关闭。

### R6：滚动冲突

- `panel.scrollTop > 0` 时不接管（touchstart 与 touchmove 均检查，现有逻辑）。
- 接管后 `preventDefault` 阻止下拉刷新/过度滚动。
- 拖动期 `touch-action: none` 锁面板滚动；平时 `touch-action: pan-y` + `overscroll-behavior-y: contain`（镜像 fullscreen 已验证方案）。
- 新 touch 落在 snapping（滑出/回弹）期间时忽略，避免打断过渡。

### R7：视觉

- 拖动期禁用入场 `animation`（`h-popup-slide-up`），transform 直接跟随手指；snapping 期 `transition: transform 250ms`。
- `handle` 保持纯视觉，无额外交互。

### R8：文档与演示

- `docs/components/popup.md`：bottom 段补充拖拽关闭说明与演示（含可滚动内容对照）；`swipeClose` API 行与「行为说明」更新为 bottom/fullscreen 双形态。
- `playground/src/App.vue`：bottom 演示加滚动内容，验证拖拽与滚动不打架。

## Acceptance Criteria

- [ ] **AC1**：`position="bottom"` 下，在面板内（scrollTop=0）向下拖 → 面板跟随位移、遮罩透明度同步降低。
- [ ] **AC2**：位移 ≥ 80px 或速度 ≥ 0.3 px/ms 松手 → 面板平滑滑出视口后关闭（emit `close` + `update:modelValue(false)`）。
- [ ] **AC3**：未达阈值松手 → 250ms 内回弹原位，不关闭。
- [ ] **AC4**：面板内容滚动后（scrollTop > 0）向下拖 → 不接管，内容正常滚动。
- [ ] **AC5**：从 overlay 区域起拖 → 无任何面板位移。
- [ ] **AC6**：`swipe-close="false"` + bottom → 手势禁用、`touch-action` 复位 `auto`。
- [ ] **AC7**：fullscreen 手势行为与改动前一致（无回归）；其他 5 种 position 无手势、无回归。
- [ ] **AC8**：向上/横向拖动不接管。
- [ ] **AC9**：`npx vue-tsc --noEmit -p tsconfig.lib.json` 零错误；`build:lib` / `build:playground` / `docs:build` 全通过；docs/playground 演示可交互。
- [ ] **AC10**：不新增 prop/emit；公共 API（HPopup / HBottomSheet）签名不变。

## Out of Scope

- `top` 形态手势（top sheet 直觉是上滑关闭，另一套方向逻辑——future）
- pointer/mouse 拖拽（仅 touch，同 fullscreen 既有决策）
- 多指 / 捏合识别
- 速度曲线定制（固定 0.3 px/ms）
- bottom 无离场 Transition 的改造（本轮手势滑出即离场，不改动既有关闭路径）
- `swipeCloseOnDrag` 等新 prop（复用 swipeClose，避免 API 膨胀）

## Risks

| 风险 | 缓解 |
|------|------|
| bottom 默认开启手势改变现有消费方触屏行为 | 仅 scrollTop=0 且向下拖才接管，与 fullscreen 同规则、同阈值；`swipeClose=false` 可整体关闭；文档注明默认值 |
| 面板内含独立滚动容器（scrollTop 检测在 panel 自身） | 与 fullscreen 相同已知边界，文档注明；不在本轮引入容器递归检测 |
| 手势期间与入场动画/回弹冲突 | dragging 期 `animation:none` + `transition:none`；snapping 期新 touch 忽略 |
| bottom 滑出后卸载瞬间回跳 | 滑出目标 = viewportHeight，面板已在视口外；卸载无离场动画，无跳变窗口 |
