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
