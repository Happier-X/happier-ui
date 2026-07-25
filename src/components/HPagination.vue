<template>
  <div
    class="h-pagination"
    :class="{ 'h-pagination--disabled': disabled }"
  >
    <!-- 总条数 -->
    <span
      v-if="showTotal"
      class="h-pagination__total"
    >共 {{ total }} 条</span>

    <!-- 控件区 -->
    <div class="h-pagination__controls">
      <h-button
        variant="outline"
        size="sm"
        :disabled="isFirst || disabled"
        @click="goTo(current - 1)"
      >
        上一页
      </h-button>

      <!-- Simple: 纯文本 -->
      <span
        v-if="simple"
        class="h-pagination__info"
      >第 {{ current }} / {{ totalPages }} 页</span>

      <!-- Full: 页号按钮 -->
      <template v-else>
        <template v-for="(item, idx) in pageItems" :key="idx">
          <span
            v-if="item === '...'"
            class="h-pagination__ellipsis"
          >...</span>
          <button
            v-else
            class="h-pagination__btn"
            :class="{ 'h-pagination__btn--active': item === current }"
            :disabled="disabled"
            @click="goTo(item)"
          >{{ item }}</button>
        </template>
      </template>

      <h-button
        variant="outline"
        size="sm"
        :disabled="isLast || disabled"
        @click="goTo(current + 1)"
      >
        下一页
      </h-button>
    </div>

    <!-- pageSize 切换 -->
    <div
      v-if="showSizeChanger"
      class="h-pagination__sizer"
    >
      <h-select
        :options="sizeSelectOptions"
        :model-value="pageSize"
        size="sm"
        aria-label="每页条数"
        @change="onSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：分页器。
 * - 支持 simple（紧凑）和完整两种模式
 * - 完整模式包含页号按钮、省略号
 * - 可选 showTotal + showSizeChanger
 */
import { computed } from 'vue'
import HButton from './HButton.vue'
import HSelect from './HSelect.vue'
import type { HSelectOption } from './HSelect.vue'

const props = withDefaults(defineProps<{
  current?: number
  total?: number
  pageSize?: number
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
  showTotal?: boolean
  simple?: boolean
  disabled?: boolean
}>(), {
  current: 1,
  total: 0,
  pageSize: 20,
  showSizeChanger: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  showTotal: false,
  simple: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:current': [value: number]
  'update:pageSize': [value: number]
  change: [payload: { current: number; pageSize: number }]
}>()

/** 总页数 */
const totalPages = computed(() => {
  if (props.total <= 0) return 1
  return Math.ceil(props.total / props.pageSize)
})

const isFirst = computed(() => props.current <= 1)
const isLast = computed(() => props.current >= totalPages.value)

/** pageSize 下拉选项 */
const sizeSelectOptions = computed<HSelectOption[]>(() =>
  props.pageSizeOptions.map((n) => ({ value: n, label: `${n} 条/页` })),
)

/** 页号列表（含 '...' 占位） */
const pageItems = computed<(number | '...')[]>(() => {
  const total = totalPages.value
  if (props.simple || total <= 1) return []

  // ≤7页：全部显示
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const cur = props.current
  const pages = new Set<number>()
  pages.add(1)
  pages.add(total)
  pages.add(cur)
  if (cur > 1) pages.add(cur - 1)
  if (cur < total) pages.add(cur + 1)

  const sorted = [...pages].sort((a, b) => a - b)
  const result: (number | '...')[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...')
    }
    result.push(sorted[i])
  }
  return result
})

const goTo = (page: number) => {
  if (props.disabled) return
  const p = Math.max(1, Math.min(page, totalPages.value))
  if (p === props.current) return
  emit('update:current', p)
  emit('change', { current: p, pageSize: props.pageSize })
}

const onSizeChange = (value: string | number) => {
  const size = Number(value)
  emit('update:pageSize', size)
  emit('change', { current: props.current, pageSize: size })
}
</script>
