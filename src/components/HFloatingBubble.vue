<template>
  <teleport
    :to="teleportTo"
    :disabled="teleportDisabled"
  >
    <button
      ref="rootEl"
      type="button"
      class="h-floating-bubble"
      :class="{ 'h-floating-bubble--dragging': dragging }"
      :style="rootStyle"
      :aria-label="ariaLabel"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @click="onClick"
    >
      <span
        v-if="$slots.default"
        class="h-floating-bubble__content"
      >
        <slot />
      </span>
      <h-icon
        v-else-if="icon"
        class="h-floating-bubble__icon"
        :icon="icon"
        :size="iconSize"
        aria-hidden="true"
      />
    </button>
  </teleport>
</template>

<script setup lang="ts">
/**
 * happier-ui：浮动气泡（悬浮操作按钮）。对齐 Vant FloatingBubble 交互。
 * - v-model:offset 控制/监听位置（相对视口左上角 left/top，px）。
 * - axis: x | y | xy | lock（默认 y）；lock 禁拖拽但可点击。
 * - gap: number | { x, y }（默认 24），拖拽与磁吸的最小边距。
 * - magnetic: x | y，释放后按轴吸附到最近边缘。
 * - teleport: string | Element | false（默认 'body'）；SSR/无效目标降级原地渲染。
 * - 拖拽用 Pointer Events；拖拽后抑制误触 click；窗口 resize 重新夹取。
 */
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Component,
  type CSSProperties,
} from 'vue'
import HIcon from './HIcon.vue'

export type HFloatingBubbleOffset = { x: number, y: number }
export type HFloatingBubbleAxis = 'x' | 'y' | 'xy' | 'lock'
export type HFloatingBubbleMagnetic = 'x' | 'y'
export type HFloatingBubbleGap = number | { x: number, y: number }

const props = withDefaults(defineProps<{
  offset?: HFloatingBubbleOffset | null
  axis?: HFloatingBubbleAxis
  magnetic?: HFloatingBubbleMagnetic
  gap?: HFloatingBubbleGap
  icon?: Component
  ariaLabel: string
  teleport?: string | Element | false
}>(), {
  offset: null,
  axis: 'y',
  magnetic: undefined,
  gap: 24,
  icon: undefined,
  teleport: 'body',
})

const emit = defineEmits<{
  'update:offset': [value: HFloatingBubbleOffset]
  'offset-change': [value: HFloatingBubbleOffset]
  click: [event: MouseEvent]
  'drag-start': [value: HFloatingBubbleOffset]
  'drag-end': [value: HFloatingBubbleOffset]
}>()

const DEFAULT_SIZE = 48
const MOVE_THRESHOLD = 3

const rootEl = ref<HTMLElement | null>(null)
const state = ref<HFloatingBubbleOffset>({ x: 0, y: 0 })
const initialized = ref(false)
const dragging = ref(false)

// 内部拖拽临时数据
let startPointer = { x: 0, y: 0 }
let startOffset = { x: 0, y: 0 }
let moved = false
let activePointerId: number | null = null

const iconSize = computed(() => 'lg' as const)

const gapXY = computed(() => {
  if (typeof props.gap === 'number') return { x: props.gap, y: props.gap }
  return { x: props.gap.x, y: props.gap.y }
})

// —— Teleport 目标解析（onMounted 后确定，避免 SSR 报错）——
const resolvedTarget = ref<string | Element | null>(null)

const teleportDisabled = computed(() => resolvedTarget.value === null)
const teleportTo = computed(() => resolvedTarget.value ?? 'body')

const rootStyle = computed((): CSSProperties => {
  if (!initialized.value) {
    // 首帧未定位前隐藏，避免从 (0,0) 跳到目标位置的闪烁
    return { visibility: 'hidden' }
  }
  return {
    left: `${state.value.x}px`,
    top: `${state.value.y}px`,
  }
})

const clamp = (value: number, min: number, max: number) => {
  if (max < min) return min
  return Math.min(Math.max(value, min), max)
}

const getSize = () => {
  const el = rootEl.value
  if (el && el.offsetWidth > 0) {
    return { width: el.offsetWidth, height: el.offsetHeight }
  }
  return { width: DEFAULT_SIZE, height: DEFAULT_SIZE }
}

