<template>
  <div
    class="h-select"
    :class="rootClasses"
  >
    <label
      v-if="label && labelPlacement === 'outside'"
      class="h-select__label"
      :id="labelId"
      :for="triggerId"
    >
      {{ label }}
    </label>

    <div class="h-select__control-wrap">
      <div
        :id="triggerId"
        ref="triggerEl"
        class="h-select__trigger"
        role="combobox"
        tabindex="0"
        :aria-expanded="open"
        :aria-controls="listboxId"
        :aria-haspopup="'listbox'"
        :aria-activedescendant="open && activeOptionId ? activeOptionId : undefined"
        :aria-labelledby="labelledBy"
        :aria-label="computedAriaLabel"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        :aria-disabled="disabled || undefined"
        @click="onTriggerClick"
        @keydown="onTriggerKeydown"
      >
        <span
          v-if="$slots.start || (label && labelPlacement === 'inside')"
          class="h-select__start"
        >
          <slot name="start" />
          <span
            v-if="label && labelPlacement === 'inside'"
            class="h-select__label-inside"
          >
            {{ label }}
          </span>
        </span>

        <span
          class="h-select__value"
          :class="{ 'h-select__value--placeholder': !hasValue }"
        >
          <slot
            name="value"
            :option="selectedOption"
            :placeholder="placeholder"
          >
            {{ hasValue && selectedOption ? selectedOption.label : placeholder }}
          </slot>
        </span>

        <span
          v-if="$slots.end"
          class="h-select__end"
        >
          <slot name="end" />
        </span>

        <button
          v-if="clearable && hasValue && !disabled"
          class="h-select__clear"
          type="button"
          tabindex="-1"
          :aria-label="`清除 ${label || '选中'}`"
          @click.stop="onClear"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <span
          class="h-select__indicator"
          aria-hidden="true"
        >
          <slot
            name="indicator"
            :open="open"
          >
            <svg
              class="h-select__chevron"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </slot>
        </span>
      </div>

      <input
        v-if="name"
        type="hidden"
        :name="name"
        :value="hasValue ? modelValue : ''"
      >
    </div>

    <p
      v-if="description"
      :id="descriptionId"
      class="h-select__description"
    >
      {{ description }}
    </p>
    <p
      v-if="error"
      :id="errorId"
      class="h-select__error"
      role="alert"
    >
      {{ error }}
    </p>

    <Teleport
      :to="teleportTo"
      :disabled="teleportDisabled"
    >
      <div
        v-if="open"
        :id="listboxId"
        ref="popoverEl"
        class="h-select__popover"
        role="listbox"
        :aria-labelledby="labelledBy"
        :aria-label="computedAriaLabel"
        :style="popoverStyle"
        @mousedown.prevent
      >
        <div
          v-for="(opt, index) in options"
          :id="optionId(index)"
          :key="String(opt.value)"
          class="h-select__option"
          :class="{
            'h-select__option--selected': isSelected(opt),
            'h-select__option--active': activeIndex === index,
            'h-select__option--disabled': isOptionDisabled(opt),
          }"
          role="option"
          :aria-selected="isSelected(opt)"
          :aria-disabled="isOptionDisabled(opt) || undefined"
          @click="onOptionClick(opt, index)"
          @mouseenter="onOptionHover(index, opt)"
        >
          <span class="h-select__option-content">
            <slot
              name="option"
              :option="opt"
            >
              <span class="h-select__option-label">{{ opt.label }}</span>
              <span
                v-if="opt.description"
                class="h-select__option-description"
              >
                {{ opt.description }}
              </span>
            </slot>
          </span>
          <span
            v-if="isSelected(opt)"
            class="h-select__check"
            aria-hidden="true"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：HeroUI Web 风格下拉选择。
 * - 自定义 popover 面板（非原生 select）
 * - combobox + listbox + aria-activedescendant 键盘导航
 * - v-model / change；clearable；variant / color / size / radius
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch,
  type CSSProperties,
} from 'vue'
import { useTeleportTarget } from '../composables/useTeleportTarget'

