# Toast 轻提示组件

## Goal

为 Web 与移动端 Vue 宿主提供短暂、非阻塞的操作反馈，视觉与 happier-ui 现有 HeroUI Native 风格保持一致。

## Background

- 公共组件使用 `H*` 命名、`h-*` BEM 类，并从 `src/index.ts` 导出。
- 视觉样式集中在 `src/styles/components/*.css`，所有新增数值使用 `--h-*` token。
- 新组件必须提供 playground 演示，并同步组件文档与前端组件规范。
- 现有浮层组件采用声明式 Vue API，且项目原则要求宿主负责复杂引擎能力。
- MVP 采用声明式单条组件；全局命令式调用、队列和堆叠由宿主负责。

## Requirements

- 提供 `HToast` 轻提示组件，通过 `modelValue` / `update:modelValue` 控制显示状态。
- `variant` 支持 `default | success | warning | danger`，默认 `default`；允许通过 `icon` 具名插槽提供图标，默认插槽承载消息内容。
- `position` 支持 `top | bottom`，默认 `bottom`；位置固定于视口并考虑对应方向的 safe-area，窄屏内容不得溢出。
- `duration` 默认 `3000` 毫秒；大于 `0` 时在每次由隐藏变为显示后重新计时，`0` 表示不自动关闭。
- 自动关闭时发出 `update:modelValue(false)` 和 `close`；组件卸载或提前隐藏时清理计时器，外部隐藏不重复发出 `close`。
- 使用适当的 live-region 语义，使辅助技术可感知提示但不抢占键盘焦点。
- 动效遵循现有时长与缓动 token，并尊重 `prefers-reduced-motion`。
- 在 playground 展示状态、位置和自动关闭行为，并新增公共组件文档。

## Acceptance Criteria

- [ ] 宿主可显示和关闭单个 Toast，并接收关闭事件。
- [ ] Toast 可在指定时长后自动关闭，禁用自动关闭时保持展示。
- [ ] 四种语义状态具有可区分且 token 化的视觉表现。
- [ ] 顶部、底部位置在桌面端和移动端均不溢出，并考虑 safe-area。
- [ ] Toast 具备 live-region 无障碍语义，不主动获取焦点。
- [ ] 组件、样式、导出、playground、文档和规范同步完成。
- [ ] 类型检查与构建通过。

## Out Of Scope

- 操作按钮、手动关闭按钮、撤销流程或复杂业务交互。
- 全局命令式 API、队列、堆叠和并发调度。
- 与路由、网络请求或状态管理库绑定。
- Portal/Teleport 和跨窗口渲染。
