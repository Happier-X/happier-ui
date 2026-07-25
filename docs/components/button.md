# Button

文字按钮。对齐 HeroUI Native variants / sizes；无 elevation，pressed 用背景/透明度。

## 基础

<script setup>
import { ref } from 'vue'
import { HButton, HIcon } from 'happier-ui'
import { Star, Heart, X } from '@lucide/vue'

const clicks = ref(0)
const variants = ['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'danger', 'danger-soft']
const sizes = ['sm', 'md', 'lg']
</script>

<div class="h-demo h-demo--row">
  <h-button @click="clicks++">Primary</h-button>
  <h-button variant="outline">Outline</h-button>
  <h-button variant="ghost">Ghost</h-button>
  <h-button disabled>Disabled</h-button>
</div>

<p v-if="clicks" class="h-demo__hint">点击次数：{{ clicks }}</p>

```vue
<script setup lang="ts">
import { HButton } from 'happier-ui'
</script>

<template>
  <h-button @click="onClick">Primary</h-button>
  <h-button variant="outline">Outline</h-button>
  <h-button disabled>Disabled</h-button>
</template>
```

## 变体 × 尺寸

<div v-for="size in sizes" :key="size" class="h-demo h-demo--stack">
  <p class="h-demo__hint">size={{ size }}</p>
  <div class="h-demo--row">
    <h-button
      v-for="variant in variants"
      :key="`${size}-${variant}`"
      :variant="variant"
      :size="size"
    >
      {{ variant }}
    </h-button>
  </div>
</div>

## 前置 / 后置图标

<div class="h-demo h-demo--row">
  <h-button variant="outline">
    <template #leading>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </template>
    leading
  </h-button>
</div>

```vue
<h-button variant="outline">
  <template #leading>
    <!-- 装饰 SVG 建议 aria-hidden -->
    <svg … aria-hidden="true">…</svg>
  </template>
  leading
</h-button>
```

## 纯图标（isIconOnly）

`isIconOnly` 让按钮变为方形（`aspect-ratio: 1`、无内边距），图标通过默认插槽传入。此时应传 `ariaLabel` 提供可访问名，内部图标保持装饰性（`aria-hidden`）。`shape` 控制圆角：`square` 复用 `--h-radius-control`，`circle` 为圆形。

<div class="h-demo h-demo--row">
  <h-button is-icon-only aria-label="收藏" @click="clicks++">
    <h-icon :icon="Star" aria-hidden="true" />
  </h-button>
  <h-button is-icon-only variant="ghost" aria-label="关闭">
    <h-icon :icon="X" aria-hidden="true" />
  </h-button>
  <h-button is-icon-only shape="circle" variant="danger" aria-label="删除">
    <h-icon :icon="Heart" aria-hidden="true" />
  </h-button>
</div>

```vue
<script setup lang="ts">
import { HButton, HIcon } from 'happier-ui'
import { Star, X } from '@lucide/vue'
</script>

<template>
  <h-button is-icon-only aria-label="收藏" @click="onClick">
    <h-icon :icon="Star" aria-hidden="true" />
  </h-button>
  <h-button is-icon-only shape="circle" variant="ghost" aria-label="关闭">
    <h-icon :icon="X" aria-hidden="true" />
  </h-button>
</template>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'outline' \| 'ghost' \| 'danger' \| 'danger-soft'` | `'primary'` | 视觉变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `isIconOnly` | `boolean` | `false` | 纯图标模式：方形、`aspect-ratio: 1`、无内边距，图标走默认插槽 |
| `shape` | `'square' \| 'circle'` | `'square'` | 仅 `isIconOnly` 生效：方形圆角或圆形 |
| `ariaLabel` | `string` | — | 纯图标时的可访问名，映射原生 `aria-label`。TS 项目用 `ariaLabel` / `:ariaLabel` 传入 |
| `disabled` | `boolean` | `false` | 禁用 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 type |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `click` | `MouseEvent` | 未 disabled 时触发 |

### Slots

| 名称 | 说明 |
|------|------|
| `default` | 按钮文案；`isIconOnly` 时放置图标 |
| `leading` | 左侧图标区（`isIconOnly` 时不渲染） |
| `trailing` | 右侧图标区（`isIconOnly` 时不渲染） |

## 无障碍

- 原生 `<button>`；`disabled` 时不可点
- 装饰 SVG / 图标使用 `aria-hidden`
- 纯图标（`isIconOnly`）传 `ariaLabel` 提供可访问名
- 保留 `:focus-visible`
