# Pagination

分页器。支持 simple（紧凑）和完整（页号按钮）两种模式，可选总条数显示和每页条数切换。

## 基础

<script setup>
import { ref } from 'vue'
import { HPagination } from 'happier-ui'

const current = ref(1)
const pageSize = ref(20)
</script>

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">当前：{{ current }}，每页：{{ pageSize }}</p>
  <h-pagination
    v-model:current="current"
    v-model:page-size="pageSize"
    :total="256"
    show-total
    show-size-changer
  />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HPagination } from 'happier-ui'

const current = ref(1)
const pageSize = ref(20)
</script>

<template>
  <h-pagination
    v-model:current="current"
    v-model:page-size="pageSize"
    :total="256"
    show-total
    show-size-changer
  />
</template>
```

## Simple 模式

<div class="h-demo h-demo--stack">
  <h-pagination v-model:current="current" :total="256" simple show-total />
</div>

```vue
<h-pagination v-model:current="current" :total="256" simple show-total />
```

## 禁用

<div class="h-demo h-demo--stack">
  <h-pagination v-model:current="current" :total="256" disabled />
</div>

```vue
<h-pagination v-model:current="current" :total="256" disabled />
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `current` | `number` | `1` | 当前页（v-model:current） |
| `total` | `number` | `0` | 总条目数 |
| `pageSize` | `number` | `20` | 每页条数（v-model:page-size） |
| `showSizeChanger` | `boolean` | `false` | 显示每页条数切换 |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | 可选的每页条数 |
| `showTotal` | `boolean` | `false` | 显示"共 N 条" |
| `simple` | `boolean` | `false` | 仅上一页/下一页（紧凑模式） |
| `disabled` | `boolean` | `false` | 禁用 |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:current` | `number` | 页码改变 |
| `update:pageSize` | `number` | 每页条数改变 |
| `change` | `{ current, pageSize }` | 页码或 pageSize 变化时触发 |

## 行为说明

- 页码为 1-indexed：当前页 = 1 表示第一页，当前页 = totalPages 表示最后一页。
- 完整模式页号逻辑：≤7 页全部显示；>7 页时固定显示首尾页与当前页±1，中间用 `...` 省略。
- `showSizeChanger` 通过内置 `HSelect` 组件渲染。
- `disabled` 态禁用所有交互按钮与下拉。

## 无障碍

- 翻页按钮使用 `<button>` 原生语义。
- 当前页按钮使用 `--active` 高亮类。
- pageSize 切换使用原生 `<select>`（HSelect），自带 `aria-label`。
- `...` 省略号标记为纯装饰元素（不可聚焦）。
