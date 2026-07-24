<template>
  <button
    type="button"
    class="h-switch"
    :class="[
      `h-switch--${size}`,
      {
        'h-switch--on': modelValue,
        'h-switch--disabled': disabled,
      },
    ]"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="ariaLabel"
    :disabled="disabled"
    @click="onToggle"
  >
    <span class="h-switch__track" aria-hidden="true">
      <span class="h-switch__thumb" />
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * happier-ui：开关。对齐 HeroUI Native Switch 观感（简化，无 RN 动画）。
 * v-model: modelValue + update:modelValue
 */
const props = withDefaults(defineProps<{
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
  ariaLabel: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const onToggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>
