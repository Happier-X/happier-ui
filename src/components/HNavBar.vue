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

<style scoped>
.h-nav-bar {
  box-sizing: border-box;
  width: 100%;
  border-bottom: 1px solid var(--h-nav-bar-border, var(--h-color-border-subtle, #e0e0e0));
  background: var(--h-nav-bar-bg, var(--h-color-surface, #ffffff));
}

.h-nav-bar--fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--h-z-nav, 30);
}

.h-nav-bar--safe-area {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top, 0px);
}

/* 1fr | auto | 1fr：两侧等分剩余空间，标题列几何中心始终在栏宽 50% */
.h-nav-bar__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 50%) minmax(0, 1fr);
  align-items: center;
  min-height: var(--h-nav-bar-height, 56px);
  padding: 0 var(--h-space-sm, 8px);
}

.h-nav-bar__left,
.h-nav-bar__right {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: var(--h-touch-target, 48px);
  overflow: hidden;
}

.h-nav-bar__left {
  justify-content: flex-start;
}

.h-nav-bar__right {
  justify-content: flex-end;
}

/* 独立中列，不与左右插槽重叠；单行省略 */
.h-nav-bar__title {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
  text-align: center;
}

.h-nav-bar__title :deep(> *) {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.h-nav-bar__heading {
  width: 100%;
  margin: 0;
  overflow: hidden;
  color: var(--h-color-ink, #000000);
  font-size: var(--h-font-title, 15px);
  font-weight: 600;
  line-height: var(--h-line-height-title, 1.25);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.h-nav-bar__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--h-touch-target, 48px);
  height: var(--h-touch-target, 48px);
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--h-radius-control, 12px);
  background: transparent;
  color: var(--h-color-ink, #000000);
  cursor: pointer;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
}

.h-nav-bar__back:hover,
.h-nav-bar__back:active {
  background: var(--h-color-surface-secondary, #f4f4f5);
}

.h-nav-bar__back:focus-visible {
  outline: 2px solid var(--h-color-focus-ring, var(--h-color-primary, #006fee));
  outline-offset: -2px;
}
</style>
