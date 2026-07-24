# Image

图片容器：`fit` / `radius` / `loading`；加载失败可自定义 fallback。

## 基础

<script setup>
import { HImage } from 'happier-ui'
</script>

<div class="h-demo h-demo--row">
  <h-image
    src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80"
    alt="耳机与唱片机"
    :width="160"
    :height="160"
  />
  <h-image
    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80"
    alt="现场演出"
    :width="160"
    :height="160"
    fit="contain"
    radius="lg"
  />
</div>

```vue
<script setup lang="ts">
import { HImage } from 'happier-ui'
</script>

<template>
  <h-image
    src="/cover.jpg"
    alt="封面"
    :width="120"
    :height="120"
    fit="cover"
    radius="md"
  />
</template>
```

## 失败 fallback

<div class="h-demo h-demo--row">
  <h-image
    src="https://invalid.example.com/image.jpg"
    alt="失败占位示例"
    :width="96"
    :height="96"
    radius="full"
  >
    <template #fallback>
      <span style="font-size: 1.5rem" aria-hidden="true">♫</span>
    </template>
  </h-image>
</div>

```vue
<h-image src="…" alt="失败占位示例" :width="96" :height="96">
  <template #fallback>
    <span aria-hidden="true">♫</span>
  </template>
</h-image>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `src` | `string` | — | **必填** |
| `alt` | `string` | — | **必填**；无障碍替代文本 |
| `width` | `string \| number` | — | 宽；数字为 px |
| `height` | `string \| number` | — | 高；数字为 px |
| `loading` | `'eager' \| 'lazy'` | `'lazy'` | 原生 loading |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | object-fit |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | 圆角档位 |

### Slots

| 名称 | 说明 |
|------|------|
| `fallback` | 加载失败时的占位内容 |

### Emits

无。

## 无障碍

- `alt` 必填
- fallback 为装饰时可用 `aria-hidden`；勿用 fallback 覆盖真实 `alt` 语义
