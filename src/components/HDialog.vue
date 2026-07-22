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

<style scoped>
.h-dialog {
  position: fixed;
  inset: 0;
  z-index: var(--h-dialog-z, var(--h-z-dialog, 1210));
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--h-space-lg, 16px);
  outline: none;
}

.h-dialog__overlay {
  position: absolute;
  inset: 0;
  background: var(--h-dialog-overlay-bg, rgba(0, 0, 0, 0.36));
  animation: h-dialog-overlay-in var(--h-dialog-duration, 180ms) var(--h-ease-standard, ease) both;
}

.h-dialog__panel {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: var(--h-dialog-max-width, 420px);
  max-height: calc(100vh - 2 * var(--h-space-lg, 16px));
  padding: var(--h-space-lg, 16px);
  border-radius: var(--h-dialog-radius, 20px);
  background: var(--h-color-surface, #ffffff);
  color: var(--h-color-ink, #000000);
  overflow: auto;
  animation: h-dialog-panel-in var(--h-dialog-duration, 180ms) var(--h-ease-standard, ease) both;
}

.h-dialog__header {
  margin-bottom: var(--h-space-md, 12px);
}

.h-dialog__title {
  margin: 0;
  font-size: var(--h-font-title, 15px);
  font-weight: 600;
  line-height: var(--h-line-height-title, 1.25);
}

.h-dialog__description {
  margin: var(--h-space-sm, 8px) 0 0;
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-ink-muted, #666);
  text-wrap: pretty;
}

.h-dialog__body {
  min-width: 0;
}

.h-dialog__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--h-space-sm, 8px);
  margin-top: var(--h-space-lg, 16px);
}

@keyframes h-dialog-overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes h-dialog-panel-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
