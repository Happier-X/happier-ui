<template>
  <Teleport
    :to="teleportTo"
    :disabled="teleportDisabled"
  >
    <div
      ref="rootEl"
      class="h-popup"
      :class="rootClasses"
      :style="rootStyle"
      tabindex="-1"
      @keydown.esc.prevent="onEsc"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="resetSwipe"
    >
      <Transition
        :name="transitionName"
        @after-leave="emitAfterLeave"
      >
        <!--
          保活锚点：keepAlive 为 false（默认）时走 v-if 卸载路径，与 0.0.7 行为逐字节一致；
          keepAlive 为 true 时元素首渲即挂载、仅用 v-show 隐藏，内容不重建。
          关键约束：同一渲染周期内 v-if 与 v-show 永不同时翻转——
          默认路径 v-if 跟随 visible、v-show 恒 true；保活路径 v-if 恒 true、v-show 跟随 visible。
          若两者同时翻转，v-show 的 display:none 会提前杀死 Transition 离场动画。
        -->
        <div
          v-if="visible || keepAlive"
          v-show="keepAlive ? visible : true"
          :key="keepAlive ? undefined : transitionKey"
          class="h-popup__slot-anchor"
        >
          <!-- overlay（除 relative 外） -->
          <div
            v-if="position !== 'relative'"
            class="h-popup__overlay"
            :style="gestureOverlayStyle"
            aria-hidden="true"
            @click="onOverlayClick"
          />

          <!-- panel -->
          <section
            ref="panelEl"
            class="h-popup__panel"
            :class="panelClasses"
            :style="[panelStyle, gesturePanelStyle]"
            role="dialog"
            :aria-modal="position !== 'relative' ? true : undefined"
            :aria-labelledby="labelledBy"
            :aria-describedby="describedBy"
            :aria-label="labelledBy ? undefined : ariaLabel"
          >
            <!-- 拖拽手柄 -->
            <div
              v-if="position === 'bottom' && handle"
              class="h-popup__handle"
              aria-hidden="true"
            />

            <!-- 关闭按钮 -->
            <button
              v-if="closeable"
              type="button"
              class="h-popup__close"
              :class="`h-popup__close--${closeIconPosition}`"
              :aria-label="'关闭弹层'"
              @click="onCloseIcon"
            >
              <HIcon
                class="h-popup__close-icon"
                :icon="XIcon"
                size="20"
                aria-hidden="true"
              />
            </button>

            <!-- 标题 -->
            <header
              v-if="(title || $slots.title) && position !== 'fullscreen'"
              class="h-popup__header"
            >
              <slot name="title">
                <h2
                  :id="titleId"
                  class="h-popup__title"
                >
                  {{ title }}
                </h2>
              </slot>
            </header>

            <!-- 内容 -->
            <div class="h-popup__body">
              <slot />
            </div>

            <!-- footer -->
            <footer
              v-if="$slots.footer"
              class="h-popup__footer"
            >
              <slot name="footer" />
            </footer>
          </section>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * happier-ui：HPopup 通用浮层基础组件。
 * position 统摄 bottom / top / left / right / center / relative / fullscreen。
 * 居中/贴边/fullscreen 形态带 overlay；relative 无 overlay、JS 定位 + 边缘翻转 + scroll/resize 重算。
 * fullscreen 面板占满视口，并支持在内容滚动到顶部时下滑关闭。
 *
 * 后记：底部面板 handle、关闭按钮 closeable、标题 title/#title、footer #footer、
 * scroll lock（useScrollLock）、teleport（useTeleportTarget）。
 * keepAlive：关闭时隐藏而非卸载 slot 内容（默认 false，关闭即卸载、重开重挂载重放动画）。
 * swipeClose：fullscreen 内置下滑关闭手势开关（默认 true；false 时手势交还宿主，touch-action 复位为 auto）。
 * 不内置 before-close（宿主 v-model 自控拦截），不造引擎。
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  useSlots,
  watch,
  type CSSProperties,
  type Component,
} from 'vue'
import { X } from '@lucide/vue'
import { useTeleportTarget } from '../composables/useTeleportTarget'
import { useScrollLock } from '../composables/useScrollLock'

