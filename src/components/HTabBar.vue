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

<style scoped>
.h-tab-bar {
  box-sizing: border-box;
  width: 100%;
  border-top: 1px solid var(--h-tab-bar-border, var(--h-color-border-subtle, #e0e0e0));
  background: var(--h-tab-bar-bg, var(--h-color-surface, #ffffff));
  /* 默认关闭；--safe-area 类打开（safeArea prop 默认 true） */
  padding-bottom: 0;
}

/* fixed prop 默认 true；关闭后参与普通文档流 */
.h-tab-bar--fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--h-z-tab, 30);
}

/* 安全区 prop 独立于 fixed；默认开启，背景延伸进 Home Indicator 区域 */
.h-tab-bar--safe-area {
  padding-bottom: constant(safe-area-inset-bottom); /* iOS < 11.2 */
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.h-tab-bar__inner {
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  width: 100%;
  min-height: var(--h-tab-bar-height, 64px);
}

.h-tab-bar__item {
  box-sizing: border-box;
  display: inline-flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 0;
  min-height: var(--h-touch-target, 48px);
  margin: 0;
  padding: var(--h-space-xs, 2px) var(--h-space-sm, 8px);
  border: none;
  background: transparent;
  color: var(--h-color-ink-muted, #92949c);
  font: inherit;
  cursor: pointer;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  transition: color var(--h-duration-press, 120ms) var(--h-ease-standard, ease);
}

.h-tab-bar__item--active {
  color: var(--h-color-primary, #006fee);
}

.h-tab-bar__item:disabled,
.h-tab-bar__item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.h-tab-bar__item:focus {
  outline: none;
}

.h-tab-bar__item:focus-visible {
  outline: 2px solid var(--h-color-focus-ring, var(--h-color-primary, #006fee));
  outline-offset: -2px;
}

.h-tab-bar__icon {
  flex-shrink: 0;
}

.h-tab-bar__label {
  max-width: 100%;
  overflow: hidden;
  font-size: var(--h-tab-bar-label-font, 11px);
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
