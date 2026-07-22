<template>
  <button
    class="h-button"
    :class="[
      `h-button--${variant}`,
      `h-button--${size}`,
    ]"
    :type="type"
    :disabled="disabled"
    @click="onClick"
  >
    <span v-if="$slots.leading" class="h-button__leading">
      <slot name="leading" />
    </span>
    <span class="h-button__label">
      <slot />
    </span>
    <span v-if="$slots.trailing" class="h-button__trailing">
      <slot name="trailing" />
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * happier-ui：文字按钮。对齐 HeroUI Native variants / sizes。
 * 无 elevation；pressed 用背景/透明度。
 */
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger' | 'danger-soft'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const onClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit('click', event)
}
</script>

<style scoped>
.h-button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--h-button-gap, 8px);
  margin: 0;
  border: 1px solid transparent;
  border-radius: var(--h-radius-control, 12px);
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color var(--h-duration-press, 120ms) var(--h-ease-standard, ease),
    color var(--h-duration-press, 120ms) var(--h-ease-standard, ease),
    border-color var(--h-duration-press, 120ms) var(--h-ease-standard, ease),
    opacity var(--h-duration-press, 120ms) var(--h-ease-standard, ease);
}

.h-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.h-button:focus-visible {
  outline: 2px solid var(--h-color-focus-ring, var(--h-color-primary, #006fee));
  outline-offset: 2px;
}

/* sizes */
.h-button--sm {
  min-height: var(--h-button-height-sm, 32px);
  padding: 0 var(--h-button-pad-x-sm, 12px);
  font-size: var(--h-button-font-sm, 13px);
}

.h-button--md {
  min-height: var(--h-button-height-md, 40px);
  padding: 0 var(--h-button-pad-x-md, 16px);
  font-size: var(--h-button-font-md, 14px);
}

.h-button--lg {
  min-height: var(--h-button-height-lg, 48px);
  padding: 0 var(--h-button-pad-x-lg, 20px);
  font-size: var(--h-button-font-lg, 16px);
}

.h-button__leading,
.h-button__trailing {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.h-button__leading :deep(svg),
.h-button__trailing :deep(svg) {
  width: 1.15em;
  height: 1.15em;
}

.h-button__label {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

/* primary */
.h-button--primary {
  background: var(--h-color-primary, #006fee);
  color: var(--h-color-primary-contrast, #ffffff);
}

.h-button--primary:not(:disabled):active {
  background: var(--h-primary-600, #005bc4);
}

/* secondary：浅底 soft primary */
.h-button--secondary {
  background: var(--h-primary-50, #e6f1fe);
  color: var(--h-color-primary, #006fee);
}

.h-button--secondary:not(:disabled):active {
  background: var(--h-primary-100, #cce3fd);
}

/* tertiary：中性浅底 */
.h-button--tertiary {
  background: var(--h-color-surface-secondary, #f4f4f5);
  color: var(--h-color-ink, #000000);
}

.h-button--tertiary:not(:disabled):active {
  background: var(--h-color-border-subtle, #e0e0e0);
}

/* outline */
.h-button--outline {
  background: transparent;
  border-color: var(--h-color-border-subtle, #e0e0e0);
  color: var(--h-color-ink, #000000);
}

.h-button--outline:not(:disabled):active {
  background: var(--h-color-surface-secondary, #f4f4f5);
}

/* ghost */
.h-button--ghost {
  background: transparent;
  color: var(--h-color-primary, #006fee);
}

.h-button--ghost:not(:disabled):active {
  background: var(--h-color-playing-bg-soft, rgba(0, 111, 238, 0.08));
}

/* danger */
.h-button--danger {
  background: var(--h-color-danger, #eb445a);
  color: var(--h-color-primary-contrast, #ffffff);
}

.h-button--danger:not(:disabled):active {
  opacity: 0.9;
}

/* danger-soft */
.h-button--danger-soft {
  background: rgba(var(--h-color-danger-rgb, 235, 68, 90), 0.12);
  color: var(--h-color-danger, #eb445a);
}

.h-button--danger-soft:not(:disabled):active {
  background: rgba(var(--h-color-danger-rgb, 235, 68, 90), 0.2);
}
</style>