/* ---------- Lucide X icon ---------- */
const XIcon: Component = X

/* ---------- props ---------- */
const props = withDefaults(defineProps<{
  modelValue?: boolean
  position?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'relative' | 'fullscreen'
  triggerRef?: HTMLElement | null
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  lockScroll?: boolean
  title?: string
  ariaLabel?: string
  panelLabelledBy?: string
  panelDescribedBy?: string
  teleport?: string | HTMLElement | false
  closeable?: boolean
  closeIconPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  radius?: 'none' | 'sm' | 'md' | 'lg'
  /** 底部面板手柄 */
  handle?: boolean
  /** 关闭时保活 slot 内容（隐藏不卸载，重开重放入场动画）；默认 false 与旧行为一致 */
  keepAlive?: boolean
  /** fullscreen 下滑关闭手势开关；false 时禁用内置手势并交还宿主 touch-action */
  swipeClose?: boolean
}>(), {
  modelValue: false,
  position: 'bottom',
  triggerRef: null,
  closeOnOverlay: true,
  closeOnEsc: true,
  lockScroll: true,
  title: undefined,
  ariaLabel: undefined,
  panelLabelledBy: undefined,
  panelDescribedBy: undefined,
  teleport: 'body',
  closeable: false,
  closeIconPosition: 'top-right',
  radius: undefined,
  handle: false,
  keepAlive: false,
  swipeClose: true,
})

/* ---------- emits ---------- */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  open: []
  'after-leave': []
  'click-overlay': []
  'click-close-icon': []
}>()

/* ---------- composables ---------- */
const { to: teleportTo, disabled: teleportDisabled } = useTeleportTarget(() => props.teleport)

/* ---------- refs ---------- */
const rootEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)

/* ---------- state ---------- */
const visible = ref(props.modelValue)
const transitionKey = ref(0)
const swipeDragging = ref(false)
const swipeSnapping = ref(false)
const swipeDeltaY = ref(0)

let swipeTracking = false
let swipeStartX = 0
let swipeStartY = 0
let swipeStartTime = 0
let swipeResetTimer: ReturnType<typeof setTimeout> | undefined

/* ---------- ids ---------- */
const titleId = useId()
const slots = useSlots()

/* scroll lock：在 visible 声明后初始化，避免 TDZ */
const { lockCount } = useScrollLock({
  enabled: () => props.lockScroll && visible.value,
})

/* ---------- computed ---------- */
const labelledBy = computed(() => {
  if (props.panelLabelledBy) return props.panelLabelledBy
  if (props.position === 'fullscreen') return undefined
  if ((props.title || slots.title) && !slots.title) return titleId
  return undefined
})

const describedBy = computed(() => props.panelDescribedBy || undefined)

const rootClasses = computed(() => [
  `h-popup--position-${props.position}`,
  {
    'h-popup--dragging': swipeDragging.value,
    'h-popup--snapping': swipeSnapping.value,
    // 手势禁用仅在 fullscreen 有意义（其他 position 无 touch-action 声明）
    'h-popup--swipe-disabled': !props.swipeClose && props.position === 'fullscreen',
  },
])

const rootStyle = computed((): CSSProperties => {
  if (visible.value) return {}
  return {
    visibility: 'hidden',
    pointerEvents: 'none',
  }
})

const panelClasses = computed(() => {
  const c: string[] = []
  if (props.radius) c.push(`h-popup--radius-${props.radius}`)
  return c
})

/** fullscreen 需要独立 leave class；其他形态沿用既有 fade transition 名。 */
const transitionName = computed(() => (
  props.position === 'fullscreen' ? 'h-popup-fullscreen' : 'h-popup-fade'
))

