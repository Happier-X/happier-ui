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
