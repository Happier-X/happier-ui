<template>
  <span
    class="h-tag"
    :class="[
      `h-tag--${variant}`,
      `h-tag--${size}`,
      { 'h-tag--disabled': disabled },
    ]"
  >
    <slot />
    <button
      v-if="closable && !disabled"
      class="h-tag__close"
      type="button"
      aria-label="关闭"
      @click="$emit('close')"
    >
      <!-- × 图标 -->
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
/**
 * happier-ui：可关闭标签。
 * - variant：default / primary / success / warning / danger
 * - size：sm / md
 * - closable：显示关闭按钮，点击触发 close emit
 * - disabled：禁用态，不显示关闭按钮
 */
withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  closable?: boolean
  disabled?: boolean
}>(), {
  variant: 'default',
  size: 'md',
  closable: false,
  disabled: false,
})

defineEmits<{
  close: []
}>()
</script>
