<template>
  <div
    class="h-tooltip-wrapper"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @click="onClick"
  >
    <div
      ref="triggerEl"
      class="h-tooltip__trigger"
      :aria-describedby="open ? tooltipId : undefined"
    >
      <slot />
    </div>

    <Teleport
      :to="teleportTo"
      :disabled="teleportDisabled"
    >
      <div
        v-if="open"
        :id="tooltipId"
        ref="popoverEl"
        role="tooltip"
        class="h-tooltip"
        :class="rootClasses"
        :style="popoverStyle"
        @mouseenter="onPopoverEnter"
        @mouseleave="onPopoverLeave"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div
          v-if="showArrow"
          class="h-tooltip__arrow"
        ></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：HTooltip
 * 悬浮提示，支持多方向定位，遇到边界自动翻转。支持 hover / focus / tap 触发。
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

export interface HTooltipProps {
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  delay?: number
  showArrow?: boolean
  disabled?: boolean
  teleport?: string | HTMLElement | false
}

const props = withDefaults(defineProps<HTooltipProps>(), {
  content: '',
  placement: 'top',
  color: 'default',
  radius: 'md',
  delay: 200,
  showArrow: false,
  disabled: false,
  teleport: 'body',
})

const { to: teleportTo, disabled: teleportDisabled } = useTeleportTarget(() => props.teleport)

const tooltipId = useId()

const open = ref(false)
const triggerEl = ref<HTMLElement | null>(null)
const popoverEl = ref<HTMLElement | null>(null)
const popoverStyle = ref<CSSProperties>({})

// 内部实际展示的方向，当碰到边界时可能会与 placement 不同
const currentPlacement = ref(props.placement)

const rootClasses = computed(() => [
  `h-tooltip--${props.color}`,
  `h-tooltip--radius-${props.radius}`,
  `h-tooltip--placement-${currentPlacement.value}`,
  {
    'h-tooltip--with-arrow': props.showArrow,
  },
])

let openTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (openTimer) clearTimeout(openTimer)
  if (closeTimer) clearTimeout(closeTimer)
}

function show() {
  if (props.disabled) return
  clearTimers()
  openTimer = setTimeout(() => {
    open.value = true
    nextTick(positionPopover)
  }, props.delay)
}

function hide() {
  clearTimers()
  // 给一小段延迟，允许用户鼠标从 trigger 移动到 popover 上（如果允许 tooltip hover，这里可以配置，但通常 tooltip 只是纯文本）
  closeTimer = setTimeout(() => {
    open.value = false
  }, 100)
}

function onMouseEnter() {
  show()
}
function onMouseLeave() {
  hide()
}
function onFocusIn() {
  show()
}
function onFocusOut() {
  hide()
}
// 移动端兼容
function onClick() {
  if (props.disabled) return
  if (open.value) {
    hide()
  } else {
    show()
  }
}

// 如果允许鼠标悬停在 tooltip 内容本身不消失
function onPopoverEnter() {
  clearTimers()
}
function onPopoverLeave() {
  hide()
}

function positionPopover() {
  if (typeof window === 'undefined') return
  const trigger = triggerEl.value?.firstElementChild as HTMLElement || triggerEl.value
  const popover = popoverEl.value
  if (!trigger || !popover) return

  const rect = trigger.getBoundingClientRect()
  const gap = props.showArrow ? 8 : 4
  
  // 测量内容宽高
  const pWidth = popover.offsetWidth
  const pHeight = popover.offsetHeight
  
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let targetPlacement = props.placement
  
  // 碰撞检测与翻转逻辑
  if (targetPlacement === 'top' && rect.top - pHeight - gap < 0 && rect.bottom + pHeight + gap <= viewportHeight) {
    targetPlacement = 'bottom'
  } else if (targetPlacement === 'bottom' && rect.bottom + pHeight + gap > viewportHeight && rect.top - pHeight - gap >= 0) {
    targetPlacement = 'top'
  } else if (targetPlacement === 'left' && rect.left - pWidth - gap < 0 && rect.right + pWidth + gap <= viewportWidth) {
    targetPlacement = 'right'
  } else if (targetPlacement === 'right' && rect.right + pWidth + gap > viewportWidth && rect.left - pWidth - gap >= 0) {
    targetPlacement = 'left'
  }

  currentPlacement.value = targetPlacement

  let top = 0
  let left = 0

  switch (targetPlacement) {
    case 'top':
      top = rect.top - pHeight - gap
      left = rect.left + (rect.width / 2) - (pWidth / 2)
      break
    case 'bottom':
      top = rect.bottom + gap
      left = rect.left + (rect.width / 2) - (pWidth / 2)
      break
    case 'left':
      top = rect.top + (rect.height / 2) - (pHeight / 2)
      left = rect.left - pWidth - gap
      break
    case 'right':
      top = rect.top + (rect.height / 2) - (pHeight / 2)
      left = rect.right + gap
      break
  }

  // 二次校验，防止边缘溢出（仅调整跨轴，主轴已被 flip 处理过）
  if (targetPlacement === 'top' || targetPlacement === 'bottom') {
    if (left < 4) left = 4
    if (left + pWidth > viewportWidth - 4) left = viewportWidth - pWidth - 4
  } else {
    if (top < 4) top = 4
    if (top + pHeight > viewportHeight - 4) top = viewportHeight - pHeight - 4
  }

  popoverStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 'var(--h-z-tooltip, 1200)',
  }
}

function onWindowChange(event?: Event) {
  if (!open.value) return
  if (event && event.type === 'scroll') {
    const target = event.target as Node | null
    // 忽略 tooltip 自身的滚动
    if (target && popoverEl.value?.contains(target)) return
  }
  // 滚动或变尺寸时直接隐藏，或者重新计算位置（HeroUI 默认关闭或跟随，此处为了轻量先关闭）
  open.value = false
}

watch(open, (isOpen) => {
  if (typeof window === 'undefined') return
  if (isOpen) {
    window.addEventListener('resize', onWindowChange)
    window.addEventListener('scroll', onWindowChange, true)
  } else {
    window.removeEventListener('resize', onWindowChange)
    window.removeEventListener('scroll', onWindowChange, true)
  }
})

// watch prop 变化重新定位
watch(() => props.placement, (newVal) => {
  currentPlacement.value = newVal
  if (open.value) {
    nextTick(positionPopover)
  }
})

onBeforeUnmount(() => {
  clearTimers()
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', onWindowChange)
  window.removeEventListener('scroll', onWindowChange, true)
})
</script>
