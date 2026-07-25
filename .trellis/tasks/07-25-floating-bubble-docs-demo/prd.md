# FloatingBubble 文档补 live demo

## Goal

给 `docs/components/floating-bubble.md` 补上像 toast/dialog/icon 那样的 **live demo**（`<div class="h-demo">` 内联真实渲染），让用户在文档里能直接看到并交互浮动气泡，而不只是读 ```vue 代码块。

## Background

其余组件文档（toast/dialog/icon/cell/card…）都在 markdown 顶部写 `<script setup>` + `<div class="h-demo">` 内联真实组件；floating-bubble.md 目前**只有 ```vue 代码块**，没有任何可交互 live demo，体验与其它组件页不一致。

`HFloatingBubble` 是 `position: fixed` 元素，且内部 `getBounds()` 按 `window.innerWidth/Height` 计算边界。直接常驻 live demo 会浮在整页视口、盖住文档内容，不能像展示 Button 那样直接内联平铺。

## Requirements

- 在 `docs/components/floating-bubble.md` 顶部加 `<script setup>`，引入 `HFloatingBubble` / `HButton` 与 Lucide 图标（`@lucide/vue`，与 icon.md 一致）。
- live demo 采用 **按钮切换显隐**（对齐 toast/dialog 的交互演示范式）：
  - 用 `v-if` 或开关状态挂载/卸载气泡（组件无 visibility v-model，用布尔 ref + `v-if`）。
  - 气泡真实 teleport 到 body、真实 fixed 定位，用户点按钮后能看到它浮在视口、可拖拽 / 磁吸，再点按钮关闭。
  - demo 区用一句 `h-demo__hint` 说明「气泡会浮在页面视口右下角，可拖拽」。
- 覆盖关键能力的 live demo（可合并到 1-2 个开关里，避免多个气泡同时浮现互相遮挡）：
  - 基础（`axis="y"` 纵向拖拽 + icon）。
  - 自由拖拽 + 磁吸（`axis="xy"` + `magnetic="x"`）。
  - 位置监听：显示当前 `offset`（用 `@offset-change` 或 `v-model:offset`）。
- 现有 ```vue 代码块保留（作为「拷贝即用」参考）；live demo 是**增补**，不删除说明性代码块。
- 同一时刻最多只显示一个浮动气泡，避免多个 fixed 气泡重叠在同一角落。
- `ariaLabel` 必填契约不变；demo 里正确传 `ariaLabel`。

## Constraints

- 不改组件源码 / 样式 / token；仅改 `docs/components/floating-bubble.md`。
- 不引入新依赖；Lucide 图标走既有 `@lucide/vue` peer（docs 环境已具备，见 icon.md）。
- 不破坏 VitePress 构建；`npm run docs:build` 需通过。
- 复用现有 `h-demo` / `h-demo--stack` / `h-demo--row` / `h-demo__hint` 文档样式类，不新增 CSS。

## Acceptance Criteria

- [ ] `floating-bubble.md` 有可交互 live demo：点按钮浮出真实气泡，可拖拽 / 磁吸，再点关闭。
- [ ] 覆盖基础、自由拖拽 + 磁吸、位置监听三类能力，且同一时刻不超过一个气泡浮现。
- [ ] 现有 ```vue 代码块与 API 表保留完整。
- [ ] `npm run docs:build` 通过。
- [ ] 未改动任何组件源码 / 样式 / token 文件。

## Notes

- 参考现有 live demo 写法：`docs/components/toast.md`、`dialog.md`（按钮切换 + `h-demo` 内联）、`icon.md`（Lucide 图标引入）。
- 气泡 fixed 浮在视口是预期行为；demo 用「点按钮浮出 / 关闭」控制生命周期，避免常驻遮挡文档。
