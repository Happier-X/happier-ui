<template>
  <section
    class="h-cell-group"
    :class="inset ? 'h-cell-group--inset' : 'h-cell-group--flat'"
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
import { computed, useId, useSlots } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  inset?: boolean
}>(), {
  title: undefined,
  inset: true,
})

const slots = useSlots()
const titleId = useId()

// 仅默认标题（无自定义 header）时关联 aria-labelledby；
// 自定义 header 内部结构未知，不臆测其 id。
const labelledBy = computed(() => (
  !slots.header && props.title ? titleId : undefined
))
</script>
