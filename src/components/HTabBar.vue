<template>
  <nav
    class="h-tab-bar"
    :class="{
      'h-tab-bar--fixed': fixed,
      'h-tab-bar--safe-area': safeArea,
    }"
    :aria-label="ariaLabel"
  >
    <div class="h-tab-bar__inner">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        class="h-tab-bar__item"
        :class="{
          'h-tab-bar__item--active': item.key === modelValue,
          'h-tab-bar__item--disabled': item.disabled,
        }"
        :disabled="item.disabled"
        :aria-current="item.key === modelValue ? 'page' : undefined"
        @click="onSelect(item)"
      >
        <h-icon
          v-if="item.icon"
          class="h-tab-bar__icon"
          :icon="item.icon"
          size="md"
        />
        <span
          v-if="item.label"
          class="h-tab-bar__label"
        >{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
/**
 * happier-ui：底部导航栏。
 * - v-model: modelValue 为当前 item.key（string）
 * - items: { key, label?, icon?, disabled? }[]
 * - fixed 默认 true；safeArea 默认 true（两个 prop 可独立关闭）
 * - 不内置路由；图标为组件，内部 HIcon 渲染
 */
import type { Component } from 'vue'
import HIcon from './HIcon.vue'

export type HTabBarItem = {
  key: string
  label?: string
  icon?: Component
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue?: string
  items: HTabBarItem[]
  ariaLabel?: string
  /** 是否固定在视口底部 */
  fixed?: boolean
  /** 是否启用底部安全区适配 */
  safeArea?: boolean
}>(), {
  modelValue: undefined,
  ariaLabel: '主导航',
  fixed: true,
  safeArea: true,
})

const emit = defineEmits<{
  'update:modelValue': [key: string]
}>()

const onSelect = (item: HTabBarItem) => {
  if (item.disabled) return
  emit('update:modelValue', item.key)
}
</script>