const getBounds = () => {
  const { width, height } = getSize()
  const { x: gapX, y: gapY } = gapXY.value
  const vw = window.innerWidth
  const vh = window.innerHeight
  return {
    minX: gapX,
    maxX: vw - width - gapX,
    minY: gapY,
    maxY: vh - height - gapY,
    width,
    height,
  }
}

const clampOffset = (value: HFloatingBubbleOffset): HFloatingBubbleOffset => {
  const b = getBounds()
  return {
    x: clamp(value.x, b.minX, b.maxX),
    y: clamp(value.y, b.minY, b.maxY),
  }
}

const sameOffset = (a: HFloatingBubbleOffset, b: HFloatingBubbleOffset) => (
  a.x === b.x && a.y === b.y
)

// 写入位置并按需 emit（用于拖拽 / 磁吸 / resize 校正）
const commit = (next: HFloatingBubbleOffset, notify: boolean) => {
  const clamped = clampOffset(next)
  if (sameOffset(clamped, state.value)) return
  state.value = clamped
  if (notify) {
    emit('update:offset', { ...clamped })
    emit('offset-change', { ...clamped })
  }
}

const defaultOffset = (): HFloatingBubbleOffset => {
  const b = getBounds()
  return { x: b.maxX, y: b.maxY }
}

// —— Pointer 拖拽 ——
const onPointerDown = (event: PointerEvent) => {
  if (props.axis === 'lock') return
  activePointerId = event.pointerId
  dragging.value = true
  moved = false
  startPointer = { x: event.clientX, y: event.clientY }
  startOffset = { ...state.value }
  rootEl.value?.setPointerCapture(event.pointerId)
  emit('drag-start', { ...state.value })
}

const onPointerMove = (event: PointerEvent) => {
  if (!dragging.value || event.pointerId !== activePointerId) return
  const dx = event.clientX - startPointer.x
  const dy = event.clientY - startPointer.y
  if (!moved && Math.hypot(dx, dy) > MOVE_THRESHOLD) moved = true

  const next = { ...startOffset }
  if (props.axis === 'x' || props.axis === 'xy') next.x = startOffset.x + dx
  if (props.axis === 'y' || props.axis === 'xy') next.y = startOffset.y + dy
  commit(next, true)
}

const magneticTarget = (): HFloatingBubbleOffset => {
  const b = getBounds()
  const next = { ...state.value }
  if (props.magnetic === 'x') {
    const center = state.value.x + b.width / 2
    next.x = center < window.innerWidth / 2 ? b.minX : b.maxX
  } else if (props.magnetic === 'y') {
    const center = state.value.y + b.height / 2
    next.y = center < window.innerHeight / 2 ? b.minY : b.maxY
  }
  return next
}

const onPointerUp = (event: PointerEvent) => {
  if (!dragging.value || event.pointerId !== activePointerId) return
  dragging.value = false
  activePointerId = null
  if (rootEl.value?.hasPointerCapture(event.pointerId)) {
    rootEl.value.releasePointerCapture(event.pointerId)
  }
  if (props.magnetic && moved) {
    commit(magneticTarget(), true)
  }
  emit('drag-end', { ...state.value })
}

const onClick = (event: MouseEvent) => {
  // 拖拽刚结束时抑制误触
  if (moved) {
    moved = false
    return
  }
  emit('click', event)
}

// —— 受控 offset 同步（值比较防回环）——
watch(
  () => props.offset,
  (value) => {
    if (!initialized.value) return
    commit(value ?? defaultOffset(), false)
  },
  { deep: true },
)

// —— 窗口 resize 校正 ——
const onResize = () => {
  if (!initialized.value) return
  commit(state.value, true)
}

const resolveTeleport = () => {
  if (props.teleport === false) {
    resolvedTarget.value = null
    return
  }
  if (typeof document === 'undefined') {
    resolvedTarget.value = null
    return
  }
  if (typeof props.teleport === 'string') {
    const el = document.querySelector(props.teleport)
    resolvedTarget.value = el ?? null
    return
  }
  resolvedTarget.value = props.teleport
}

onMounted(() => {
  resolveTeleport()
  // 初始位置：受控优先，否则默认右下角
  const init = props.offset ? clampOffset(props.offset) : defaultOffset()
  state.value = init
  initialized.value = true
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>
