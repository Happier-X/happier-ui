<template>
  <Teleport
    :to="teleportTo"
    :disabled="teleportDisabled"
  >
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
  </Teleport>
</template>

<script setup lang="ts">
/**
 * happier-ui：底部面板。对齐 HeroUI Native Bottom Sheet 观感（简化）。
 * MVP：v-model、遮罩关闭、Esc、标题/内容槽；无拖拽 / snap / focus trap。
 * teleport：默认 'body'，逃离带 transform/contain 祖先造成的 fixed 包含块偏移；传选择器/元素可指定容器，传 false 就地渲染。
 */
import { computed, nextTick, ref, useId, useSlots, watch } from 'vue'
import { useTeleportTarget } from '../composables/useTeleportTarget'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  closeOnOverlay?: boolean
  showHandle?: boolean
  title?: string
  ariaLabel?: string
  teleport?: string | HTMLElement | false
}>(), {
  modelValue: false,
  closeOnOverlay: true,
  showHandle: true,
  title: undefined,
  ariaLabel: undefined,
  teleport: 'body',
})

const { to: teleportTo, disabled: teleportDisabled } = useTeleportTarget(() => props.teleport)

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
