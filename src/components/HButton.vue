<template>
  <button
    class="h-button"
    :class="[
      `h-button--${variant}`,
      `h-button--${size}`,
      isIconOnly && 'h-button--icon-only',
      isIconOnly && `h-button--${shape}`,
    ]"
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="onClick"
  >
    <span v-if="!isIconOnly && $slots.leading" class="h-button__leading">
      <slot name="leading" />
    </span>
    <span v-if="!isIconOnly" class="h-button__label">
      <slot />
    </span>
    <slot v-else />
    <span v-if="!isIconOnly && $slots.trailing" class="h-button__trailing">
      <slot name="trailing" />
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * happier-ui：按钮。对齐 HeroUI Native variants / sizes。
 * 无 elevation；pressed 用背景/透明度。
 * 纯图标场景用 isIconOnly（方形/圆形、aspect-ratio:1），图标走默认 slot；
 * 此时 ariaLabel 必填以提供可访问名（对齐 HeroUI 的 isIconOnly，不再单列组件）。
 */
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger' | 'danger-soft'
  size?: 'sm' | 'md' | 'lg'
  isIconOnly?: boolean
  shape?: 'square' | 'circle'
  ariaLabel?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  isIconOnly: false,
  shape: 'square',
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
