<template>
  <div
    v-if="modelValue"
    ref="rootEl"
    class="h-dialog"
    tabindex="-1"
    @keydown.esc.prevent="onEsc"
  >
    <div
      class="h-dialog__overlay"
      aria-hidden="true"
      @click="onOverlayClick"
    />
    <section
      class="h-dialog__panel"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-label="labelledBy ? undefined : ariaLabel"
    >
      <header v-if="title || description || $slots.title || $slots.description" class="h-dialog__header">
        <slot name="title">
          <h2 v-if="title" :id="titleId" class="h-dialog__title">{{ title }}</h2>
        </slot>
        <slot name="description">
          <p v-if="description" :id="descriptionId" class="h-dialog__description">{{ description }}</p>
        </slot>
      </header>
      <div class="h-dialog__body">
        <slot />
      </div>
      <footer v-if="$slots.actions" class="h-dialog__actions">
        <slot name="actions" />
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：居中对话框。对齐 HeroUI Native Dialog 观感（简化）。
 * MVP：v-model、overlay/Esc、title/description/default/actions；无 Portal / focus trap。
 */
import { computed, nextTick, ref, useId, useSlots, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  title?: string
  description?: string
  ariaLabel?: string
}>(), {
  modelValue: false,
  closeOnOverlay: true,
  closeOnEsc: true,
  title: undefined,
  description: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const slots = useSlots()
const rootEl = ref<HTMLElement | null>(null)
const titleId = useId()
const descriptionId = useId()

const labelledBy = computed(() => {
  if (props.title && !slots.title) return titleId
  return undefined
})

const describedBy = computed(() => {
  if (props.description && !slots.description) return descriptionId
  return undefined
})

const requestClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const onOverlayClick = () => {
  if (props.closeOnOverlay) requestClose()
}

const onEsc = () => {
  if (props.closeOnEsc) requestClose()
}

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return
    await nextTick()
    rootEl.value?.focus()
  },
)
</script>
