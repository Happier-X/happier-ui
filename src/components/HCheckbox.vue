<template>
  <label
    class="h-checkbox"
    :class="[
      `h-checkbox--${size}`,
      {
        'h-checkbox--checked': modelValue && !indeterminate,
        'h-checkbox--indeterminate': showIndeterminate,
        'h-checkbox--disabled': disabled,
      },
    ]"
  >
    <input
      ref="inputEl"
      class="h-checkbox__input"
      type="checkbox"
      :name="name"
      :checked="modelValue"
      :disabled="disabled"
      :aria-label="label ? undefined : ariaLabel"
      @change="onChange"
    >
    <span class="h-checkbox__box" aria-hidden="true">
      <svg
        v-if="showIndeterminate"
        class="h-checkbox__mark"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3.5 8h9"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <svg
        v-else-if="modelValue"
        class="h-checkbox__mark"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3.5 8.5l3 3 6-7"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span
      v-if="label"
      class="h-checkbox__label"
    >{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
/**
 * happier-ui：复选框。
 * - v-model: modelValue / update:modelValue (boolean)
 * - indeterminate：半选展示；点击半选时 emit true；宿主负责清 indeterminate
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  indeterminate?: boolean
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
  name?: string
}>(), {
  modelValue: false,
  indeterminate: false,
  label: undefined,
  disabled: false,
  size: 'md',
  ariaLabel: undefined,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const inputEl = ref<HTMLInputElement | null>(null)

/** 半选视觉：prop 为 true 时展示横杠（与 checked 勾选互斥展示） */
const showIndeterminate = computed(() => props.indeterminate)

const syncIndeterminate = () => {
  const el = inputEl.value
  if (!el) return
  // 原生属性：半选时设 true；勾选优先时宿主通常会关掉 indeterminate
  el.indeterminate = props.indeterminate
}

onMounted(() => {
  syncIndeterminate()
})

watch(
  () => [props.indeterminate, props.modelValue] as const,
  async () => {
    await nextTick()
    syncIndeterminate()
  },
)

const onChange = (event: Event) => {
  if (props.disabled) return
  const target = event.target as HTMLInputElement
  // PRD：半选点击 → true；否则跟随原生 checked
  if (props.indeterminate) {
    emit('update:modelValue', true)
    // 同步 DOM，避免短暂与 v-model 不一致
    target.checked = true
    target.indeterminate = false
    return
  }
  emit('update:modelValue', target.checked)
}
</script>

<style scoped>
.h-checkbox {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--h-space-sm, 8px);
  margin: 0;
  min-height: var(--h-touch-target, 48px);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--h-color-ink, #000000);
  user-select: none;
}

.h-checkbox--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.h-checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.h-checkbox__box {
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--h-checkbox-border, var(--h-color-border-subtle, #e0e0e0));
  border-radius: var(--h-checkbox-radius, 6px);
  background: var(--h-checkbox-bg, var(--h-color-surface, #ffffff));
  color: var(--h-checkbox-mark, var(--h-color-primary-contrast, #ffffff));
  transition:
    background-color var(--h-checkbox-duration, 120ms) var(--h-ease-standard, ease),
    border-color var(--h-checkbox-duration, 120ms) var(--h-ease-standard, ease);
}

.h-checkbox--checked .h-checkbox__box,
.h-checkbox--indeterminate .h-checkbox__box {
  border-color: var(--h-checkbox-bg-checked, var(--h-color-primary, #006fee));
  background: var(--h-checkbox-bg-checked, var(--h-color-primary, #006fee));
}

.h-checkbox__input:focus-visible + .h-checkbox__box {
  outline: 2px solid var(--h-color-focus-ring, var(--h-color-primary, #006fee));
  outline-offset: 2px;
}

.h-checkbox__mark {
  width: 70%;
  height: 70%;
  display: block;
}

.h-checkbox__label {
  font-size: var(--h-font-body-sm, 13px);
  line-height: 1.3;
  text-wrap: pretty;
}

.h-checkbox--sm .h-checkbox__box {
  width: var(--h-checkbox-size-sm, 16px);
  height: var(--h-checkbox-size-sm, 16px);
}

.h-checkbox--md .h-checkbox__box {
  width: var(--h-checkbox-size-md, 20px);
  height: var(--h-checkbox-size-md, 20px);
}

.h-checkbox--lg .h-checkbox__box {
  width: var(--h-checkbox-size-lg, 24px);
  height: var(--h-checkbox-size-lg, 24px);
}

.h-checkbox--sm .h-checkbox__label {
  font-size: var(--h-font-label, 12px);
}

.h-checkbox--lg .h-checkbox__label {
  font-size: var(--h-font-title, 15px);
}
</style>
