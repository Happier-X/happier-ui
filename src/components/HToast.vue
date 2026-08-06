<template>
  <Teleport
    :to="teleportTo"
    :disabled="teleportDisabled"
  >
    <div
      v-if="modelValue"
      class="h-toast"
      :class="[
        `h-toast--${variant}`,
        `h-toast--${position}`,
      ]"
      :role="liveRole"
      :aria-live="livePoliteness"
      aria-atomic="true"
    >
      <span
        v-if="showIcon && ($slots.icon || builtinIcon)"
        class="h-toast__icon"
        aria-hidden="true"
      >
        <slot name="icon">
          <span
            v-if="builtinIcon"
            class="h-toast__icon--builtin"
          >{{ builtinIcon }}</span>
        </slot>
      </span>
      <div class="h-toast__body">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * happier-ui：轻提示。深色 HUD / iOS 原生 toast 观感。
 * MVP：v-model 控制显隐；default | success | warning | danger 语义；
 * position center（默认）| top | bottom；内置语义图标（#icon 插槽优先，icon=false 隐藏整区）；
 * duration>0 自动关闭（每次由隐藏变显示后重新计时），duration=0 持续展示。
 * 声明式单条组件；全局命令式调用、队列与堆叠由宿主负责。
 * teleport：默认 'body'，逃离带 transform/contain 祖先造成的 fixed 包含块偏移；传选择器/元素可指定容器，传 false 就地渲染（向后兼容）。
 * 关闭契约：自动关闭发出 update:modelValue(false) 与 close；外部隐藏仅清理计时器，不重复发出 close。
 * 无障碍：default/success 用 role="status" + aria-live="polite"；warning/danger 用 role="alert" + aria-live="assertive"；不抢占焦点；内置图标 aria-hidden。
 */
import { computed, onBeforeUnmount, watch } from 'vue'
import { useTeleportTarget } from '../composables/useTeleportTarget'

const BUILTIN_ICONS: Record<string, string> = {
  success: '\u2713',
  warning: '\u0021',
  danger: '\u2715',
  default: '',
}

const props = withDefaults(defineProps<{
  modelValue?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger'
  position?: 'center' | 'top' | 'bottom'
  duration?: number
  icon?: boolean
  teleport?: string | HTMLElement | false
}>(), {
  modelValue: false,
  variant: 'default',
  position: 'center',
  duration: 3000,
  icon: true,
  teleport: 'body',
})

const { to: teleportTo, disabled: teleportDisabled } = useTeleportTarget(() => props.teleport)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const showIcon = computed(() => props.icon !== false)

const builtinIcon = computed(() => BUILTIN_ICONS[props.variant] ?? '')

const liveRole = computed(() =>
  props.variant === 'warning' || props.variant === 'danger' ? 'alert' : 'status',
)

const livePoliteness = computed(() =>
  props.variant === 'warning' || props.variant === 'danger' ? 'assertive' : 'polite',
)

let timer: ReturnType<typeof setTimeout> | null = null

const clearTimer = () => {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
}

const startTimer = () => {
  clearTimer()
  if (props.duration > 0) {
    timer = setTimeout(() => {
      timer = null
      emit('update:modelValue', false)
      emit('close')
    }, props.duration)
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) startTimer()
    else clearTimer()
  },
  { immediate: true },
)

watch(
  () => props.duration,
  () => {
    if (props.modelValue) startTimer()
  },
)

onBeforeUnmount(clearTimer)
</script>
