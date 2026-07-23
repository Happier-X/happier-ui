<template>
  <span
    class="h-icon"
    :class="sizeClass"
    :style="wrapperStyle"
  >
    <component
      :is="icon"
      class="h-icon__svg"
      :size="resolvedSize"
      :stroke-width="strokeWidth"
      :color="resolvedColor"
      :fill="fillAttr"
      :stroke="strokeAttr"
      :aria-hidden="ariaLabel ? undefined : true"
      :aria-label="ariaLabel"
    />
  </span>
</template>

<script setup lang="ts">
/**
 * happier-ui：Lucide 图标包装。
 * - 传 Lucide Vue 组件：:icon="Search"
 * - variant: stroke | fill（Lucide 非正式 filled 集，效果因图标而异）
 * - @lucide/vue 为 peer，库不打包具体图标
 */
import { computed, type Component, type CSSProperties } from 'vue'

const props = withDefaults(defineProps<{
  icon: Component
  variant?: 'stroke' | 'fill'
  size?: 'sm' | 'md' | 'lg' | number
  strokeWidth?: number
  color?: string
  ariaLabel?: string
}>(), {
  variant: 'stroke',
  size: 'md',
  strokeWidth: 2,
  color: undefined,
  ariaLabel: undefined,
})

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
} as const

const sizeClass = computed(() => {
  if (typeof props.size === 'number') return 'h-icon--custom'
  return `h-icon--${props.size}`
})

const resolvedSize = computed(() => {
  if (typeof props.size === 'number') return props.size
  return sizeMap[props.size]
})

const resolvedColor = computed(() => props.color || 'currentColor')

const fillAttr = computed(() => (
  props.variant === 'fill' ? 'currentColor' : 'none'
))

const strokeAttr = computed(() => (
  props.variant === 'fill' ? 'none' : 'currentColor'
))

const wrapperStyle = computed((): CSSProperties => {
  const style: CSSProperties = {}
  if (props.color) style.color = props.color
  if (typeof props.size === 'number') {
    style.width = `${props.size}px`
    style.height = `${props.size}px`
  }
  return style
})
</script>

<style scoped>
.h-icon {
  box-sizing: border-box;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  line-height: 0;
  color: inherit;
  vertical-align: middle;
}

.h-icon__svg {
  display: block;
}

.h-icon--sm {
  width: var(--h-icon-size-sm, 16px);
  height: var(--h-icon-size-sm, 16px);
}

.h-icon--md {
  width: var(--h-icon-size-md, 20px);
  height: var(--h-icon-size-md, 20px);
}

.h-icon--lg {
  width: var(--h-icon-size-lg, 24px);
  height: var(--h-icon-size-lg, 24px);
}

.h-icon--custom {
  /* 尺寸由 inline style 控制 */
}
</style>
