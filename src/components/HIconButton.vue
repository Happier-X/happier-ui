<template>
  <button
    type="button"
    class="h-icon-button"
    :class="[
      `h-icon-button--${size}`,
      `h-icon-button--${resolvedVariant}`,
      color && resolvedVariant !== 'danger' ? `h-icon-button--${color}` : null,
      loading ? 'h-icon-button--loading' : null,
    ]"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-busy="loading ? 'true' : undefined"
    @click="onClick"
    @keyup.enter="onKeyGuard"
    @keyup.space="onKeyGuard"
  >
    <!-- 优先 slot（纯 Vue 宿主）；icon path 时用 Web Component ion-icon（宿主需加载 Ionic core） -->
    <slot>
      <ion-icon v-if="icon" :icon="icon" aria-hidden="true" />
    </slot>
  </button>
</template>

<script setup lang="ts">
/**
 * happier-ui：纯 Vue 图标触控。
 * 不 import @ionic/vue，避免无 Ionic 宿主无法解析依赖。
 * - slot：任意图标（SVG 等）
 * - icon：ionicons path data，依赖宿主页面已注册/加载 ion-icon
 * - variant 优先于 color 兼容 class（danger）
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  icon?: string
  ariaLabel: string
  disabled?: boolean
  loading?: boolean
  size?: 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'subtle' | 'danger' | 'on-media'
  color?: string
  stopPropagation?: boolean
}>(), {
  icon: undefined,
  disabled: false,
  loading: false,
  size: 'md',
  variant: 'default',
  color: undefined,
  stopPropagation: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

/** variant 优先；color=danger 仍映射为 danger 变体以兼容旧用法 */
const resolvedVariant = computed(() => {
  if (props.variant === 'danger' || props.color === 'danger') {
    return 'danger'
  }
  return props.variant
})

const onClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  if (props.stopPropagation) {
    event.stopPropagation()
  }
  emit('click', event)
}

const onKeyGuard = (event: KeyboardEvent) => {
  if (props.stopPropagation) {
    event.stopPropagation()
  }
}
</script>

<style scoped>
.h-icon-button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: var(--h-radius-control, 12px);
  background: transparent;
  color: var(--h-color-ink-muted, #92949c);
  cursor: pointer;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color var(--h-duration-press, 120ms) var(--h-ease-standard, ease),
    color var(--h-duration-press, 120ms) var(--h-ease-standard, ease),
    opacity var(--h-duration-press, 120ms) var(--h-ease-standard, ease);
}

.h-icon-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.h-icon-button:focus-visible {
  outline: 2px solid var(--h-color-focus-ring, var(--h-color-primary, #006fee));
  outline-offset: 2px;
}

.h-icon-button:not(:disabled):active {
  background: var(--h-color-playing-bg-soft, rgba(0, 111, 238, 0.08));
}

.h-icon-button--md {
  width: var(--h-touch-target, 48px);
  height: var(--h-touch-target, 48px);
  min-width: var(--h-touch-target, 48px);
  min-height: var(--h-touch-target, 48px);
}

.h-icon-button--lg {
  width: calc(var(--h-touch-target, 48px) + 8px);
  height: calc(var(--h-touch-target, 48px) + 8px);
  min-width: calc(var(--h-touch-target, 48px) + 8px);
  min-height: calc(var(--h-touch-target, 48px) + 8px);
}

.h-icon-button :deep(ion-icon),
.h-icon-button :deep(svg) {
  width: var(--h-icon-size-md, 22px);
  height: var(--h-icon-size-md, 22px);
  font-size: var(--h-icon-size-md, 22px);
  pointer-events: none;
}

.h-icon-button--lg :deep(ion-icon),
.h-icon-button--lg :deep(svg) {
  width: var(--h-icon-size-lg, 24px);
  height: var(--h-icon-size-lg, 24px);
  font-size: var(--h-icon-size-lg, 24px);
}

/* default：透明底 + 弱字色（基线） */
.h-icon-button--default {
  background: transparent;
  color: var(--h-color-ink-muted, #92949c);
}

/* ghost：透明 + 更弱字色 */
.h-icon-button--ghost {
  background: transparent;
  color: var(--h-color-ink-muted, #92949c);
  opacity: 0.85;
}

.h-icon-button--ghost:not(:disabled):active {
  opacity: 1;
  background: var(--h-color-playing-bg-soft, rgba(0, 111, 238, 0.08));
}

/* subtle：浅底 soft fill */
.h-icon-button--subtle {
  background: var(--h-color-surface-secondary, #f4f4f5);
  color: var(--h-color-ink, #000000);
}

.h-icon-button--subtle:not(:disabled):active {
  background: var(--h-color-border-subtle, #e0e0e0);
}

/* danger */
.h-icon-button--danger {
  color: var(--h-color-danger, #eb445a);
}

.h-icon-button--danger:not(:disabled):active {
  background: rgba(var(--h-color-danger-rgb, 235, 68, 90), 0.1);
}

/* on-media：沉浸媒体上 */
.h-icon-button--on-media {
  color: var(--h-immersive-ink-soft, rgba(255, 255, 255, 0.68));
}

.h-icon-button--on-media:not(:disabled):active {
  background: rgba(255, 255, 255, 0.08);
  color: var(--h-immersive-ink, #ffffff);
}

/* loading：降透明度 + 禁止指针（disabled 已处理） */
.h-icon-button--loading {
  opacity: 0.5;
  pointer-events: none;
}
</style>
