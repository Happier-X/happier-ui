# HSidebar 技术设计

## 定位与边界

`HSidebar` 是**常驻式左侧边栏导航容器**：在文档流中占据一列宽度（flex/grid 子项），不做浮层、overlay、Teleport 或边缘滑出。导航项由 `items` 驱动，选中态由 `v-model`（`modelValue`）控制；展开/折叠由 `v-model:collapsed` 控制。组件只通知宿主（emit），不执行路由。

与现有组件的关系：
- 导航契约对齐 `HTabBar`（`items + v-model`，item 为 `{ key, label?, icon?, disabled? }`），额外增加 `ariaLabel?`（折叠态纯图标需要可访问名）。
- 图标经 `HIcon` 渲染（`icon: Component`，装饰性 `aria-hidden`）。
- 内置折叠按钮复用 `HIconButton`（`ariaLabel` 必填、`ghost` variant）。

## 组件契约

```ts
export type HSidebarItem = {
  key: string
  label?: string
  icon?: Component
  disabled?: boolean
  /** 无可见 label（或折叠态）时的可访问名 */
  ariaLabel?: string
}

interface HSidebarProps {
  items: HSidebarItem[]              // 必填
  modelValue?: string                // 当前选中 key
  collapsed?: boolean                // v-model:collapsed，默认 false
  showCollapseToggle?: boolean       // 默认 true
  ariaLabel?: string                 // 根 nav 可访问名，默认「侧边导航」
}

// emits
'update:modelValue': [key: string]
'update:collapsed': [value: boolean]
```

Slots：
- `header` — 顶部品牌/标题区（折叠态可自适应；宿主自负内容）。
- `footer` — 底部操作区（如用户信息、设置入口）。
- 导航主体不开放 slot，由 `items` 渲染，保证选中态与无障碍一致。

## 结构与 DOM

```
<nav class="h-sidebar" :class="{ 'h-sidebar--collapsed': collapsed }" :aria-label="ariaLabel">
  <div class="h-sidebar__header"><slot name="header" /></div>
  <ul class="h-sidebar__nav">
    <li v-for="item in items" class="h-sidebar__item-wrap">
      <button class="h-sidebar__item"
              :class="{ '--active', '--disabled' }"
              :disabled="item.disabled"
              :aria-current="selected ? 'page' : undefined"
              :aria-label="collapsed ? (item.ariaLabel ?? item.label) : item.ariaLabel"
              @click="onSelect(item)">
        <HIcon v-if="item.icon" class="h-sidebar__icon" :icon="item.icon" aria-hidden />
        <span class="h-sidebar__label">{{ item.label }}</span>
      </button>
    </li>
  </ul>
  <div class="h-sidebar__footer">
    <slot name="footer" />
    <HIconButton v-if="showCollapseToggle" class="h-sidebar__toggle"
                 :icon="collapsed ? PanelLeftOpen : PanelLeftClose"
                 :ariaLabel="collapsed ? '展开侧边栏' : '收起侧边栏'"
                 variant="ghost"
                 @click="onToggle" />
  </div>
</nav>
```

说明：
- 根用 `<nav>` + `aria-label`；导航项列表用 `<ul>/<li>`；每项是原生 `<button>`。
- 折叠态下 `.h-sidebar__label` 视觉隐藏（不是 `display:none`，避免丢可访问名——但因为 button 本身有 aria-label 兜底，label span 可用 `overflow/opacity/width` 收起）。为稳妥：折叠态给 button 补 `aria-label`，label span 视觉隐藏即可。

## 折叠模型

- 展开：宽度 = `var(--h-sidebar-width, 240px)`，item 显示 icon + label。
- 折叠：宽度 = `var(--h-sidebar-collapsed-width, 72px)`，item 只视觉显示 icon，label 视觉隐藏。
- 过渡：`width` + 内容透明度走 `var(--h-sidebar-transition)`；`prefers-reduced-motion: reduce` 时关闭过渡。
- 折叠态可访问名：button 输出 `aria-label`（`item.ariaLabel ?? item.label`）；展开态若有可见 label 则不重复输出 aria-label（避免冗余），仅当无可见 label 时用 `ariaLabel`。

## 选择行为

```ts
const onSelect = (item: HSidebarItem) => {
  if (item.disabled) return
  emit('update:modelValue', item.key)
}
const onToggle = () => emit('update:collapsed', !props.collapsed)
```

`collapsed` / `modelValue` 均为受控 prop（`withDefaults` 提供默认），不维护内部影子状态，避免受控回环——与 `HTabBar` 一致。

## Token

复用：`--h-sidebar-width`(240px)、`--h-touch-target`、`--h-color-surface`、`--h-color-border-subtle`、`--h-color-primary`、`--h-color-ink*`、`--h-radius-control`、`--h-space-*`、`--h-ease-standard`。

新增（tokens.css「布局」或新分组「侧边栏」）：
- `--h-sidebar-collapsed-width: 72px`
- `--h-sidebar-bg: var(--h-color-surface)`
- `--h-sidebar-border: var(--h-color-border-subtle)`
- `--h-sidebar-item-radius: var(--h-radius-control)`
- `--h-sidebar-item-gap: var(--h-space-xs)`
- `--h-sidebar-transition: 200ms var(--h-ease-standard)`
- muses 别名：`--muses-sidebar-collapsed-width` 等按现有惯例可选补。

## 样式（floating 之外的新文件）

`src/styles/components/sidebar.css`（`@layer components`，BEM）：
- `.h-sidebar`：flex column，`width`/`background`/`border-right`，`transition: width`。
- `.h-sidebar--collapsed`：`width: collapsed-width`。
- `.h-sidebar__nav`：list-reset，纵向排列，`gap`。
- `.h-sidebar__item`：flex row，`min-height: --h-touch-target`，`gap`，`padding`，`border-radius`，hover/active/disabled 态，`:focus-visible` 焦点环，`--active` 用 primary。
- `.h-sidebar__label`：折叠态 `opacity:0`/`width:0`/`overflow:hidden`（视觉隐藏），`white-space:nowrap`。
- reduced-motion：关闭 transition。

`src/styles/components.css` 追加 `@import "./components/sidebar.css";`。

## 兼容 / 回滚

- 纯新增组件，无破坏性改动；回滚 = 删除新文件 + 撤销导出/import/token/文档改动。
- 无 SSR 风险（无 window/document 访问、无 Teleport）。
