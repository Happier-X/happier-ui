<template>
  <div
    class="h-scrollbar"
    :class="rootClasses"
    :data-scrollbar="mode"
    :aria-label="ariaLabel"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：HScrollbar
 * CSS-only 滚动容器。Web 端用原生 ::-webkit-scrollbar / scrollbar-color 自定义外观，
 * 移动端回退浏览器原生滚动。无 JS thumb、无事件、无 SSR guard。
 * 高度须由宿主控制（style="height: ..." 或外层约束），否则不会出现可滚动溢出。
 */
import { computed } from 'vue'

export interface HScrollbarProps {
  /** 滚动条模式：thin（细窄主题 thumb）/ default（浏览器原生）/ none（隐藏 thumb） */
  mode?: 'thin' | 'default' | 'none'
  /** 滚动方向：y（默认纵向）/ x（横向）/ both（双向） */
  axis?: 'x' | 'y' | 'both'
  /** thumb 宽度档：sm 4px / md 6px / lg 8px */
  size?: 'sm' | 'md' | 'lg'
  /** thumb 主题色 */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  /** 无障碍名（滚动区域 aria-label） */
  ariaLabel?: string
}

const props = withDefaults(defineProps<HScrollbarProps>(), {
  mode: 'thin',
  axis: 'y',
  size: 'md',
  color: 'default',
  ariaLabel: undefined,
})

const rootClasses = computed(() => [
  `h-scrollbar--axis-${props.axis}`,
  `h-scrollbar--${props.size}`,
  `h-scrollbar--color-${props.color}`,
])
</script>
