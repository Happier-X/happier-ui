<template>
  <nav
    class="h-sidebar"
    :class="{ 'h-sidebar--collapsed': collapsed }"
    :aria-label="ariaLabel"
  >
    <div
      v-if="$slots.header"
      class="h-sidebar__header"
    >
      <slot name="header" />
    </div>

    <ul class="h-sidebar__nav">
      <li
        v-for="item in items"
        :key="item.key"
        class="h-sidebar__item-wrap"
      >
        <button
          type="button"
          class="h-sidebar__item"
          :class="{
            'h-sidebar__item--active': item.key === modelValue,
            'h-sidebar__item--disabled': item.disabled,
          }"
          :disabled="item.disabled"
          :aria-current="item.key === modelValue ? 'page' : undefined"
          :aria-label="itemAriaLabel(item)"
          @click="onSelect(item)"
        >
          <h-icon
            v-if="item.icon"
            class="h-sidebar__icon"
            :icon="item.icon"
            size="md"
            aria-hidden="true"
          />
          <span
            v-if="item.label"
            class="h-sidebar__label"
          >{{ item.label }}</span>
        </button>
      </li>
    </ul>

    <div
      v-if="$slots.footer || showCollapseToggle"
      class="h-sidebar__footer"
    >
      <slot name="footer" />
      <h-icon-button
        v-if="showCollapseToggle"
        class="h-sidebar__toggle"
        :icon="collapsed ? PanelLeftOpen : PanelLeftClose"
        :ariaLabel="collapsed ? '展开侧边栏' : '收起侧边栏'"
        variant="ghost"
        @click="onToggle"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
/**
 * happier-ui：常驻式左侧边栏导航。
 * - items + v-model(modelValue) 为当前选中 key（string）
 * - v-model:collapsed 受控折叠；折叠态缩窄、仅视觉显示图标，label 视觉隐藏但保留可访问名
 * - showCollapseToggle 默认 true，内置折叠按钮（复用 HIconButton）
 * - header / footer 具名 slot；不内置路由
 */
import { watch, type Component } from 'vue'
import { PanelLeftClose, PanelLeftOpen } from '@lucide/vue'
import HIcon from './HIcon.vue'
import HIconButton from './HIconButton.vue'

export type HSidebarItem = {
  key: string
  label?: string
  icon?: Component
  disabled?: boolean
  /** 无可见 label（或折叠态）时的可访问名 */
  ariaLabel?: string
}

const props = withDefaults(defineProps<{
  items: HSidebarItem[]
  modelValue?: string
  collapsed?: boolean
  showCollapseToggle?: boolean
  ariaLabel?: string
}>(), {
  modelValue: undefined,
  collapsed: false,
  showCollapseToggle: true,
  ariaLabel: '侧边导航',
})

const emit = defineEmits<{
  'update:modelValue': [key: string]
  'update:collapsed': [value: boolean]
}>()

// 折叠态：button 输出 aria-label（ariaLabel 优先，回退 label）保证纯图标可访问名。
// 展开态：有可见 label 时不重复输出 aria-label；无可见 label 才用 ariaLabel。
const itemAriaLabel = (item: HSidebarItem): string | undefined => {
  if (props.collapsed) return item.ariaLabel ?? item.label
  return item.label ? undefined : item.ariaLabel
}

// 开发期校验：item 既无可见 label 又无 ariaLabel 时缺可访问名。
// 仅提醒不阻塞（保持契约层约定的宽松度）；按 key 去重避免重渲染刷屏；生产零开销。
if (import.meta.env.DEV) {
  const warnedKeys = new Set<string>()
  watch(() => props.items, (items) => {
    for (const item of items) {
      if (item.label || item.ariaLabel || warnedKeys.has(item.key)) continue
      warnedKeys.add(item.key)
      console.warn(
        `[HSidebar] item "${item.key}" 缺少可访问名：请提供 label 或 ariaLabel，否则纯图标项对辅助技术不可读。`,
      )
    }
  }, { immediate: true, deep: true })
}

const onSelect = (item: HSidebarItem) => {
  if (item.disabled) return
  emit('update:modelValue', item.key)
}

const onToggle = () => {
  emit('update:collapsed', !props.collapsed)
}
</script>
