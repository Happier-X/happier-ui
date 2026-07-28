<template>
  <HPopup
    :model-value="modelValue"
    position="center"
    :close-on-overlay="closeOnOverlay"
    :close-on-esc="closeOnEsc"
    :lock-scroll="true"
    :aria-label="ariaLabel"
    :teleport="teleport"
    :panel-labelled-by="labelledBy"
    :panel-described-by="describedBy"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #title>
      <slot name="title">
        <h2 v-if="title" :id="titleId" class="h-popup__title">{{ title }}</h2>
      </slot>
      <slot name="description">
        <p v-if="description" :id="descriptionId" class="h-dialog__description">{{ description }}</p>
      </slot>
    </template>

    <template #footer>
      <slot name="actions" />
    </template>

    <slot />
  </HPopup>
</template>

<script setup lang="ts">
/**
 * happier-ui：居中对话框。基于 HPopup(position="center")。
 * API 完全保持与旧版一致（modelValue / closeOnOverlay / closeOnEsc / title / description / ariaLabel / teleport）。
 * 新增滚动锁定（HPopup 默认 lockScroll），填补历史缺口。
 *
 * 渲染：title + description 一并放在 HPopup #title slot（即 header），
 * 通过 panelLabelledBy / panelDescribedBy prop 注入到 HPopup 面板，
 * 保持 aria-labelledby / aria-describedby 与旧版一致。
 * #actions → #footer；所有 emit 等同旧版。
 */
import { computed, useId, useSlots } from 'vue'
import HPopup from './HPopup.vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  title?: string
  description?: string
  ariaLabel?: string
  teleport?: string | HTMLElement | false
}>(), {
  modelValue: false,
  closeOnOverlay: true,
  closeOnEsc: true,
  title: undefined,
  description: undefined,
  ariaLabel: undefined,
  teleport: 'body',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const slots = useSlots()
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
</script>