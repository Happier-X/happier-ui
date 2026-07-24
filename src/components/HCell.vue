<template>
  <div
    class="h-cell"
    :class="{ 'h-cell--clickable': clickable }"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-label="ariaLabel"
    @click="onClick"
    @keydown="onKeydown"
  >
    <div v-if="$slots.prefix" class="h-cell__prefix">
      <slot name="prefix" />
    </div>
    <div class="h-cell__content">
      <div class="h-cell__title">{{ title }}</div>
      <div v-if="description" class="h-cell__description">{{ description }}</div>
    </div>
    <div v-if="$slots.suffix" class="h-cell__suffix">
      <slot name="suffix" />
    </div>
    <span v-if="resolvedShowChevron" class="h-cell__chevron" aria-hidden="true">
      <HIcon :icon="ChevronRight" size="sm" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import { computed } from 'vue'
import HIcon from './HIcon.vue'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  clickable?: boolean
  showChevron?: boolean
  ariaLabel?: string
}>(), {
  description: undefined,
  clickable: false,
  showChevron: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

const resolvedShowChevron = computed(() => props.showChevron ?? props.clickable)

const onClick = (event: MouseEvent) => {
  if (!props.clickable) return
  emit('click', event)
}

const onKeydown = (event: KeyboardEvent) => {
  if (!props.clickable || event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return
  event.preventDefault()
  emit('click', event)
}
</script>
