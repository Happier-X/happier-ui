<template>
  <div
    class="h-progress"
    :class="[
      `h-progress--${size}`,
      `h-progress--${variant}`,
      {
        'h-progress--rounded': rounded,
        'h-progress--indeterminate': indeterminate,
      },
    ]"
    :style="indicatorStyle"
    role="progressbar"
    :aria-label="ariaLabel"
    :aria-valuemin="0"
    :aria-valuemax="normalizedMax"
    :aria-valuenow="indeterminate ? undefined : normalizedValue"
  >
    <div class="h-progress__indicator" />
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：只读线形进度条。
 * - value/max 控制确定进度；越界夹取，非法数值归一化
 * - indeterminate 展示循环动画并省略 aria-valuenow
 * - 百分比经 CSS 自定义属性 --h-progress-value 驱动填充宽度
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value?: number
  max?: number
  indeterminate?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  rounded?: boolean
  ariaLabel?: string
}>(), {
  value: 0,
  max: 100,
  indeterminate: false,
  size: 'md',
  variant: 'primary',
  rounded: true,
  ariaLabel: undefined,
})

/** 有效上限：max > 0 且有限，否则回退 100 */
const normalizedMax = computed(() => {
  const max = props.max
  return Number.isFinite(max) && max > 0 ? max : 100
})

/** 有效值：有限数夹取到 [0, max]；非有限按 0 */
const normalizedValue = computed(() => {
  const value = props.value
  if (!Number.isFinite(value)) return 0
  const max = normalizedMax.value
  return Math.min(Math.max(value, 0), max)
})

/** 百分比（0–100），供 CSS 使用 */
const percent = computed(() => {
  const max = normalizedMax.value
  if (max <= 0) return 0
  return (normalizedValue.value / max) * 100
})

const indicatorStyle = computed(() => {
  if (props.indeterminate) return undefined
  return {
    '--h-progress-value': `${percent.value}%`,
  } as Record<string, string>
})
</script>