export interface HSelectOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  options?: HSelectOption[]
  modelValue?: string | number
  placeholder?: string
  label?: string
  description?: string
  error?: string
  disabled?: boolean
  clearable?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  labelPlacement?: 'outside' | 'inside'
  name?: string
  ariaLabel?: string
  teleport?: string | HTMLElement | false
}>(), {
  options: () => [],
  modelValue: '',
  placeholder: 'Select an option',
  label: undefined,
  description: undefined,
  error: undefined,
  disabled: false,
  clearable: false,
  invalid: false,
  size: 'md',
  variant: 'flat',
  color: 'default',
  radius: 'md',
  labelPlacement: 'outside',
  name: undefined,
  ariaLabel: undefined,
  teleport: 'body',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const { to: teleportTo, disabled: teleportDisabled } = useTeleportTarget(() => props.teleport)

const triggerId = useId()
const listboxId = useId()
const labelId = useId()
const descriptionId = useId()
const errorId = useId()
const optionIdBase = useId()

const open = ref(false)
const activeIndex = ref(-1)
const triggerEl = ref<HTMLElement | null>(null)
const popoverEl = ref<HTMLElement | null>(null)
const popoverStyle = ref<CSSProperties>({})

const hasValue = computed(() => {
  return props.modelValue !== '' && props.modelValue !== undefined && props.modelValue !== null
})

const selectedOption = computed(() => {
  if (!hasValue.value) return null
  return props.options.find((o) => o.value === props.modelValue) ?? null
})

const isInvalid = computed(() => props.invalid || Boolean(props.error))

const rootClasses = computed(() => [
  `h-select--${props.size}`,
  `h-select--${props.variant}`,
  `h-select--${props.color}`,
  `h-select--radius-${props.radius}`,
  {
    'h-select--disabled': props.disabled,
    'h-select--invalid': isInvalid.value,
    'h-select--open': open.value,
    'h-select--has-value': hasValue.value,
    'h-select--clearable': props.clearable,
    'h-select--label-inside': props.labelPlacement === 'inside',
  },
])

const labelledBy = computed(() => {
  if (props.label && props.labelPlacement === 'outside') return labelId
  return undefined
})

const computedAriaLabel = computed(() => {
  if (labelledBy.value) return undefined
  if (props.label && props.labelPlacement === 'inside') return props.label
  return props.ariaLabel || undefined
})

const describedBy = computed(() => {
  const ids: string[] = []
  if (props.description) ids.push(descriptionId)
  if (props.error) ids.push(errorId)
  return ids.length ? ids.join(' ') : undefined
})

const activeOptionId = computed(() => {
  if (activeIndex.value < 0) return undefined
  return optionId(activeIndex.value)
})

function optionId(index: number): string {
  return `${optionIdBase}-opt-${index}`
}

function isOptionDisabled(opt: HSelectOption): boolean {
  return Boolean(opt.disabled)
}

function isSelected(opt: HSelectOption): boolean {
  return hasValue.value && opt.value === props.modelValue
}

function findEnabledIndex(from: number, direction: 1 | -1): number {
  const len = props.options.length
  if (len === 0) return -1
  let i = from
  for (let step = 0; step < len; step++) {
    i = (i + direction + len) % len
    if (!isOptionDisabled(props.options[i]!)) return i
  }
  return -1
}

function firstEnabledIndex(): number {
  return props.options.findIndex((o) => !isOptionDisabled(o))
}

function lastEnabledIndex(): number {
  for (let i = props.options.length - 1; i >= 0; i--) {
    if (!isOptionDisabled(props.options[i]!)) return i
  }
  return -1
}

function indexOfValue(value: string | number): number {
  return props.options.findIndex((o) => o.value === value)
}

function setOpen(next: boolean) {
  if (props.disabled) return
  if (open.value === next) return
  open.value = next
  if (next) {
    // 打开时高亮：已选中项，否则第一项可选项
    if (hasValue.value) {
      const idx = indexOfValue(props.modelValue)
      activeIndex.value = idx >= 0 && !isOptionDisabled(props.options[idx]!)
        ? idx
        : firstEnabledIndex()
    } else {
      activeIndex.value = firstEnabledIndex()
    }
    nextTick(() => {
      positionPopover()
      scrollActiveIntoView()
    })
  } else {
    activeIndex.value = -1
  }
}

function positionPopover() {
  if (typeof window === 'undefined') return
  const trigger = triggerEl.value
  const popover = popoverEl.value
  if (!trigger || !popover) return

  const rect = trigger.getBoundingClientRect()
  const gap = 4 // can be bound to var(--h-select-gap) if computed runtime, for now 4
  const maxHeight = 280
  const spaceBelow = window.innerHeight - rect.bottom - gap
  const spaceAbove = rect.top - gap
  const popoverHeight = Math.min(popover.scrollHeight || maxHeight, maxHeight)

  let top = rect.bottom + gap
  if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
    top = Math.max(gap, rect.top - popoverHeight - gap)
  }

  popoverStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    maxHeight: `var(--h-select-max-height, ${maxHeight}px)`,
    zIndex: 'var(--h-z-select, 1150)',
  }
}

