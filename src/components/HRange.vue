<template>
  <input
    type="range"
    class="h-range"
    :class="[
      `h-range--${size}`,
      { 'h-range--disabled': disabled },
    ]"
    :style="{ '--h-range-progress': `${progress}%` }"
    :min="min"
    :max="max"
    :step="step > 0 ? step : 'any'"
    :value="normalized"
    :name="name"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="normalized"
    @input="onInput"
  >
</template>

<script setup lang="ts">
/**
 * happier-ui：数值滑块。基于原生 input[type="range"]，保留浏览器拖动、触控与键盘能力。
 * v-model: modelValue + update:modelValue (number)
 * - min/max/step 定义区间与步进；越界值夹取、非步进值对齐
 * - 已填充轨道由 CSS 自定义属性 --h-range-progress 驱动
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
  name?: string
}>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  size: 'md',
  ariaLabel: undefined,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

/** 夹取到 [min, max] 并按 step 对齐（step<=0 时不对齐） */
const normalize = (value: number): number => {
  const min = props.min
  const max = props.max
  const hi = Math.max(min, max)
  let next = Math.min(Math.max(value, min), hi)
  if (props.step > 0) {
    const steps = Math.round((next - min) / props.step)
    next = min + steps * props.step
    next = Math.min(Math.max(next, min), hi)
    // 定点修约，消除浮点步进（如 0.1 累加）产生的尾差
    const decimals = (String(props.step).split('.')[1] || '').length
    if (decimals > 0) {
      next = Number(next.toFixed(decimals))
    }
  }
  return next
}

/** UI 展示值：外部越界或非步进值也归一化 */
const normalized = computed(() => normalize(props.modelValue))

/** 已填充轨道百分比（0–100） */
const progress = computed(() => {
  const min = props.min
  const max = props.max
  const span = max - min
  if (span <= 0) return 0
  return ((normalized.value - min) / span) * 100
})

const onInput = (event: Event) => {
  if (props.disabled) return
  const target = event.target as HTMLInputElement
  const next = normalize(Number(target.value))
  // 若归一化后与原生值不同，回写 DOM 保持一致
  if (String(next) !== target.value) {
    target.value = String(next)
  }
  emit('update:modelValue', next)
}
</script>
