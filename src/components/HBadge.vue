<template>
  <span
    v-if="dot"
    class="h-badge h-badge--dot"
    :class="`h-badge--${variant}`"
    role="status"
    :aria-label="ariaLabel"
  />
  <span
    v-else
    class="h-badge"
    :class="[
      `h-badge--${variant}`,
      `h-badge--${size}`,
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
/**
 * happier-ui：小型状态徽章。
 * - variant 颜色变体：default / success / warning / danger / info
 * - size：sm / md
 * - dot：仅显示圆点（无文字），需 ariaLabel 提供可访问名称
 */
const props = withDefaults(defineProps<{
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  dot?: boolean
  ariaLabel?: string
}>(), {
  variant: 'default',
  size: 'md',
  dot: false,
  ariaLabel: undefined,
})
</script>
