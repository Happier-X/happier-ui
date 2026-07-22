<template>
  <div
    v-if="modelValue"
    ref="rootEl"
    class="h-bottom-sheet"
    tabindex="-1"
    @keydown.esc.prevent="requestClose"
  >
    <div
      class="h-bottom-sheet__overlay"
      aria-hidden="true"
      @click="onOverlayClick"
    />
    <section
      class="h-bottom-sheet__panel"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="labelledBy"
      :aria-label="labelledBy ? undefined : ariaLabel"
    >
      <div
        v-if="showHandle"
        class="h-bottom-sheet__handle"
        aria-hidden="true"
      />
      <header
        v-if="title || $slots.title"
        class="h-bottom-sheet__header"
      >
        <slot name="title">
          <h2
            :id="titleId"
            class="h-bottom-sheet__title"
          >
            {{ title }}
          </h2>
        </slot>
      </header>
      <div class="h-bottom-sheet__body">
        <slot />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：底部面板。对齐 HeroUI Native Bottom Sheet 观感（简化）。
 * MVP：v-model、遮罩关闭、Esc、标题/内容槽；无拖拽 / snap / Teleport / focus trap。
 */
import { computed, nextTick, ref, useId, useSlots, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  closeOnOverlay?: boolean
  showHandle?: boolean
  title?: string
  ariaLabel?: string
}>(), {
  modelValue: false,
  closeOnOverlay: true,
  showHandle: true,
  title: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const slots = useSlots()
const rootEl = ref<HTMLElement | null>(null)
const titleId = useId()

const labelledBy = computed(() => {
  if (props.title && !slots.title) return titleId
  return undefined
})

const requestClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const onOverlayClick = () => {
  if (!props.closeOnOverlay) return
  requestClose()
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
.h-bottom-sheet {
  position: fixed;
  inset: 0;
  z-index: var(--h-bottom-sheet-z, var(--h-z-bottom-sheet, 1200));
  display: flex;
  align-items: flex-end;
  justify-content: center;
  outline: none;
}

.h-bottom-sheet__overlay {
  position: absolute;
  inset: 0;
  background: var(--h-bottom-sheet-overlay-bg, rgba(0, 0, 0, 0.36));
  animation: h-bottom-sheet-overlay-in var(--h-bottom-sheet-duration, 220ms)
    var(--h-ease-standard, ease) both;
}

.h-bottom-sheet__panel {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: var(--h-bottom-sheet-max-width, 640px);
  max-height: min(88vh, 100%);
  margin: 0 auto;
  padding:
    var(--h-space-sm, 8px)
    var(--h-space-lg, 16px)
    calc(var(--h-space-lg, 16px) + env(safe-area-inset-bottom, 0px));
  border-radius: var(--h-bottom-sheet-radius, 24px) var(--h-bottom-sheet-radius, 24px) 0 0;
  background: var(--h-color-surface, #ffffff);
  color: var(--h-color-ink, #000000);
  overflow: auto;
  animation: h-bottom-sheet-panel-in var(--h-bottom-sheet-duration, 220ms)
    var(--h-ease-standard, ease) both;
}

.h-bottom-sheet__handle {
  width: var(--h-bottom-sheet-handle-w, 36px);
  height: var(--h-bottom-sheet-handle-h, 4px);
  margin: var(--h-space-xs, 2px) auto var(--h-space-md, 12px);
  border-radius: var(--h-radius-pill, 999px);
  background: var(--h-color-border-subtle, #e0e0e0);
}

.h-bottom-sheet__header {
  margin-bottom: var(--h-space-md, 12px);
}

.h-bottom-sheet__title {
  margin: 0;
  font-size: var(--h-font-title, 15px);
  font-weight: 600;
  line-height: var(--h-line-height-title, 1.25);
  color: var(--h-color-ink, #000000);
}

.h-bottom-sheet__body {
  min-width: 0;
}

@keyframes h-bottom-sheet-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes h-bottom-sheet-panel-in {
  from {
    opacity: 0.96;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
