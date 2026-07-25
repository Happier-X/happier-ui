# FloatingBubble

浮动气泡（悬浮操作按钮）。固定在视口边缘的可拖拽圆形按钮，用于承载「返回顶部 / 客服 / 快捷入口」等全局浮动操作。交互对齐 Vant FloatingBubble，观感遵循 HeroUI Native + `--h-*` token。默认 `teleport` 到 `body`。

<script setup>
import { ref } from 'vue'
import { HFloatingBubble, HButton } from 'happier-ui'
import { MessageCircle } from '@lucide/vue'

// 同一时刻只显示一个气泡，避免多个 fixed 气泡在同一角落重叠
const active = ref('')
const clicks = ref(0)
const dragOffset = ref(null)

const toggle = (key) => {
  active.value = active.value === key ? '' : key
}
const onBubbleClick = () => { clicks.value++ }
const onOffsetChange = (v) => { dragOffset.value = v }
</script>

## 基础

默认渲染在视口右下角，距边缘约 24px，仅允许沿 y 轴纵向拖拽。通过 `icon` 传入 Lucide 图标；`ariaLabel` 为类型必填，作为可访问名。

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <h-button @click="toggle('basic')">{{ active === 'basic' ? '隐藏气泡' : '显示气泡' }}</h-button>
  </div>
  <p class="h-demo__hint">气泡会浮在页面视口右下角，可沿纵向拖拽；点击气泡累加计数。当前点击：{{ clicks }}</p>
  <h-floating-bubble
    v-if="active === 'basic'"
    :icon="MessageCircle"
    ariaLabel="联系客服"
    @click="onBubbleClick"
  />
</div>

```vue
<script setup lang="ts">
import { HFloatingBubble } from 'happier-ui'
import { MessageCircle } from '@lucide/vue'

const onClick = () => {
  console.log('bubble clicked')
}
</script>

<template>
  <h-floating-bubble
    :icon="MessageCircle"
    ariaLabel="联系客服"
    @click="onClick"
  />
</template>
```

> 提示：`ariaLabel` 为类型必填。由于 `aria-label` 会被 `vue-tsc` 识别为原生 ARIA 属性而不是必填 prop，TS 项目中请使用 `ariaLabel` / `:ariaLabel` 传入，组件内部会输出原生 `aria-label`。

## 自由拖拽 + 磁吸

`axis="xy"` 允许自由拖拽；`magnetic="x"` 在释放后按 x 轴吸附到最近的左右边缘。`gap` 控制与视口的最小边距。

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <h-button variant="outline" @click="toggle('magnetic')">{{ active === 'magnetic' ? '隐藏气泡' : '显示可磁吸气泡' }}</h-button>
  </div>
  <p class="h-demo__hint">拖拽气泡到任意位置，松手后会吸附到最近的左 / 右边缘；当前 offset：{{ dragOffset ? `x=${dragOffset.x}, y=${dragOffset.y}` : '（未拖动）' }}</p>
  <h-floating-bubble
    v-if="active === 'magnetic'"
    :icon="MessageCircle"
    ariaLabel="联系客服"
    axis="xy"
    magnetic="x"
    :gap="24"
    @offset-change="onOffsetChange"
  />
</div>

```vue
<h-floating-bubble
  :icon="MessageCircle"
  ariaLabel="联系客服"
  axis="xy"
  magnetic="x"
  :gap="24"
  @offset-change="onOffsetChange"
/>
```

`gap` 也支持分轴设置：

```vue
<h-floating-bubble :icon="MessageCircle" ariaLabel="客服" :gap="{ x: 16, y: 32 }" />
```

## 受控位置

用 `v-model:offset` 控制并监听位置。offset 表示气泡左上角相对视口左上角的 `left/top` 像素值。传 `null` 时使用默认右下角位置。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HFloatingBubble } from 'happier-ui'
import type { HFloatingBubbleOffset } from 'happier-ui'
import { MessageCircle } from '@lucide/vue'

const offset = ref<HFloatingBubbleOffset | null>({ x: 160, y: 300 })
</script>

<template>
  <h-floating-bubble
    v-model:offset="offset"
    :icon="MessageCircle"
    ariaLabel="客服"
    axis="xy"
  />
</template>
```

## 自定义内容

存在 `default` slot 时优先展示 slot，忽略 `icon`。

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <h-button variant="ghost" @click="toggle('slot')">{{ active === 'slot' ? '隐藏气泡' : '显示自定义气泡' }}</h-button>
  </div>
  <p class="h-demo__hint">用 default slot 放入文字或自定义内容，可自由拖拽。</p>
  <h-floating-bubble
    v-if="active === 'slot'"
    ariaLabel="返回顶部"
    axis="xy"
  >
    <span style="font-size: 12px; font-weight: 600">TOP</span>
  </h-floating-bubble>
</div>

```vue
<h-floating-bubble ariaLabel="返回顶部" axis="xy">
  <span style="font-size: 12px; font-weight: 600">TOP</span>
</h-floating-bubble>
```

## 禁用拖拽

`axis="lock"` 禁用拖拽，但仍可点击（用作纯浮动按钮）。

```vue
<h-floating-bubble :icon="MessageCircle" ariaLabel="客服" axis="lock" @click="onClick" />
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `offset` | `{ x: number, y: number } \| null` | `null` | `v-model:offset`，位置（相对视口左上角 left/top，px）。`null` 用默认右下角 |
| `axis` | `'x' \| 'y' \| 'xy' \| 'lock'` | `'y'` | 拖拽方向；`lock` 禁拖拽但可点击 |
| `magnetic` | `'x' \| 'y'` | — | 释放后按指定轴吸附到最近边缘 |
| `gap` | `number \| { x: number, y: number }` | `24` | 与视口的最小边距（px） |
| `icon` | `Component` | — | Lucide 图标组件，内部经 `HIcon` 渲染；被 default slot 覆盖 |
| `ariaLabel` | `string` | — | 必填。可访问名，映射到原生 `aria-label`。TS 项目用 `ariaLabel` / `:ariaLabel` 传入 |
| `teleport` | `string \| Element \| false` | `'body'` | 挂载目标；`false` 或无效目标/SSR 时原地渲染 |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:offset` | `{ x: number, y: number }` | 拖拽 / 磁吸 / 边界校正导致位置变化 |
| `offset-change` | `{ x: number, y: number }` | 同 `update:offset`，用于监听位置变化 |
| `click` | `MouseEvent` | 未发生有效拖拽的点击 / 键盘激活时触发 |
| `drag-start` | `{ x: number, y: number }` | 拖拽开始 |
| `drag-end` | `{ x: number, y: number }` | 拖拽结束 |

### Slots

| 名称 | 说明 |
|------|------|
| `default` | 自定义气泡内容，优先于 `icon` |

### Types

```ts
export type {
  HFloatingBubbleOffset,
  HFloatingBubbleAxis,
  HFloatingBubbleMagnetic,
  HFloatingBubbleGap,
} from 'happier-ui'
```

## 无障碍

- 根元素为原生 `<button type="button">`，`ariaLabel` 必填作为可访问名
- 内部图标为装饰性（`aria-hidden`）
- 支持键盘 Enter / Space 触发 `click`
- 拖拽释放不会误触发 `click`
- 尊重 `prefers-reduced-motion`（关闭位移过渡）
