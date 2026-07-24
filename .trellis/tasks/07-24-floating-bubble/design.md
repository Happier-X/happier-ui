# HFloatingBubble 技术设计

## 组件边界

- 单文件组件 `src/components/HFloatingBubble.vue`，`<template>` + `<script setup lang="ts">`，无大块 scoped 视觉样式。
- 视觉规则集中在 `src/styles/components/floating-bubble.css` 的 `@layer components`，通过 `src/styles/components.css` 追加 `@import`。
- 从 `src/index.ts` 导出组件与公共类型 `HFloatingBubbleOffset`（供 `v-model:offset` 使用）。
- 组件只负责浮动按钮的定位、拖拽、磁吸与激活事件；不承载业务语义。

## Props / Emits / Slots 契约

```ts
type HFloatingBubbleOffset = { x: number; y: number }
type HFloatingBubbleAxis = 'x' | 'y' | 'xy' | 'lock'
type HFloatingBubbleMagnetic = 'x' | 'y'
type HFloatingBubbleGap = number | { x: number; y: number }

const props = withDefaults(defineProps<{
  offset?: HFloatingBubbleOffset | null   // v-model:offset，可选；null / 未传时用默认右下角
  axis?: HFloatingBubbleAxis              // 默认 'y'
  magnetic?: HFloatingBubbleMagnetic      // 默认 undefined
  gap?: HFloatingBubbleGap                // 默认 24
  icon?: Component                        // 可选 Lucide 组件
  ariaLabel: string                       // 必填可访问名
  teleport?: string | Element | false     // 默认 'body'
}>(), { ... })

const emit = defineEmits<{
  'update:offset': [value: HFloatingBubbleOffset]
  'offset-change': [value: HFloatingBubbleOffset]
  click: [event: MouseEvent | KeyboardEvent]
  'drag-start': [value: HFloatingBubbleOffset]
  'drag-end': [value: HFloatingBubbleOffset]
}>()
```

- Slots：`default`（自定义气泡内容，优先于 icon）。
- `offset` 采用「非受控优先，受控可覆盖」策略：内部保持 `state` ref；`props.offset` 变化时同步进内部 state；用户交互时同时更新内部 state 并 emit。

## 定位模型

- 坐标系：offset 表示气泡左上角相对视口左上角的 `left/top`（px）。渲染用 `position: fixed; left; top`。
- 元素尺寸：优先读取实际 DOM 尺寸（`offsetWidth/Height`），fallback 到 token 默认 48px。
- 边界：合法 `x ∈ [gapX, window.innerWidth - width - gapX]`，`y ∈ [gapY, window.innerHeight - height - gapY]`；用 `clamp` 收敛。当窗口过小导致下界>上界时，取下界（gap）优先，避免 NaN。
- 默认位置：未传 offset 时初始化为右下角：`x = innerWidth - width - gapX`，`y = innerHeight - height - gapY`。首次挂载在 `onMounted` 计算（需要真实尺寸与 window 尺寸）。

## 拖拽实现（Pointer Events）

- 在根按钮上监听 `pointerdown`；记录起始指针坐标与起始 offset，`setPointerCapture`。
- `pointermove`：根据 `axis` 计算增量：
  - `x`：只改 x；`y`：只改 y；`xy`：都改；`lock`：忽略移动。
  - 实时 clamp 到边界，更新内部 state，emit `update:offset` + `offset-change`。
- `pointerup` / `pointercancel`：结束拖拽；若配置 `magnetic`，按轴计算最近边缘目标并写入 state（走 CSS transition 动画），emit 变化事件与 `drag-end`。
- 拖拽判定：记录指针位移距离，超过阈值（如 3px）标记 `moved=true`，用于抑制 `click`。
- `dragging` 期间添加 `.h-floating-bubble--dragging`（关闭 transition，避免跟手延迟）。

## 点击与键盘

- 根元素为 `<button type="button">`，输出 `aria-label`。
- `click` 处理器：若本次交互 `moved=true`（刚发生拖拽）则吞掉，不 emit；否则 emit `click`。
- 键盘：button 原生支持 Enter/Space 触发 click；键盘触发的 `moved` 恒为 false，正常 emit。

## 磁吸算法

- `magnetic='x'`：比较气泡中心 x 与视口中线，吸附到左边缘（`gapX`）或右边缘（`innerWidth-width-gapX`）；y 保持当前 clamp 值。
- `magnetic='y'`：同理吸附到上/下边缘；x 保持。
- 磁吸目标同样经过 clamp；磁吸移动通过 CSS transition（`--h-floating-bubble-transition`）呈现。

## Teleport 与 SSR 降级

- 使用 `<Teleport :to="resolvedTarget" :disabled="teleportDisabled">`。
- `resolvedTarget`：`teleport===false` → disabled=true 原地渲染；否则解析字符串选择器 / Element；解析失败或 `typeof document === 'undefined'`（SSR）→ disabled=true。
- 解析在 `onMounted` 后进行（保证 document 存在），用一个 ref 记录，避免 SSR 报错。

## 窗口自适应

- `onMounted` 注册 `resize` 监听（`useEventListener` 风格或原生 addEventListener + onBeforeUnmount 清理）。
- resize 时对当前 offset 重新 clamp；若变化则 emit `update:offset` + `offset-change`。

## 样式与 token

新增 token（`src/styles/tokens.css`，归入「浮动气泡」分组）：

- `--h-floating-bubble-size`（48px）
- `--h-floating-bubble-icon-size`（24px）
- `--h-floating-bubble-gap`（24px，仅作默认 fallback 说明）
- `--h-floating-bubble-bg`（`var(--h-color-primary)`）
- `--h-floating-bubble-color`（`var(--h-color-primary-contrast)` 或表面色）
- `--h-floating-bubble-radius`（`var(--h-radius-pill, 999px)`）
- `--h-floating-bubble-transition`（`220ms var(--h-ease-standard, ease)`）
- 层级：新增 `--h-z-floating-bubble`（默认 999，位于导航之上但低于全屏遮罩）；同时在 tokens 层级分组登记。

BEM：`.h-floating-bubble`（根 button）、`.h-floating-bubble--dragging`、`.h-floating-bubble__icon`。触控热区 ≥ `--h-touch-target`。

## 兼容与风险

- Pointer Events：现代浏览器普遍支持；桌面鼠标与移动触控统一走 pointer。不覆盖极旧浏览器（已在 Out of Scope）。
- 受控 offset 回环：内部 emit 后父组件回写 props.offset，watch 同步 state 时需比较值避免重复 clamp/emit 死循环（仅在值不同才更新）。
- teleport 到 body 后组件样式仍依赖全局 `happier-ui/styles`，无 scoped 依赖，安全。
- 无测试框架：以类型检查 + 两个 build + playground 目视回归为验证手段。
