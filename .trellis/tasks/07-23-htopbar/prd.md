# 新增顶部导航栏组件

## Goal

新增纯 Vue **顶部导航栏**组件：页面标题区、左右操作区、`fixed` / 顶部 `safe-area`、`--h-*`；导出 + playground + spec。  
**不**内置 Vue Router / 导航栈 / 返回历史。

## 背景（已确认）

- 当前导出含 `HTabBar`、`HButton`、`HIcon` 等；tokens 有 `--h-z-tab` 等层级，**尚无**独立 top-bar 高度/token。
- 路线图曾提 `HPageShell`（标题区+content+安全区布局壳）；本任务先做**顶栏本身**，不做整页壳。
- `HTabBar` 先例：`fixed` / `safeArea` 默认 `true` 且可独立关闭；无路由。
- 视觉对齐 HeroUI Native 移动端；无 Material elevation。
- 范围仅 happier-ui（不改 Muses）。

## 已确认决策

- 命名：**`HNavBar`**（类名 `h-nav-bar` / `h-nav-bar__*`）；文档强调无路由
- 左侧：保留 `#left` 插槽；左侧交互由宿主放入，组件暴露 `handleLeftClick` 事件（模板监听 `@handle-left-click`）
- 右侧：保留 `#right` 插槽；右侧交互由宿主放入，组件暴露 `handleRightClick` 事件（模板监听 `@handle-right-click`）
- 事件不调用 Router 或 `history.back()`，仅通知宿主
- 两个事件由组件分别监听 `#left` / `#right` 区域的 click，并透传 `MouseEvent`

## 已确认决策

- 标题：`title?: string` + `#title` 插槽；存在插槽时覆盖 prop 文本
- `fixed` / `safeArea`：两个 prop 默认均为 `true`，可独立关闭，与 `HTabBar` 一致
- 高度：新增 `--h-nav-bar-height: 56px`；顶部安全区 padding 额外叠加，不挤压内容高度
- 标题定位：始终相对导航栏视口水平居中，左右插槽宽度不影响标题中心
- 暂不提供 `subtitle` prop；多行或复杂标题由 `#title` 插槽自行实现
- 根元素使用语义化 `<header>`，不使用 `<nav>`，避免暗示内置导航链接
- 标题单行显示，超出可用区域时省略；不换行、不与左右插槽重叠
- 内置返回：`showBack?: boolean`（默认 false）；为 true 且无 `#left` 时显示图标按钮；`#left` 优先覆盖
- 点击内置返回按钮或 `#left` 区域均触发 `handleLeftClick`；组件不执行实际返回
- `#right` 无默认内容
- 内置返回按钮支持 `backAriaLabel?: string`，默认值为「返回」
- 默认 `title` 文本使用 `<h1>`；使用 `#title` 时标题语义由宿主负责

## MVP 需求

| 能力 | 约定 |
|------|----------------|
| 命名 | 导出 `HNavBar`；类名 `h-nav-bar` / `h-nav-bar__*` |
| 标题 | `title?: string` 默认渲染 `<h1>`；可选 `#title` 覆盖；视觉上始终水平居中；单行省略；MVP 无 subtitle prop |
| 左右 | `#left` / `#right` 插槽；`showBack` 可提供默认左侧图标按钮，`#left` 覆盖；组件监听对应区域 click，emit `handleLeftClick` / `handleRightClick`（模板使用 kebab-case）；返回按钮支持 `backAriaLabel` |
| 布局 | `fixed?: boolean` 与 `safeArea?: boolean` 默认均为 `true`，可独立关闭；顶部安全区使用 `env(safe-area-inset-top)` |
| 视觉 | surface + 底部分割线；`--h-nav-bar-height`（默认 56px）；无 elevation |
| 导出 / 演示 | playground 演示返回+标题+右侧操作 |
| 文档 / spec | README + component-guidelines / tokens / quality |

## 明确不做

- 不内置 Vue Router / 返回历史
- 不做完整 `HPageShell` / ion-header 引擎
- 不做大标题折叠（large title collapse）
- 不改 Muses

## Acceptance Criteria

- [x] 存在 `src/components/HNavBar.vue` 并导出 `HNavBar`
- [x] 标题 + `#title` / `#left` / `#right` 可演示；`showBack` 默认按钮可用
- [x] `fixed` / `safeArea` 默认均为 true 且可独立关闭；顶部安全区适配正确
- [x] `npm run build:playground` 通过
- [x] 更新 README / component-guidelines / tokens / quality

## Notes

- 中等任务：收敛 API 后补 `design.md` / `implement.md`。
