<template>
  <div
    class="h-input"
    :class="[
      `h-input--${size}`,
      {
        'h-input--invalid': isInvalid,
        'h-input--disabled': disabled,
      },
    ]"
  >
    <label
      v-if="label"
      class="h-input__label"
      :for="inputId"
    >
      {{ label }}
    </label>

    <input
      :id="inputId"
      class="h-input__control"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
      @input="onInput"
      @blur="onBlur"
    >

    <p
      v-if="description"
      :id="descriptionId"
      class="h-input__description"
    >
      {{ description }}
    </p>
    <p
      v-if="error"
      :id="errorId"
      class="h-input__error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：文本输入。
 * - v-model: modelValue / update:modelValue
 * - TanStack Vue Form：:model-value + @update:model-value="field.handleChange" + @blur="field.handleBlur" + :name
 * 不依赖 @tanstack/vue-form。
 */
import { computed, useId } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: string
  name?: string
  id?: string
  label?: string
  description?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  autocomplete?: string
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  modelValue: '',
  type: 'text',
  name: undefined,
  id: undefined,
  label: undefined,
  description: undefined,
  error: undefined,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  autocomplete: undefined,
  inputmode: undefined,
  invalid: undefined,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

const autoId = useId()
const descriptionId = useId()
const errorId = useId()

const inputId = computed(() => props.id || autoId)

const isInvalid = computed(() => {
  if (props.invalid !== undefined) return props.invalid
  return Boolean(props.error)
})

const describedBy = computed(() => {
  const ids: string[] = []
  if (props.description) ids.push(descriptionId)
  if (props.error) ids.push(errorId)
  return ids.length ? ids.join(' ') : undefined
})

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const onBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
.h-input {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--h-space-xs, 2px);
  width: 100%;
  min-width: 0;
}

.h-input__label {
  font-size: var(--h-font-label, 12px);
  font-weight: 600;
  color: var(--h-color-ink, #000000);
}

.h-input__control {
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  border: 1px solid var(--h-input-border, var(--h-color-border-subtle, #e0e0e0));
  border-radius: var(--h-input-radius, var(--h-radius-control, 12px));
  background: var(--h-input-bg, var(--h-color-surface, #ffffff));
  color: var(--h-color-ink, #000000);
  font: inherit;
  line-height: 1.25;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    border-color var(--h-duration-press, 120ms) var(--h-ease-standard, ease),
    box-shadow var(--h-duration-press, 120ms) var(--h-ease-standard, ease);
}

.h-input__control::placeholder {
  color: var(--h-input-placeholder, var(--h-color-ink-muted, #92949c));
}

.h-input__control:focus {
  outline: none;
}

.h-input__control:focus-visible {
  border-color: var(--h-color-focus-ring, var(--h-color-primary, #006fee));
  box-shadow: 0 0 0 2px rgba(var(--h-color-primary-rgb, 0, 111, 238), 0.2);
}

.h-input--invalid .h-input__control {
  border-color: var(--h-input-border-invalid, var(--h-color-danger, #eb445a));
}

.h-input--invalid .h-input__control:focus-visible {
  box-shadow: 0 0 0 2px rgba(var(--h-color-danger-rgb, 235, 68, 90), 0.2);
}

.h-input--disabled {
  opacity: 0.55;
}

.h-input__control:disabled {
  cursor: not-allowed;
}

.h-input--sm .h-input__control {
  height: var(--h-input-height-sm, 32px);
  padding: 0 var(--h-input-pad-x-sm, 10px);
  font-size: var(--h-input-font-sm, 13px);
}

.h-input--md .h-input__control {
  height: var(--h-input-height-md, 40px);
  padding: 0 var(--h-input-pad-x-md, 12px);
  font-size: var(--h-input-font-md, 14px);
}

.h-input--lg .h-input__control {
  height: var(--h-input-height-lg, 48px);
  padding: 0 var(--h-input-pad-x-lg, 14px);
  font-size: var(--h-input-font-lg, 16px);
}

.h-input__description {
  margin: 0;
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-ink-muted, #666);
  text-wrap: pretty;
}

.h-input__error {
  margin: 0;
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-danger, #eb445a);
  text-wrap: pretty;
}
</style>
