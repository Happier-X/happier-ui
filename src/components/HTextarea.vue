<template>
  <div
    class="h-textarea"
    :class="[
      `h-textarea--${size}`,
      {
        'h-textarea--invalid': isInvalid,
        'h-textarea--disabled': disabled,
        'h-textarea--mono': mono,
        [`h-textarea--resize-${resize}`]: true,
      },
    ]"
  >
    <label
      v-if="label"
      class="h-textarea__label"
      :for="textareaId"
    >
      {{ label }}
    </label>

    <div class="h-textarea__wrapper">
      <textarea
        :id="textareaId"
        ref="textareaRef"
        class="h-textarea__control"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :spellcheck="spellcheck"
        :rows="rows"
        :maxlength="maxLength"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        @input="onInput"
        @focus="emit('focus', $event)"
        @blur="onBlur"
      />

      <!-- 字数统计 -->
      <span
        v-if="showCount"
        class="h-textarea__count"
        :class="{ 'h-textarea__count--over': isOverLimit }"
      >
        {{ currentLength }}
        <template v-if="maxLength != null"> / {{ maxLength }}</template>
      </span>
    </div>

    <p
      v-if="description"
      :id="descriptionId"
      class="h-textarea__description"
    >
      {{ description }}
    </p>
    <p
      v-if="error"
      :id="errorId"
      class="h-textarea__error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：多行文本输入。基于原生 <textarea>，对标 HInput label/error/size 体系。
 * - v-model: modelValue / update:modelValue (string)
 * - resize: none / vertical / both / auto（auto = 根据内容撑高）
 * - mono: 为内部 <textarea> 应用等宽字体族（var(--h-font-mono)），适合代码 / JSON / curl 输入
 */
import { computed, nextTick, ref, useId, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  description?: string
  error?: string
  invalid?: boolean
  placeholder?: string
  rows?: number
  disabled?: boolean
  readonly?: boolean
  spellcheck?: boolean
  resize?: 'none' | 'vertical' | 'both' | 'auto'
  maxLength?: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  mono?: boolean
  name?: string
}>(), {
  modelValue: '',
  label: undefined,
  description: undefined,
  error: undefined,
  invalid: undefined,
  placeholder: undefined,
  rows: 3,
  disabled: false,
  readonly: false,
  spellcheck: true,
  resize: 'vertical',
  maxLength: undefined,
  showCount: false,
  size: 'md',
  mono: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const autoId = useId()
const descriptionId = useId()
const errorId = useId()

const textareaId = computed(() => autoId)

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

const currentLength = computed(() => String(props.modelValue).length)

const isOverLimit = computed(() => {
  return props.maxLength != null && currentLength.value > props.maxLength
})

// 自动撑高（resize="auto"）
const autoResize = () => {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

watch(() => props.modelValue, () => {
  if (props.resize === 'auto') {
    nextTick(autoResize)
  }
})

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  if (props.resize === 'auto') {
    target.style.height = 'auto'
    target.style.height = `${target.scrollHeight}px`
  }
}

const onBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>
