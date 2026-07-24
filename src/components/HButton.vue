<template>
  <button
    class="h-button"
    :class="[
      `h-button--${variant}`,
      `h-button--${size}`,
    ]"
    :type="type"
    :disabled="disabled"
    @click="onClick"
  >
    <span v-if="$slots.leading" class="h-button__leading">
      <slot name="leading" />
    </span>
    <span class="h-button__label">
      <slot />
    </span>
    <span v-if="$slots.trailing" class="h-button__trailing">
      <slot name="trailing" />
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * happier-ui：文字按钮。对齐 HeroUI Native variants / sizes。
 * 无 elevation；pressed 用背景/透明度。
 */
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger' | 'danger-soft'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const onClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit('click', event)
}
</script>
