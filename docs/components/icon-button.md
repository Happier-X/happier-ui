# IconButton

纯图标按钮。用于返回、关闭、更多、收藏等高频图标操作。结构与无障碍独立于 [Button](./button.md)，配色与 token 与 Button 共享。

## 基础

<script setup>
import { ref } from 'vue'
import { HIconButton } from 'happier-ui'
import { Heart, Star, X, Plus } from '@lucide/vue'

const clicks = ref(0)
const variants = ['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'danger', 'danger-soft']
const sizes = ['sm', 'md', 'lg']
</script>

<div class="h-demo h-demo--row">
  <h-icon-button :icon="Star" ariaLabel="收藏" @click="clicks++" />
  <h-icon-button :icon="Heart" variant="danger-soft" ariaLabel="喜欢" />
  <h-icon-button :icon="X" variant="ghost" ariaLabel="关闭" />
  <h-icon-button :icon="Plus" variant="outline" ariaLabel="添加" disabled />
</div>

> 提示：`ariaLabel` 为类型必填。由于 `aria-label` 会被 `vue-tsc` 识别为原生 ARIA 属性而不是必填 prop，TS 项目中请使用 `ariaLabel` / `:ariaLabel` 传入，组件内部会输出原生 `aria-label`。

<p v-if="clicks" class="h-demo__hint">点击次数：{{ clicks }}</p>

```vue
<script setup lang="ts">
import { HIconButton } from 'happier-ui'
import { Star, X } from '@lucide/vue'
</script>

<template>
  <h-icon-button :icon="Star" ariaLabel="收藏" @click="onClick" />
  <h-icon-button :icon="X" variant="ghost" ariaLabel="关闭" />
</template>
```

## Variants × sizes

<div v-for="size in sizes" :key="size" class="h-demo h-demo--stack">
  <p class="h-demo__hint">size={{ size }}</p>
  <div class="h-demo--row">
    <h-icon-button
      v-for="variant in variants"
      :key="`${size}-${variant}`"
      :icon="Star"
      :variant="variant"
      :size="size"
      :ariaLabel="`${variant} ${size}`"
    />
  </div>
</div>

## 形状

`shape="square"` 为圆角矩形（复用 `--h-radius-control`），`shape="circle"` 为圆形。

<div class="h-demo h-demo--row">
  <h-icon-button :icon="Heart" shape="square" ariaLabel="方形" />
  <h-icon-button :icon="Heart" shape="circle" ariaLabel="圆形" />
  <h-icon-button :icon="Heart" shape="circle" variant="danger" ariaLabel="圆形删除" />
</div>

```vue
<h-icon-button :icon="Heart" shape="square" ariaLabel="方形" />
<h-icon-button :icon="Heart" shape="circle" ariaLabel="圆形" />
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `icon` | `Component` | — | 必填。Lucide 图标组件，内部经 `HIcon` 渲染 |
| `ariaLabel` | `string` | — | 必填。图标按钮可访问名，映射到原生 `aria-label`。TS 项目用 `ariaLabel` / `:ariaLabel` 传入 |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'outline' \| 'ghost' \| 'danger' \| 'danger-soft'` | `'primary'` | 视觉变体，与 Button 对齐 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸，渲染为 32/40/48px 正方形 |
| `shape` | `'square' \| 'circle'` | `'square'` | 形状 |
| `disabled` | `boolean` | `false` | 禁用 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 type |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `click` | `MouseEvent` | 未 disabled 时触发 |

## 无障碍

- 原生 `<button>`；`disabled` 时不可点
- `ariaLabel` 必填，作为可访问名；内部图标为装饰性（`aria-hidden`）
- 保留 `:focus-visible` 焦点环，与 Button 一致
