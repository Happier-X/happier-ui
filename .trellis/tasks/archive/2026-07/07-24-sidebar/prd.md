# 开发 HSidebar 侧边栏组件

## Goal

为 happier-ui 新增 `HSidebar` —— **常驻式左侧边栏**（占位布局，非浮层 Drawer）。用于桌面/宽屏场景下的主导航或侧栏区域，遵循 happier-ui / HeroUI Native 观感与 `--h-*` token 规范。

## Confirmed Facts（已确认）

- 命名：`HSidebar`（`H` 前缀，`src/components/HSidebar.vue`）。
- 形态：**常驻式**（占据文档流布局宽度，不做 overlay / drawer / body teleport）。
- 方向：首版固定 `left`（不做 right/top/bottom）。
- 视觉：无 elevation；数值走 `--h-*` token；BEM `h-*` 类；`@layer components` 视觉规则；`<template>` → `<script setup lang="ts">`；无大块 `<style scoped>`。
- 图标走 Lucide（`icon: Component` + 复用 `HIcon`）。
- 触控热区 ≥ `--h-touch-target`（48px）。
- 文档默认使用简体中文。

## Requirements

- **R1 导航驱动 API**：`items: HSidebarItem[]` 必填，`modelValue?: string` 表示当前选中项，点击可用项 emit `update:modelValue(key)`；不内置路由。
- **R2 Item 契约**：沿用 `HTabBarItem` 语义，包含 `key: string`、`label?: string`、`icon?: Component`、`disabled?: boolean`、`ariaLabel?: string`；无可见 label 时必须提供 `ariaLabel`。
- **R3 左侧常驻**：组件占据正常文档流宽度，首版固定用于左侧；无 fixed/overlay/Teleport/边缘滑出行为。
- **R4 布局区域**：提供 header、导航主体、footer 三个区域；导航主体由 items 渲染，header/footer 由 slot 扩展。
- **R5 受控折叠**：支持 `v-model:collapsed`（`collapsed?: boolean` + `update:collapsed(boolean)`）；展开态显示图标与 label，折叠态缩窄宽度并仅视觉展示图标；宽度和内容变化有 token 化过渡，并尊重 `prefers-reduced-motion`。
- **R5b 内置折叠切换**：提供 `showCollapseToggle?: boolean`（默认 `true`），内置一个图标按钮切换折叠态并 emit `update:collapsed`；按钮有可访问名（`aria-label`，随折叠态在“展开/收起”间切换）；宿主仍可通过 header/footer slot 自行布置额外操作。
- **R6 选择行为**：可用项点击后 emit 新 key；disabled 项不可选择；当前项具备稳定选中态。
- **R7 无障碍**：根元素使用 `nav` + `aria-label`；当前项 `aria-current="page"`；导航项为原生 button；disabled 使用原生 `disabled`；折叠态下 label 视觉隐藏但仍通过 `label` 或 `ariaLabel` 提供可访问名。
- **R8 图标**：item.icon 通过 `HIcon` 渲染，装饰性 `aria-hidden`；不存在 icon 时文字布局仍稳定。
- **R9 触控与焦点**：导航项触控热区 ≥ `--h-touch-target`；可见 `:focus-visible` 焦点环。
- **R10 视觉与 token**：复用既有 `--h-sidebar-width`（240px）作为展开宽度；折叠宽度、背景、边框、内边距、item 高度/间距/圆角、文字/激活/hover/disabled、过渡以 `--h-sidebar-*` / 既有 `--h-*` token 表达；无 elevation。
- **R11 交付面**：组件与类型导出、CSS 汇总导入、tokens、playground 演示、组件文档、VitePress 侧边栏、前端 spec 同步更新。

## Acceptance Criteria

- [ ] `HSidebar` 在 flex/grid 宿主中作为左侧常驻列占据文档流宽度，不遮挡主内容。
- [ ] `items + v-model` 可选择并反映当前 key；disabled 项不 emit。
- [ ] icon/label、选中/hover/focus/disabled 状态可区分且不引入 Material elevation。
- [ ] header/footer slots 可分别承载品牌区和底部操作区。
- [ ] `v-model:collapsed` 可由宿主切换；内置折叠按钮点击可切换并 emit `update:collapsed`，按钮可访问名随态更新；折叠后侧栏缩窄、item 仅视觉显示图标且仍有可访问名；reduced-motion 下关闭过渡。
- [ ] 根 `nav` 有可访问名；当前项有 `aria-current="page"`；导航项键盘可达。
- [ ] 触控热区不小于 `--h-touch-target`。
- [ ] `vue-tsc`、library build、playground build 通过；playground 覆盖默认、选中、禁用、header/footer，以及最终确认的折叠行为。

## Out of Scope（初版）

- 浮层 Drawer / overlay / Teleport（若需要另开抽屉组件或后续迭代）。
- right / top / bottom 方向。
- 路由集成（沿用库惯例，宿主负责）。
- 多级/可展开分组导航（首版仅单层 items）。

## Key Decisions

- **导航驱动 API（A）**：`items + v-model`，item 契约对齐 `HTabBarItem` 并增补 `ariaLabel`。
- **受控折叠（A）**：`v-model:collapsed`，折叠仅视觉隐藏 label、保留可访问名。
- **内置折叠按钮（A）**：`showCollapseToggle` 默认 `true`，emit `update:collapsed`；header/footer slot 仍可扩展。
- **复用 `--h-sidebar-width`**：已存在于 tokens.css（240px），不新造展开宽度 token。
