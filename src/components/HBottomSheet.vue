<template>
  <HPopup
    :model-value="modelValue"
    position="bottom"
    :close-on-overlay="closeOnOverlay"
    :close-on-esc="true"
    :lock-scroll="true"
    :handle="showHandle"
    :title="title"
    :aria-label="ariaLabel"
    :teleport="teleport"
    :max-width="maxWidth"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #title>
      <slot name="title" />
    </template>
    <slot />
  </HPopup>
</template>

<script setup lang="ts">
/**
 * happier-ui：底部面板。基于 HPopup(position="bottom")。
 * API 完全保持与旧版一致（modelValue / closeOnOverlay / showHandle / title / ariaLabel / teleport）。
 * 新增滚动锁定（HPopup 默认 lockScroll），填补历史缺口。
 * maxWidth：默认全宽（edge-to-edge）；传值则 per-instance 限宽（string 原样 / number 按 px）。
 */
import HPopup from './HPopup.vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  closeOnOverlay?: boolean
  showHandle?: boolean
  title?: string
  ariaLabel?: string
  teleport?: string | HTMLElement | false
  /** 面板最大宽度；number 按 px。不传默认全宽，桌面居中卡片感可传如 640 */
  maxWidth?: string | number
}>(), {
  modelValue: false,
  closeOnOverlay: true,
  showHandle: true,
  title: undefined,
  ariaLabel: undefined,
  teleport: 'body',
  maxWidth: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()
</script>