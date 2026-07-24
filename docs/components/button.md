# Button

文字按钮。对齐 HeroUI Native variants / sizes；无 elevation，pressed 用背景/透明度。

## 基础

<script setup>
import { ref } from 'vue'
import { HButton } from 'happier-ui'

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

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'outline' \| 'ghost' \| 'danger' \| 'danger-soft'` | `'primary'` | 视觉变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `disabled` | `boolean` | `false` | 禁用 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 type |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `click` | `MouseEvent` | 未 disabled 时触发 |

### Slots

| 名称 | 说明 |
|------|------|
| `default` | 按钮文案 |
| `leading` | 左侧图标区 |
| `trailing` | 右侧图标区 |

## 无障碍

- 原生 `<button>`；`disabled` 时不可点
- 装饰 SVG 使用 `aria-hidden`
- 保留 `:focus-visible`