const panelStyle = ref<CSSProperties>({})

const gesturePanelStyle = computed((): CSSProperties => {
  if (props.position !== 'fullscreen' || (!swipeDragging.value && !swipeSnapping.value)) return {}
  return {
    transform: `translateY(${swipeDeltaY.value}px)`,
  }
})

const gestureOverlayStyle = computed((): CSSProperties => {
  if (props.position !== 'fullscreen' || (!swipeDragging.value && !swipeSnapping.value)) return {}
  const viewportHeight = typeof window === 'undefined' ? 1 : Math.max(window.innerHeight, 1)
  return {
    opacity: Math.max(0, 1 - swipeDeltaY.value / viewportHeight),
  }
})

/* ---------- close flow ---------- */
function requestClose() {
  if (!visible.value) return
  emit('update:modelValue', false)
  emit('close')
}

function onOverlayClick() {
  emit('click-overlay')
  if (props.closeOnOverlay) requestClose()
}

function onEsc() {
  if (props.closeOnEsc) requestClose()
}

function onCloseIcon() {
  emit('click-close-icon')
  requestClose()
}

function emitAfterLeave() {
  emit('after-leave')
  // 切换后清理 panel inline style（relative 态遗留的 fixed 坐标）
  panelStyle.value = {}
}

/* ---------- open / close watcher ---------- */
watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      visible.value = true
      // keepAlive 下递增 key 会强制重挂载、销毁保活内容，违背保活本意
      if (!props.keepAlive) transitionKey.value++
      await nextTick()
      focusRoot()
      emit('open')
      if (props.position === 'relative') {
        nextTick(positionRelative)
        addWindowListeners()
      }
    } else {
      visible.value = false
      resetSwipe()
      removeWindowListeners()
    }
  },
)

function focusRoot() {
  rootEl.value?.focus()
}

/* ---------- fullscreen swipe-down ---------- */
const SWIPE_DISTANCE_THRESHOLD = 80
const SWIPE_VELOCITY_THRESHOLD = 0.3
const SWIPE_SNAP_DURATION = 250

function onTouchStart(event: TouchEvent) {
  // 手势禁用开关：早退后 touch 监听不再产生任何 preventDefault，手势完全交还宿主
  if (!props.swipeClose) return
  if (props.position !== 'fullscreen' || !visible.value || event.touches.length !== 1) return
  const touch = event.touches[0]
  const panel = panelEl.value
  if (!touch || !panel || panel.scrollTop > 0) return

  clearSwipeResetTimer()
  swipeTracking = true
  swipeDragging.value = false
  swipeSnapping.value = false
  swipeDeltaY.value = 0
  swipeStartX = touch.clientX
  swipeStartY = touch.clientY
  swipeStartTime = Date.now()
}

function onTouchMove(event: TouchEvent) {
  if (!swipeTracking || event.touches.length !== 1) return
  const touch = event.touches[0]
  if (!touch) return

  const deltaX = touch.clientX - swipeStartX
  const deltaY = touch.clientY - swipeStartY

  // 向上或横向手势交还给内容区；仅在顶部向下拖动时接管。
  if (!swipeDragging.value && (deltaY <= 0 || Math.abs(deltaX) >= Math.abs(deltaY))) {
    swipeTracking = false
    return
  }
  if (panelEl.value && panelEl.value.scrollTop > 0) {
    swipeTracking = false
    return
  }

  swipeDragging.value = true
  swipeDeltaY.value = Math.max(0, deltaY)
  event.preventDefault()
}

