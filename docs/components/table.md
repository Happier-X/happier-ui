# Table

数据表格。列定义驱动渲染，支持排序、斑马纹、边框、固定表头、加载中与空数据状态。

## 基础

<script setup>
import { ref } from 'vue'
import { HTable } from 'happier-ui'

const columns = [
  { key: 'name', title: '路径', sortable: true },
  { key: 'method', title: '方法', width: 80, align: 'center' },
  { key: 'status', title: '状态码', width: 80, align: 'right', sortable: true },
  { key: 'time', title: '耗时', width: 80, align: 'right', sortable: true },
]

const data = [
  { id: '1', name: 'GET /api/users', status: 200, method: 'GET', time: '12ms' },
  { id: '2', name: 'POST /api/orders', status: 201, method: 'POST', time: '45ms' },
  { id: '3', name: 'GET /api/products', status: 200, method: 'GET', time: '8ms' },
  { id: '4', name: 'PUT /api/users/1', status: 500, method: 'PUT', time: '230ms' },
  { id: '5', name: 'GET /api/not-found', status: 404, method: 'GET', time: '3ms' },
]

const sortState = ref(null)
</script>

<div class="h-demo h-demo--stack">
  <h-table :columns="columns" :data="data" />
</div>

```vue
<script setup lang="ts">
import { HTable } from 'happier-ui'
import type { HTableColumn } from 'happier-ui'

const columns: HTableColumn[] = [
  { key: 'name', title: '路径' },
  { key: 'method', title: '方法', width: 80, align: 'center' },
  { key: 'status', title: '状态码', width: 80, align: 'right' },
  { key: 'time', title: '耗时', width: 80, align: 'right' },
]

const data = [
  { id: '1', name: 'GET /api/users', status: 200, method: 'GET', time: '12ms' },
  { id: '2', name: 'POST /api/orders', status: 201, method: 'POST', time: '45ms' },
  { id: '3', name: 'GET /api/products', status: 200, method: 'GET', time: '8ms' },
]
</script>

<template>
  <h-table :columns="columns" :data="data" />
</template>
```

## 变体

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">bordered + striped</p>
  <h-table :columns="columns" :data="data" bordered striped />
</div>

```vue
<h-table :columns="columns" :data="data" bordered striped />
```

## 排序

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">当前排序：{{ sortState?.key }} {{ sortState?.order }}</p>
  <h-table
    :columns="columns"
    :data="data"
    @sort="sortState = $event"
  />
</div>

```vue
<script setup>
const sortState = ref(null)
</script>

<template>
  <h-table
    :columns="columns"
    :data="data"
    @sort="sortState = $event"
  />
</template>
```

## 加载中

<div class="h-demo h-demo--stack">
  <h-table :columns="columns" :data="data" loading />
</div>

```vue
<h-table :columns="columns" :data="data" loading />
```

## 空数据

<div class="h-demo h-demo--stack">
  <h-table :columns="columns" :data="[]" />
</div>

```vue
<h-table :columns="columns" :data="[]" />
```

## 自定义单元格

<div class="h-demo h-demo--stack">
  <h-table :columns="columns" :data="data" bordered striped>
    <template #cell="{ column, row }">
      <span
        v-if="column.key === 'status'"
        :style="{
          fontWeight: 600,
          color: Number(row.status) >= 400
            ? 'var(--h-color-danger)'
            : Number(row.status) >= 300
              ? 'var(--h-color-warning)'
              : 'var(--h-color-success)',
        }"
      >{{ row.status }}</span>
      <template v-else>{{ row[column.key] }}</template>
    </template>
  </h-table>
</div>

```vue
<h-table :columns="columns" :data="data" bordered striped>
  <template #cell="{ column, row }">
    <span v-if="column.key === 'status'" :style="{ color: statusColor(row.status) }">
      {{ row.status }}
    </span>
    <template v-else>{{ row[column.key] }}</template>
  </template>
</h-table>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `columns` | `HTableColumn[]` | `[]` | 列定义 |
| `data` | `Record<string, unknown>[]` | `[]` | 数据行 |
| `rowKey` | `string \| ((row) => string)` | `'id'` | 行唯一标识 |
| `bordered` | `boolean` | `false` | 列间竖线边框 |
| `striped` | `boolean` | `false` | 斑马纹 |
| `stickyHeader` | `boolean` | `false` | 表头固定（需父容器限制高度并 `overflow-y: auto`） |
| `emptyText` | `string` | `'暂无数据'` | 空数据文案 |
| `loading` | `boolean` | `false` | 加载中态 |

### 类型

```ts
interface HTableColumn {
  key: string
  title: string
  width?: string | number    // 如 '120px' 或 120
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: (row: Record<string, unknown>, index: number) => string | number
}

interface HTableSort {
  key: string
  order: 'asc' | 'desc'
}
```

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `sort` | `HTableSort \| null` | 排序列变化时触发；null 表示取消排序 |

### Slots

| 名称 | 作用域 | 说明 |
|------|--------|------|
| `cell` | `{ column, row, index }` | 自定义单元格内容 |
| `empty` | — | 自定义空状态（默认显示 emptyText） |
| `loading` | — | 自定义加载中状态 |

## 行为说明

- 排序为受控行为：组件仅维护 UI 排序指示图标，点击可排序列触发 `sort` emit，由父组件处理实际排序逻辑。
- 排序状态切换：未排序 → 升序 → 降序 → 取消排序（按列头循环）。
- 行 key 通过 `rowKey` prop 指定（字符串 key 名或函数）；默认取 `row.id`。
- `render` 函数返回 string/number，用于简单格式化；复杂渲染请使用 `#cell` slot。
- `loading` 时若 data 有内容，显示 loading overlay 覆盖数据区；若 data 为空，显示 loading 指示。
- 空数据时通过 `#empty` slot 自定义空状态，默认降级为 `HEmpty`。

## 无障碍

- 原生 `<table>` / `<thead>` / `<tbody>` / `<th>` / `<td>` 语义。
- 排序按钮通过 `role="columnheader"` 隐式语义；排序图标 `aria-hidden`。
- 加载中 spinner 使用 `aria-label="加载中"`。
- 空状态通过 `HEmpty` 提供标题语义。
