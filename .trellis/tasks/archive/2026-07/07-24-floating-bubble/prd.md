# 开发 HFloatingBubble 浮动气泡组件

## Goal

为 happier-ui 提供一个可拖拽、可磁吸到屏幕边缘的浮动按钮（悬浮气泡）组件，用于承载「返回顶部 / 客服 / 快捷入口」等全局浮动操作。视觉与交互对齐 Vant FloatingBubble，观感遵循 HeroUI Native + `--h-*` token。

## Confirmed Facts

- 组件命名 `HFloatingBubble`，文件为 `src/components/HFloatingBubble.vue`，从 `src/index.ts` 导出。
- 用户要求交互「像 Vant 一样」，并确认首版支持 `teleport` 默认挂载到 `body`。
- Vant FloatingBubble 参考能力：`v-model:offset`、`axis`、`magnetic`、`gap`、`teleport`、`click`、`offset-change`、`default` slot。
- 本库公共组件约定：SFC 使用 `<template>` + `<script setup lang="ts">`；视觉 CSS 写入 `src/styles/components/*.css` 并由 `src/styles/components.css` 导入；BEM 类前缀 `h-*`；新 token 使用 `--h-*`。
- 本库图标约定：Lucide 组件通过 `icon: Component` prop 传入，内部可复用 `HIcon`；纯图标交互控件需要可访问名。
- 触控热区至少 `--h-touch-target`（默认 48px）。
- 新公共组件需要 playground 演示、docs/components 文档页，并更新 `.trellis/spec/frontend/component-guidelines.md` 的当前导出/组件清单。
- 项目当前没有测试框架；验证以 `npm run build:lib` 和 `npm run build:playground` 为主。

## Requirements

- R1：新增 `HFloatingBubble` 组件，默认渲染为固定定位的圆形浮动操作按钮，默认尺寸 48px，默认右下角初始位置，默认 gap 24px。
- R2：支持 `v-model:offset` 控制与监听位置，offset 类型为 `{ x: number, y: number }`，坐标语义为相对视口左上角的 `left/top` 像素值。
- R3：支持拖拽方向 `axis?: 'x' | 'y' | 'xy' | 'lock'`，默认 `y`；`lock` 禁用拖拽但仍允许点击。
- R4：拖拽过程必须限制在视口边界内，并尊重 `gap?: number | { x: number, y: number }` 的最小边距；`gap` 默认 24。
- R5：支持 `magnetic?: 'x' | 'y'`；释放拖拽后按指定轴吸附到该轴最近边缘，并继续尊重 gap 与边界。
- R6：支持 `teleport?: string | Element | false`，默认 `'body'`；在 SSR、`teleport=false`、或目标解析失败时原地渲染，不阻塞组件显示。
- R7：支持 `icon?: Component` 与 `default` slot。存在默认 slot 时优先展示 slot；否则展示 `icon`；两者都不存在时仍渲染空按钮结构但依赖 `ariaLabel` 提供语义。
- R8：提供 `ariaLabel: string` 必填 prop，组件根交互元素输出原生 `aria-label`；默认图标为装饰性。
- R9：事件契约：
  - `click`：仅在未发生有效拖拽的点击/键盘激活中触发，载荷为 `MouseEvent` 或 `KeyboardEvent`。
  - `update:offset`：用户拖拽、磁吸或边界校正导致位置变化时触发。
  - `offset-change`：用户拖拽、磁吸或边界校正导致位置变化时触发，载荷同 offset。
  - `drag-start` / `drag-end`：分别在用户拖拽开始和结束时触发，载荷为当前 offset。
- R10：支持键盘激活 Enter / Space 触发 `click`；拖拽功能使用 Pointer Events，同时保持桌面鼠标与移动触控可用。
- R11：窗口尺寸变化后，当前 offset 应被重新夹取到合法范围；如果位置变化，需要发出 `update:offset` 和 `offset-change`。
- R12：样式新增 `src/styles/components/floating-bubble.css`，新增必要 token（如 size、gap、icon-size、background、color、z-index、radius、transition），并由 `src/styles/components.css` 导入。
- R13：playground 增加基础用法、自由拖拽 + x 轴磁吸、受控 offset 示例，能目视验证拖拽、磁吸和事件计数。
- R14：docs/components 增加 `floating-bubble.md`，包含基础示例、受控 offset、Props/Emits/Slots/无障碍说明。

## Acceptance Criteria

- [ ] `HFloatingBubble` 可从 `happier-ui` 导入，并能在 playground 正常渲染。
- [ ] 默认情况下组件出现在视口右下角，距右/下边缘约 24px，尺寸不小于 48px。
- [ ] `axis="y"` 时仅允许纵向拖拽，横向位置保持不变；`axis="xy"` 时允许自由拖拽；`axis="lock"` 时拖拽不移动但点击仍可触发。
- [ ] 拖拽不会把组件移出视口，且始终尊重 `gap`。
- [ ] `magnetic="x"` 时释放后吸附到左右最近边缘；`magnetic="y"` 时释放后吸附到上下最近边缘。
- [ ] `v-model:offset` 外部更新能驱动位置变化；用户拖拽或磁吸能回写 `update:offset` 与 `offset-change`。
- [ ] 拖拽释放不会误触发 `click`；未拖拽的鼠标/触控点击与 Enter/Space 可触发 `click`。
- [ ] `teleport` 默认挂载到 `body`；`teleport=false` 或无效目标时仍能原地渲染。
- [ ] 组件无障碍名称来自必填 `ariaLabel`，图标不重复暴露给辅助技术。
- [ ] 新 CSS 使用 `h-*` BEM 与 `--h-*` token，无大块 scoped 样式，无 Material elevation。
- [ ] `npm run build:lib` 与 `npm run build:playground` 通过。

## Out of Scope

- 不提供全局命令式 API 或队列/多实例管理。
- 不内置业务图标、客服、返回顶部或路由逻辑。
- 不实现可展开菜单、长按菜单、徽标 Badge、隐藏/半隐藏贴边状态。
- 不实现动画物理引擎或惯性滑动。
- 不保证 IE 或不支持 Pointer Events 的旧浏览器。

## Open Questions

无阻塞开放问题；进入实现前需要用户审核并明确批准本规划。
