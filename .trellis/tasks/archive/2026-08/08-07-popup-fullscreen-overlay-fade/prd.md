# fullscreen 拖拽时遮罩渐隐失效修复

## Goal

修复 `HPopup` `position="fullscreen"` 下滑关闭手势期间遮罩（overlay）透明度不随位移渐隐的问题——拖拽时遮罩应随 deltaY 线性变淡（`opacity = max(0, 1 - delta/viewportHeight)`），滑出/回弹期随 snapping 过渡同步渐变。当前遮罩纹丝不动（恒为 1），滑出后卸载瞬间从全不透明突然消失，破坏手势物理感。

## Background

- `HPopup.vue` 的 `gestureOverlayStyle` 为 fullscreen/bottom 在手势期写 inline `opacity`。
- bottom 侧已在上轮（`864c8fa`）修复：`animation-fill-mode: both` 的入场动画终值优先级高于 inline style，压掉渐隐；修复 = 手势态（dragging/snapping）给 overlay 加 `animation: none`。
- fullscreen 侧**同款既有 bug**，上轮因「AC7 fullscreen 零回归」约束未动，已记入 `.trellis/spec/frontend/component-guidelines.md` 已知问题。

## Requirements

### R1：修复内容

- `.h-popup--position-fullscreen.h-popup--dragging .h-popup__overlay` 与 `.h-popup--position-fullscreen.h-popup--snapping .h-popup__overlay` 增加 `animation: none`（镜像 bottom 修复）。
- 特异性 (0,3,1) 高于基础 `.h-popup--position-fullscreen .h-popup__overlay` (0,2,1)。
- 不改 JS；不改入场/离场动画本身（打开时 overlay 淡入照常）。

### R2：行为

- 拖动期：遮罩随 delta 渐隐（手势期 overlay 不再被动画 fill 锁定为 1）。
- 滑出/回弹期：`transition: opacity 250ms`（既有规则）生效，遮罩同步渐变。
- 未手势时（打开/关闭）：`h-popup-overlay-in` 入场动画与 fullscreen 离场动画行为不变（零回归）。

## Acceptance Criteria

- [ ] **AC1**：fullscreen 拖动面板时遮罩透明度随位移降低（delta=viewportHeight → 0）。
- [ ] **AC2**：未达阈值回弹期遮罩随 250ms 过渡恢复全不透明。
- [ ] **AC3**：滑出关闭期遮罩随 250ms 过渡渐隐至透明，卸载无跳变。
- [ ] **AC4**：正常打开/关闭（overlay/Esc/X/按钮）动画不变；swipeClose=false 不受影响。
- [ ] **AC5**：`npx vue-tsc --noEmit -p tsconfig.lib.json` 零错误；`build:lib` / `build:playground` / `docs:build` 通过；dist/styles.css 含新规则。

## Out of Scope

- bottom 侧修复确认（`864c8fa` 已含，仅回归抽查）
- JS/手势逻辑改动
- top 形态上滑关闭手势（future）

## Risks

| 风险 | 缓解 |
|------|------|
| 改动影响既有 fullscreen 关闭动画 | 仅在 dragging/snapping 修饰类下生效，非手势路径 class 不出现，动画不变 |
| 与离场动画（h-popup-fullscreen-out）叠加 | 离场 class 作用在 slot-anchor，手势态在卸载前已复位，无交集 |
