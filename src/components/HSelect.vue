<template>
  <div
    class="h-select"
    :class="[
      `h-select--${size}`,
      {
        'h-select--disabled': disabled,
        'h-select--has-value': hasValue,
        'h-select--clearable': clearable,
      },
    ]"
  >
    <label
      v-if="label"
      class="h-select__label"
      :for="selectId"
    >
      {{ label }}
    </label>

    <div class="h-select__wrapper">
      <select
        :id="selectId"
        class="h-select__control"
        :value="modelValue"
        :name="name"
        :disabled="disabled"
        :aria-label="ariaLabel || undefined"
        @change="onChange"
      >
        <option
          v-if="placeholder"
          disabled
          value=""
        >
          {{ placeholder }}
        </option>
        <template v-for="opt in options" :key="String(opt.value)">
          <slot name="option" :option="opt">
            <option
              :value="opt.value"
              :disabled="opt.disabled"
            >
              {{ opt.label }}
            </option>
          </slot>
        </template>
      </select>

      <!-- 清空按钮 -->
      <button
        v-if="clearable && hasValue"
        class="h-select__clear"
        type="button"
        :disabled="disabled"
        :aria-label="`清除 ${label || '选中'}`"
        tabindex="-1"
        @click="onClear"
      >
        <!-- x 图标 -->
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 4L12 12M12 4L4 12"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <!-- 下拉箭头 -->
      <svg
        class="h-select__arrow"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：下拉选择框。基于原生 <select>，保留浏览器原生弹出行为。
 * - v-model: modelValue / update:modelValue
 * - change emit：用户确认选择后触发
 */
import { computed, useId } from 'vue'

export interface HSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  options: HSelectOption[]
  modelValue?: string | number
  placeholder?: string
  label?: string
  disabled?: boolean
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  name?: string
  ariaLabel?: string
}>(), {
  options: () => [],
  modelValue: '',
  placeholder: undefined,
  label: undefined,
  disabled: false,
  clearable: false,
  size: 'md',
  name: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const selectId = useId()

const hasValue = computed(() => {
  return props.modelValue !== '' && props.modelValue !== undefined && props.modelValue !== null
})

const onChange = (event: Event) => {
  if (props.disabled) return
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('update:modelValue', value)
  emit('change', value)
}

const onClear = () => {
  if (props.disabled) return
  emit('update:modelValue', '')
  emit('change', '')
}
</script>
