<template>
  <button
    class="h-icon-button"
    :class="[
      `h-icon-button--${variant}`,
      `h-icon-button--${size}`,
      `h-icon-button--${shape}`,
    ]"
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="onClick"
  >
    <h-icon
      :icon="icon"
      :size="iconSize"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
/**
 * happier-ui：图标按钮。纯图标操作（返回、关闭、更多、收藏等）。
 * 结构与无障碍独立于 HButton；variant 配色与 token 共享。
 * ariaLabel 必填，提供可访问名；内部图标为装饰性。
 */
import { computed, type Component } from 'vue'
import HIcon from './HIcon.vue'

const props = withDefaults(defineProps<{
  icon: Component
  ariaLabel: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger' | 'danger-soft'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'square' | 'circle'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  shape: 'square',
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const iconSize = computed(() => props.size)

const onClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit('click', event)
}
</script>
