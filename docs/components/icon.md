# Icon

Lucide 图标包装。`@lucide/vue` 为 **peer**，库不打包具体图标。

## 基础

<script setup>
import { Search, Star, Heart, Play } from '@lucide/vue'
import { HIcon } from 'happier-ui'
</script>

<div class="h-demo h-demo--row" style="color: var(--h-color-ink)">
  <h-icon :icon="Search" size="sm" />
  <h-icon :icon="Search" size="md" />
  <h-icon :icon="Search" size="lg" />
  <h-icon :icon="Search" :size="32" />
</div>

```vue
<script setup lang="ts">
import { Search } from '@lucide/vue'
import { HIcon } from 'happier-ui'
</script>

<template>
  <h-icon :icon="Search" size="md" />
  <h-icon :icon="Search" :size="32" />
</template>
```

## Stroke vs fill

Lucide 非正式 filled 集，`variant="fill"` 效果因图标而异。

<div class="h-demo h-demo--row" style="color: var(--h-color-ink)">
  <h-icon :icon="Star" size="lg" aria-label="描边星标" />
  <h-icon :icon="Star" size="lg" variant="fill" color="var(--h-color-primary)" aria-label="填充星标" />
  <h-icon :icon="Heart" size="lg" />
  <h-icon :icon="Heart" size="lg" variant="fill" color="var(--h-color-danger)" />
  <h-icon :icon="Play" size="lg" />
  <h-icon :icon="Play" size="lg" variant="fill" color="var(--h-color-primary)" />
</div>

```vue
<h-icon :icon="Star" variant="fill" color="var(--h-color-primary)" aria-label="收藏" />
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `icon` | `Component` | — | **必填**；Lucide Vue 组件 |
| `variant` | `'stroke' \| 'fill'` | `'stroke'` | 描边 / 填充倾向 |
| `size` | `'sm' \| 'md' \| 'lg' \| number` | `'md'` | sm=16 / md=20 / lg=24；数字为 px |
| `strokeWidth` | `number` | `2` | 描边宽度 |
| `color` | `string` | — | 颜色；默认 `currentColor` |
| `ariaLabel` | `string` | — | 有意义图标的可访问名称 |

### Slots

无。

### Emits

无。

## 无障碍

- 装饰用途默认 `aria-hidden`
- 有语义时传 `ariaLabel`（去掉 hidden，由组件处理命名）
