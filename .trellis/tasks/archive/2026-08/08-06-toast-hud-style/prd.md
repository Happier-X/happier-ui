# Toast 改为深色 HUD 风格（对齐 wanchun/mini w-toast）

## Goal

当前 HToast 是"浅色卡片 + 左侧彩色竖条、停靠屏幕顶部/底部"的样式，用户认为太丑。目标是把 HToast 视觉重构为 wanchun/mini 项目 `components/ui/w-toast.vue` 的 iOS HUD / 微信原生 toast 风格，同时保持 happier-ui 的 `--h-*` token 体系与组件 API 契约。

## 已确认事实（仓库证据）

- 当前实现：`src/components/HToast.vue` + `src/styles/components/toast.css`。
- 当前 API：`modelValue`（v-model 显隐）、`variant`（default | success | warning | danger）、`position`（top | bottom，默认 bottom）、`duration`（>0 自动关闭，0 持续）、`teleport`（默认 'body'）、`#icon` 具名插槽、`close` / `update:modelValue` 事件。
- 当前样式：浅色底（`--h-color-surface`）、左侧 3px 语义色竖条（`--h-toast-accent`）、`top/bottom` 停靠、位移淡入动画。
- 无障碍：default/success 用 `role="status"` + `aria-live="polite"`；warning/danger 用 `role="alert"` + `aria-live="assertive"`；不抢占焦点。
- 目标参考（wanchun/mini `w-toast.vue`）：深色半透明圆角卡片 `rgba(#1C1C1E, 0.82)`、柔和阴影、max-width 80%；屏幕居中；入场动画 `scale(0.92) translateY(8rpx)` → `scale(1)`，0.22s ease-out；内容水平布局（左图标 + 右文字）；图标色 success `#A3E4BC` / warning `#F0D48A` / error `#F0A5A5`；文字白色；内置 Unicode 图标（✓/!/✕）；loading spinner 变体（本任务不做）。
- token 可用：`--h-color-surface-dark: #1f1f1f`、`--h-radius-md: 12px`、`--h-font-title: 15px`、`--h-space-sm: 8px` 等。
- 文档：`docs/components/toast.md` 需要同步更新。

## Requirements

- [R1] 视觉重构为深色 HUD 风格：深色半透明圆角卡片（`rgba(31,31,31,0.82)` 量级）、柔和阴影、白色文字、`min(480px, 80vw)` 最大宽度、内容水平布局。
- [R2·D1] 位置：默认改为屏幕居中（`center`）；保留 `position: top | bottom` 作为可选值，向后兼容；默认值由 `bottom` 改为 `center`。
- [R3·D2] 图标：内置语义图标默认显示（success ✓ / warning ! / danger ✕，浅色系）；`#icon` 插槽可覆盖内置图标（插槽优先）；新增 `icon?: boolean` prop（默认 true，`false` 时隐藏整个图标区含插槽，用于纯文字 toast）。
- [R4·D3] 不做 loading 变体（后续独立开发 HLoading 组件）。
- [R5·D4] 不引入遮罩层；居中用纯 CSS（`position: fixed` + translate），保持完全非阻塞。
- [R6] 入场动画改为缩放淡入（scale 0.92 + 方向位移，0.22s ease-out）；尊重 `prefers-reduced-motion`。
- [R7] 无障碍契约不变：role/aria-live 按 variant 区分；内置图标 `aria-hidden` 装饰性。
- [R8] 其余 API 不变：`modelValue` / `duration` / `teleport` / `close` / `update:modelValue`。
- [R9] token 化：颜色/圆角/阴影/间距走 `--h-*` token（tokens.css Toast 段 + 新增 `--h-color-surface-dark-rgb`）；不引入魔法数。

## Acceptance Criteria

- [ ] `npm run dev:playground`：默认 toast 在**屏幕居中**显示深色 HUD 卡片（深底/白字/圆角/阴影）；`position="top"` / `position="bottom"` 仍按顶部/底部停靠
- [ ] 四种 variant（default/success/warning/danger）卡片观感一致为深色 HUD；success/warning/danger 默认显示对应内置图标（✓/!/✕，浅色），default 无内置图标
- [ ] 传入 `#icon` 插槽时渲染插槽图标而非内置图标；`icon=false` 时整个图标区（含插槽）不渲染，仅剩文字
- [ ] 入场为缩放淡入动画；`prefers-reduced-motion: reduce` 下无动画
- [ ] 无遮罩层（DOM 中无全屏覆盖元素）；卡片非阻塞、点击穿透
- [ ] `duration` 自动关闭、`duration=0` 持续展示、`close` 事件、teleport（默认 body / `false` 就地）行为不变
- [ ] 屏幕阅读器语义不变：success/default → status+polite；warning/danger → alert+assertive
- [ ] `npm run build:lib` 通过；`npm run docs:build` 通过
- [ ] `docs/components/toast.md` 与 playground 演示已同步新观感与 API（position 增加 center、icon prop）
- [ ] `.trellis/spec/frontend/component-guidelines.md`「当前导出」与「API 约定」HToast 行已更新

## Out of Scope

- loading 变体 / spinner（用户明确：后续独立开发 HLoading 组件）
- 遮罩层 / 加载态阻断语义（留给 HLoading）
- 全局命令式 toast API、队列与堆叠（宿主负责，现状不变）
- 移除 `position: top | bottom`（保留向后兼容）

## Notes

- 用户明确：本任务**不做 loading 变体**；开发完本任务后，**后续再开发独立的 HLoading 组件**（loading spinner，参考 wanchun/mini `w-toast.vue` 的 spinner 样式：32rpx 圆环、白/浅色、0.7s 线性旋转）。
