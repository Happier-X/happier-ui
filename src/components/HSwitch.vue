<template>
  <button
    type="button"
    class="h-switch"
    :class="[
      `h-switch--${size}`,
      {
        'h-switch--on': modelValue,
        'h-switch--disabled': disabled,
      },
    ]"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="ariaLabel"
    :disabled="disabled"
    @click="onToggle"
  >
    <span class="h-switch__track" aria-hidden="true">
      <span class="h-switch__thumb" />
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * happier-ui：开关。对齐 HeroUI Native Switch 观感（简化，无 RN 动画）。
 * v-model: modelValue + update:modelValue
 */
const props = withDefaults(defineProps<{
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
  ariaLabel: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const onToggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.h-switch {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: var(--h-space-sm, 8px);
  border: none;
  background: transparent;
  cursor: pointer;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  /* 扩大可点热区，接近 touch-target */
  min-height: var(--h-touch-target, 48px);
  min-width: var(--h-touch-target, 48px);
}

.h-switch:disabled,
.h-switch--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.h-switch:focus-visible {
  outline: none;
}

.h-switch:focus-visible .h-switch__track {
  outline: 2px solid var(--h-color-focus-ring, var(--h-color-primary, #006fee));
  outline-offset: 2px;
}

.h-switch__track {
  box-sizing: border-box;
  position: relative;
  display: block;
  flex-shrink: 0;
  border-radius: var(--h-radius-pill, 999px);
  background: var(--h-color-surface-secondary, #f4f4f5);
  transition: background-color var(--h-switch-duration, 180ms) var(--h-ease-standard, ease);
}

.h-switch--on .h-switch__track {
  background: var(--h-color-primary, #006fee);
}

.h-switch__thumb {
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: var(--h-switch-pad, 2px);
  border-radius: var(--h-radius-pill, 999px);
  background: var(--h-color-surface, #ffffff);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  transform: translateY(-50%);
  transition:
    left var(--h-switch-duration, 180ms) var(--h-ease-standard, ease),
    transform var(--h-switch-duration, 180ms) var(--h-ease-standard, ease);
}

/* sizes */
.h-switch--sm .h-switch__track {
  width: var(--h-switch-track-sm-w, 36px);
  height: var(--h-switch-track-sm-h, 20px);
}

.h-switch--sm .h-switch__thumb {
  width: var(--h-switch-thumb-sm, 16px);
  height: var(--h-switch-thumb-sm, 16px);
}

.h-switch--sm.h-switch--on .h-switch__thumb {
  left: calc(
    var(--h-switch-track-sm-w, 36px) - var(--h-switch-thumb-sm, 16px) -
      var(--h-switch-pad, 2px)
  );
}

.h-switch--md .h-switch__track {
  width: var(--h-switch-track-md-w, 44px);
  height: var(--h-switch-track-md-h, 26px);
}

.h-switch--md .h-switch__thumb {
  width: var(--h-switch-thumb-md, 22px);
  height: var(--h-switch-thumb-md, 22px);
}

.h-switch--md.h-switch--on .h-switch__thumb {
  left: calc(
    var(--h-switch-track-md-w, 44px) - var(--h-switch-thumb-md, 22px) -
      var(--h-switch-pad, 2px)
  );
}

.h-switch--lg .h-switch__track {
  width: var(--h-switch-track-lg-w, 52px);
  height: var(--h-switch-track-lg-h, 32px);
}

.h-switch--lg .h-switch__thumb {
  width: var(--h-switch-thumb-lg, 28px);
  height: var(--h-switch-thumb-lg, 28px);
}

.h-switch--lg.h-switch--on .h-switch__thumb {
  left: calc(
    var(--h-switch-track-lg-w, 52px) - var(--h-switch-thumb-lg, 28px) -
      var(--h-switch-pad, 2px)
  );
}
</style>