function onTouchEnd() {
  if (!swipeTracking) return
  swipeTracking = false
  if (!swipeDragging.value) return

  const elapsed = Math.max(Date.now() - swipeStartTime, 1)
  const velocity = swipeDeltaY.value / elapsed
  const shouldClose = swipeDeltaY.value >= SWIPE_DISTANCE_THRESHOLD
    || velocity >= SWIPE_VELOCITY_THRESHOLD

  if (shouldClose) {
    swipeDragging.value = false
    swipeSnapping.value = false
    swipeDeltaY.value = 0
    requestClose()
    return
  }

  // 先进入 snapping 保留当前 delta，DOM 落稳后再归零以触发 CSS 回弹 transition。
  swipeDragging.value = false
  swipeSnapping.value = true
  void nextTick(() => {
    requestAnimationFrame(() => {
      if (!swipeSnapping.value) return
      swipeDeltaY.value = 0
    })
  })
  swipeResetTimer = setTimeout(() => {
    swipeSnapping.value = false
    swipeDeltaY.value = 0
    swipeResetTimer = undefined
  }, SWIPE_SNAP_DURATION)
}

function clearSwipeResetTimer() {
  if (swipeResetTimer !== undefined) {
    clearTimeout(swipeResetTimer)
    swipeResetTimer = undefined
  }
}

function resetSwipe() {
  clearSwipeResetTimer()
  swipeTracking = false
  swipeDragging.value = false
  swipeSnapping.value = false
  swipeDeltaY.value = 0
}

/* ---------- relative positioning ---------- */
let relativeActive = false

function positionRelative() {
  if (typeof window === 'undefined') return
  const trigger = props.triggerRef
  const panel = panelEl.value
  if (!trigger || !panel) return

  const rect = trigger.getBoundingClientRect()
  const pWidth = panel.offsetWidth
  const pHeight = panel.offsetHeight

  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = 4

  const spaceBelow = vh - rect.bottom - gap
  const spaceAbove = rect.top - gap
  const spaceLeft = rect.left - gap
  const spaceRight = vw - rect.right - gap

  let targetPlacement: 'bottom' | 'top' | 'left' | 'right' = 'bottom'

  // prefer bottom, flip if needed
  if (pHeight > spaceBelow && pHeight <= spaceAbove) {
    targetPlacement = 'top'
  } else if (pHeight > spaceBelow && pHeight > spaceAbove) {
    if (pWidth <= spaceLeft) targetPlacement = 'left'
    else if (pWidth <= spaceRight) targetPlacement = 'right'
    // else stay bottom (overflow, max-height clips)
  }

  let top = 0
  let left = 0

  switch (targetPlacement) {
    case 'bottom':
      top = rect.bottom + gap
      left = rect.left
      break
    case 'top':
      top = rect.top - pHeight - gap
      left = rect.left
      break
    case 'left':
      top = rect.top
      left = rect.left - pWidth - gap
      break
    case 'right':
      top = rect.top
      left = rect.right + gap
      break
  }

  // boundary clamp (secondary axis / overflow)
  if (targetPlacement === 'bottom' || targetPlacement === 'top') {
    if (left < 4) left = 4
    if (left + pWidth > vw - 4) left = vw - pWidth - 4
  }
  if (targetPlacement === 'left' || targetPlacement === 'right') {
    if (top < 4) top = 4
    if (top + pHeight > vh - 4) top = vh - pHeight - 4
  }

  panelStyle.value = {
    position: 'fixed',
    top: `${Math.max(0, top)}px`,
    left: `${Math.max(0, left)}px`,
    zIndex: 'var(--h-z-popup-relative, var(--h-popup-z-relative, 1160))',
  }
}

function onWindowResize() {
  if (relativeActive) positionRelative()
}

function onWindowScroll(event: Event) {
  if (!relativeActive) return
  const target = event.target as Node | null
  // ignore popup-internal scroll
  if (target && panelEl.value?.contains(target)) return
  positionRelative()
}

function addWindowListeners() {
  if (typeof window === 'undefined') return
  relativeActive = true
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('scroll', onWindowScroll, true)
}

function removeWindowListeners() {
  if (typeof window === 'undefined') return
  relativeActive = false
  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('scroll', onWindowScroll, true)
}

onBeforeUnmount(() => {
  resetSwipe()
  removeWindowListeners()
})
</script>