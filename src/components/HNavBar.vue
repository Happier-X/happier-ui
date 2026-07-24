<template>
  <header
    class="h-nav-bar"
    :class="{
      'h-nav-bar--fixed': fixed,
      'h-nav-bar--safe-area': safeArea,
    }"
  >
    <div class="h-nav-bar__inner">
      <div class="h-nav-bar__left" @click="onLeftClick">
        <slot name="left">
          <button
            v-if="showBack"
            type="button"
            class="h-nav-bar__back"
            :aria-label="backAriaLabel"
          >
            <h-icon :icon="ChevronLeft" size="md" />
          </button>
        </slot>
      </div>

      <div class="h-nav-bar__title">
        <slot name="title">
          <h1 v-if="title" class="h-nav-bar__heading">{{ title }}</h1>
        </slot>
      </div>

      <div class="h-nav-bar__right" @click="onRightClick">
        <slot name="right" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * happier-ui：顶部标题栏。组件只通知宿主操作，不执行路由或历史返回。
 */
import { ChevronLeft } from '@lucide/vue'
import HIcon from './HIcon.vue'

withDefaults(defineProps<{
  title?: string
  showBack?: boolean
  backAriaLabel?: string
  fixed?: boolean
  safeArea?: boolean
}>(), {
  title: undefined,
  showBack: false,
  backAriaLabel: '返回',
  fixed: true,
  safeArea: true,
})

const emit = defineEmits<{
  handleLeftClick: [event: MouseEvent]
  handleRightClick: [event: MouseEvent]
}>()

const onLeftClick = (event: MouseEvent) => emit('handleLeftClick', event)
const onRightClick = (event: MouseEvent) => emit('handleRightClick', event)
</script>
