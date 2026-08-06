<template>
  <div class="h-table-wrapper">
    <table
      class="h-table"
      :class="{
        'h-table--bordered': bordered,
        'h-table--striped': striped,
        'h-table--sticky': stickyHeader,
      }"
    >
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="h-table__th"
            :class="[
              `h-table__th--${col.align || 'left'}`,
              { 'h-table__th--sortable': col.sortable },
            ]"
            :style="colStyle(col)"
            @click="onHeaderClick(col)"
          >
            <span class="h-table__th-text">{{ col.title }}</span>
            <span
              v-if="col.sortable"
              class="h-table__sort-icon"
              :class="{
                'h-table__sort-icon--asc': sortState?.key === col.key && sortState.order === 'asc',
                'h-table__sort-icon--desc': sortState?.key === col.key && sortState.order === 'desc',
              }"
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 3L11 7.5H3L7 3Z"
                  fill="currentColor"
                  opacity="0.3"
                />
                <path
                  d="M7 11L3 6.5H11L7 11Z"
                  fill="currentColor"
                  opacity="0.3"
                />
                <path
                  v-if="sortState?.key === col.key && sortState.order === 'asc'"
                  d="M7 2L11 6.5H3L7 2Z"
                  fill="currentColor"
                  opacity="1"
                />
                <path
                  v-if="sortState?.key === col.key && sortState.order === 'desc'"
                  d="M7 12L3 7.5H11L7 12Z"
                  fill="currentColor"
                  opacity="1"
                />
              </svg>
            </span>
          </th>
        </tr>
      </thead>
      <tbody v-if="data.length > 0">
        <tr
          v-for="(row, rowIndex) in data"
          :key="resolveRowKey(row, rowIndex)"
          class="h-table__row"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="h-table__td"
            :class="`h-table__td--${col.align || 'left'}`"
            :style="colStyle(col)"
          >
            <slot name="cell" :column="col" :row="row" :index="rowIndex">
              {{ col.render ? col.render(row, rowIndex) : row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Loading -->
    <div
      v-if="loading"
      class="h-table__overlay"
    >
      <slot name="loading">
        <h-loading mode="local" size="md" />
      </slot>
    </div>

    <!-- Empty -->
    <div
      v-else-if="data.length === 0"
      class="h-table__empty"
    >
      <slot name="empty">
        <h-empty :title="emptyText" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends object = Record<string, unknown>">
/**
 * happier-ui：数据表格。基于原生 <table>，列定义驱动渲染。
 * - 泛型组件：按行类型 T 参数化，data: T[]、cell slot 的 row 推断为 T、col.key 约束为 keyof T。
 *   裸用法（不标注 T）等价于 Record<string, unknown>，向后兼容。
 * - columns 定义表头与数据字段映射
 * - sortable 列点击后触发 sort emit，由父组件处理排序
 * - loading/empty 态通过 overlay 与独立空状态展示
 */
import { ref } from 'vue'
import HEmpty from './HEmpty.vue'
import HLoading from './HLoading.vue'

export interface HTableColumn<T extends object = Record<string, unknown>> {
  key: keyof T & string
  title: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: (row: T, index: number) => string | number
}

export interface HTableSort {
  key: string
  order: 'asc' | 'desc'
}

const props = withDefaults(defineProps<{
  columns: HTableColumn<T>[]
  data: T[]
  rowKey?: string | ((row: T) => string)
  bordered?: boolean
  striped?: boolean
  stickyHeader?: boolean
  emptyText?: string
  loading?: boolean
}>(), {
  columns: () => [],
  data: () => [],
  rowKey: 'id',
  bordered: false,
  striped: false,
  stickyHeader: false,
  emptyText: '暂无数据',
  loading: false,
})

defineSlots<{
  cell(props: { column: HTableColumn<T>, row: T, index: number }): unknown
  empty(): unknown
  loading(): unknown
}>()

const emit = defineEmits<{
  sort: [sort: HTableSort | null]
}>()

const sortState = ref<HTableSort | null>(null)

const resolveRowKey = (row: T, index: number): string => {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  // rowKey 可为任意字段名（默认 'id'），T 无索引签名时用一次内部断言取值，不外泄给消费方
  const val = (row as Record<string, unknown>)[props.rowKey]
  return val != null ? String(val) : String(index)
}

const colStyle = (col: HTableColumn<T>): Record<string, string> | undefined => {
  if (col.width == null) return undefined
  const w = typeof col.width === 'number' ? `${col.width}px` : col.width
  return { width: w }
}

const onHeaderClick = (col: HTableColumn<T>) => {
  if (!col.sortable) return
  if (sortState.value?.key === col.key) {
    if (sortState.value.order === 'asc') {
      sortState.value = { key: col.key, order: 'desc' }
    } else {
      sortState.value = null
    }
  } else {
    sortState.value = { key: col.key, order: 'asc' }
  }
  emit('sort', sortState.value)
}
</script>
