# 新增 HCell / HCellGroup 设置列表组件

## Goal

为 Web 与移动端 Vue 宿主提供「设置页 / 菜单列表」常用的行组件与分组容器，视觉对齐 HeroUI Native 的 ListGroup 模式（Surface 分组容器 + 可按压行 + 前缀/内容/后缀 + 分隔线），用于替代宿主里散落的 `ion-item` / `ion-list` 手写行。

## Background

- 公共组件使用 `H*` 命名、`h-*` BEM 类，从 `src/index.ts` 导出；视觉走 `--h-*` token，CSS 放 `src/styles/components/*.css`，模板不写大块 scoped 视觉。
- 历史 `HListRow` / `HSettingRow` / `HListSection` 已在 `07-22-remove-legacy-primitives`（decision C）删除，连同 `M*` 兼容别名。本任务以全新 API 重建，不恢复旧名与旧别名。
- HeroUI Native `ListGroup` 结构参考（`heroui.com/docs/native/components/list-group`）：
  - `ListGroup`：Surface 容器，圆角、统一间距，分组相关 item。
  - `ListGroup.Item`：横向 flex 行，可按压。
  - `ListGroup.ItemPrefix`：前缀槽（图标 / 头像）。
  - `ListGroup.ItemContent` + `ItemTitle` + `ItemDescription`：主文本 + 次要说明。
  - `ListGroup.ItemSuffix`：后缀槽（chevron / 值 / Chip）。
  - `Separator`：item 之间的分隔线。
- 现有可复用范式：`HCard`（纯展示容器 + 具名 slot）、被删的 `HSettingRow`（props: label/description/lines/interactive + `#end` 槽 + role=button 键盘激活）与 `HListSection`（title/inset + `#header`/default 槽）。
- 语义色 / 圆角 / 间距 token 已就位：`--h-color-surface` / `--h-color-separator` / `--h-radius-control` / `--h-space-*` / `--h-touch-target` / `--h-color-focus-ring` / `--h-color-ink` / `--h-color-ink-muted`。

## Requirements

- 提供分组容器 `HCellGroup` 与行组件 `HCell` 两个独立组件；采用用户确认的方案 A（props + 具名 slots），不做 HeroUI 式 compound 子组件，不导出 `HCellTitle` 等。
- `HCell` props：
  - `title: string`（必填）：主标题。
  - `description?: string`：次要说明，展示在标题下方。
  - `clickable?: boolean`（默认 `false`）：为 true 时整行可交互（`role="button"` + `tabindex="0"` + Enter/Space 激活 + emit `click`）；为 false 时纯展示且不响应行点击。
  - `showChevron?: boolean`（默认跟随 `clickable`）：控制导航 chevron；即使有 `#suffix`，chevron 仍位于 suffix 之后。
  - `ariaLabel?: string`：需要覆盖可见标题时的可访问名称。
- `HCell` slots：`#prefix`（图标/头像）、`#suffix`（值/Chip/控件）；标题和描述由 props 提供，不提供 default 内容槽，保持设置行结构稳定。
- `HCell` emit：`click: [event: MouseEvent | KeyboardEvent]`，仅 `clickable=true` 时触发。
- `HCellGroup` props：
  - `title?: string`：分组标题。
  - `inset?: boolean`（默认 `true`）：圆角 Surface 卡片；false 为全宽 flat 分组。
- `HCellGroup` slots：`#header`（覆盖 title）与 default（放 `HCell`）。
- `HCellGroup` 内部行之间自动显示分隔线，最后一行无分隔线；通过 CSS `:not(:last-child)` 实现，不依赖运行时计数。
- 视觉对齐 HeroUI Native ListGroup，走 `--h-*` token；交互行触控热区 ≥ `--h-touch-target`。
- 无障碍：交互行使用 `role="button"`、`tabindex="0"`、`:focus-visible` 焦点环与 Enter/Space 激活；chevron 为装饰并 `aria-hidden`；分组使用 `section`，有默认 title 时通过 id 关联 `aria-labelledby`。
- 在 playground 演示图标前缀 + 值后缀 + chevron、带开关的行、纯展示行和 flat 分组，并新增 `docs/components/cell.md`、导航项与前端规范同步。

## Acceptance Criteria

- [x] 宿主可用 `HCellGroup` 包裹多个 `HCell` 组成设置分组，圆角、分隔线、最后一行无分隔线表现正确。
- [x] `HCell` 可展示 title + description，前缀 / 后缀内容正确对齐。
- [x] 交互行可点击与键盘激活并 emit `click`；非交互行不响应。
- [x] 具备 `role="button"`（交互行）、`:focus-visible` 焦点环、装饰图标 `aria-hidden` 等无障碍语义。
- [x] 组件、样式、token、导出、playground、文档、导航与前端规范同步完成。
- [x] 类型检查与构建（`npm run build:playground`、`docs:build`、`build:lib`、`npm pack --dry-run`）通过。

## Out Of Scope

- 恢复旧 `HListRow` / `HSettingRow` / `HListSection` 名称或 `M*` 兼容别名。
- 选择态 / 单选多选 / 复选列表引擎（selection engine）。
- 侧滑操作（swipe actions）、拖拽排序、虚拟滚动。
- 路由跳转、网络请求或状态管理绑定（chevron 仅为视觉指示，跳转由宿主处理）。
- 播放器「正在播放」等领域语义（属 Muses）。

