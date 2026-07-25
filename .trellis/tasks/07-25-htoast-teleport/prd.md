# HToast 默认 Teleport 到 body（浮层定位修复）

对应 GitHub issue #7。

## Goal

让 `HToast` 默认 `Teleport` 到 `body`，逃离带有 `transform` / `contain: layout` / `filter` / `will-change` 等属性的祖先所造成的 `position: fixed` 包含块偏移，从根本上消除「渲染成功但看不见 / 错位」的浮层定位失效。

## Background

在带 `contain: layout`（如 Ionic `ion-page`）或 `transform` 祖先的宿主里，`fixed` 后代会相对该祖先而非视口定位（CSS Containment §3 / MDN fixed 例外条款）。`HToast` 当前就地渲染、无 Teleport，其 `bottom/top` 参考系被宿主劫持，导致 toast 出现在不可见位置。这类祖先属性通常来自框架层（Ionic、路由转场、动画库），消费方无法改动。

主流库（Element Plus / Ant Design Vue / Vant / Naive UI / PrimeVue）的 toast 均默认 teleport 到 body。仓库内 `HFloatingBubble` 已有 `teleport` 默认 `body` 的先例，本次对齐其模式。

## Requirements

- `HToast` 新增 `teleport?: string | HTMLElement | false` prop，默认 `'body'`。
  - 传选择器 / 元素：teleport 到指定容器。
  - 传 `false`：保留就地渲染（向后兼容逃生口），`<Teleport :disabled>`。
- 用 `<Teleport>` 包裹现有根节点，不改动 toast 自身的 DOM 结构、类名、live-region 语义、计时 / 关闭契约。
- 复核并对齐 `HDialog`、`HBottomSheet` 两个浮层组件：为二者补充同形状的 `teleport` prop（默认 `body`），消除同类祖先包含块问题。保持各自 overlay / Esc / 焦点与关闭契约不变。
- 更新组件顶部注释（移除「无 Portal / Teleport」表述）。
- 更新 `.trellis/spec/frontend/component-guidelines.md` 的相关行（HToast / HDialog / HBottomSheet 的 API 约定、当前导出表、参考实现描述）。
- playground 增补或校验演示，docs 组件页补 `teleport` API 说明。

## Constraints

- 不引入新依赖；仅用 Vue 内置 `Teleport`。
- 不改 `h-*` 类名与 token；样式文件无需结构性改动。
- 向后兼容：默认行为变化（就地 → body）是有意为之，通过 `teleport={false}` 提供回退。

## Acceptance Criteria

- [ ] `HToast` 默认 teleport 到 body；`teleport` 传选择器 / 元素 / `false` 均按预期工作。
- [ ] `HDialog`、`HBottomSheet` 同步获得 `teleport` prop（默认 body），关闭 / Esc / overlay 行为不回归。
- [ ] toast / dialog / bottom-sheet 在带 `transform` 或 `contain: layout` 的祖先容器内定位正确（playground 可目视验证）。
- [ ] 三个组件顶部注释与 `component-guidelines.md` 更新到位，无残留「无 Teleport」表述。
- [ ] `npm run build` 与类型检查通过。

## Notes

- 参考：CSS Containment L1 §3；MDN `position: fixed` 例外；`@ionic/core` `ion-page` 样式。
- 先例实现：`src/components/HFloatingBubble.vue` 的 `teleport` prop 写法。
