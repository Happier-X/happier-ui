<template>
  <section
    class="h-cell-group"
    :class="`h-cell-group--${resolvedVariant}`"
    :aria-labelledby="labelledBy"
  >
    <header v-if="$slots.header || title" class="h-cell-group__header">
      <slot name="header">
        <h2 :id="titleId" class="h-cell-group__title">{{ title }}</h2>
      </slot>
    </header>
    <div class="h-cell-group__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * happier-ui：设置行分组容器。
 * - variant 三态：card（圆角 + 左右留白，对齐 riceui 卡片风格）/ inset（默认，圆角无留白）/ flat（无圆角）
 * - inset 布尔 prop 保留做兼容映射：true → inset，false → flat；variant 显式传入时优先
 * - title 可选（h2 默认标题，#header 可覆盖）；default 直接放 HCell，相邻直接子 Cell 自动分隔
 */
import { computed, useId, useSlots } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  inset?: boolean
  /** 形态：card 卡片（圆角+左右留白）/ inset 内嵌（默认）/ flat 通栏；优先于 inset */
  variant?: 'card' | 'inset' | 'flat'
}>(), {
  title: undefined,
  inset: true,
  variant: undefined,
})

const resolvedVariant = computed(() => props.variant ?? (props.inset ? 'inset' : 'flat'))

const slots = useSlots()
const titleId = useId()

// 仅默认标题（无自定义 header）时关联 aria-labelledby；
// 自定义 header 内部结构未知，不臆测其 id。
const labelledBy = computed(() => (
  !slots.header && props.title ? titleId : undefined
))
</script>