function scrollActiveIntoView() {
  if (activeIndex.value < 0 || !popoverEl.value) return
  const el = document.getElementById(optionId(activeIndex.value))
  el?.scrollIntoView({ block: 'nearest' })
}

function selectOption(opt: HSelectOption) {
  if (isOptionDisabled(opt) || props.disabled) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  setOpen(false)
  nextTick(() => triggerEl.value?.focus())
}

function onClear(event?: Event) {
  event?.preventDefault()
  event?.stopPropagation()
  if (props.disabled) return
  emit('update:modelValue', '')
  emit('change', '')
}

function onTriggerClick() {
  if (props.disabled) return
  setOpen(!open.value)
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  const key = event.key

  if (!open.value) {
    if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      return
    }
    return
  }

  switch (key) {
    case 'ArrowDown': {
      event.preventDefault()
      const next = activeIndex.value < 0
        ? firstEnabledIndex()
        : findEnabledIndex(activeIndex.value, 1)
      if (next >= 0) {
        activeIndex.value = next
        scrollActiveIntoView()
      }
      break
    }
    case 'ArrowUp': {
      event.preventDefault()
      const next = activeIndex.value < 0
        ? lastEnabledIndex()
        : findEnabledIndex(activeIndex.value, -1)
      if (next >= 0) {
        activeIndex.value = next
        scrollActiveIntoView()
      }
      break
    }
    case 'Home': {
      event.preventDefault()
      const first = firstEnabledIndex()
      if (first >= 0) {
        activeIndex.value = first
        scrollActiveIntoView()
      }
      break
    }
    case 'End': {
      event.preventDefault()
      const last = lastEnabledIndex()
      if (last >= 0) {
        activeIndex.value = last
        scrollActiveIntoView()
      }
      break
    }
    case 'Enter':
    case ' ': {
      event.preventDefault()
      if (activeIndex.value >= 0) {
        const opt = props.options[activeIndex.value]
        if (opt) selectOption(opt)
      }
      break
    }
    case 'Escape': {
      event.preventDefault()
      setOpen(false)
      nextTick(() => triggerEl.value?.focus())
      break
    }
    case 'Tab': {
      setOpen(false)
      break
    }
    default:
      break
  }
}

function onOptionClick(opt: HSelectOption, index: number) {
  if (isOptionDisabled(opt)) return
  activeIndex.value = index
  selectOption(opt)
}

function onOptionHover(index: number, opt: HSelectOption) {
  if (isOptionDisabled(opt)) return
  activeIndex.value = index
}

function onPointerDownOutside(event: Event) {
  const target = event.target as Node | null
  if (!target) return
  if (triggerEl.value?.contains(target)) return
  if (popoverEl.value?.contains(target)) return
  setOpen(false)
}

function onWindowChange(event?: Event) {
  if (!open.value) return
  if (event && event.type === 'scroll') {
    const target = event.target as Node | null
    if (target && popoverEl.value?.contains(target)) return
  }
  setOpen(false)
}

watch(open, (isOpen) => {
  if (typeof window === 'undefined') return
  if (isOpen) {
    window.addEventListener('pointerdown', onPointerDownOutside, true)
    window.addEventListener('resize', onWindowChange)
    window.addEventListener('scroll', onWindowChange, true)
  } else {
    window.removeEventListener('pointerdown', onPointerDownOutside, true)
    window.removeEventListener('resize', onWindowChange)
    window.removeEventListener('scroll', onWindowChange, true)
  }
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('pointerdown', onPointerDownOutside, true)
  window.removeEventListener('resize', onWindowChange)
  window.removeEventListener('scroll', onWindowChange, true)
})
</script>
