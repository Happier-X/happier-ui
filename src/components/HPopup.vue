<template>
  <Teleport
    :to="teleportTo"
    :disabled="teleportDisabled"
  >
    <div
      ref="rootEl"
      class="h-popup"
      :class="positionClass"
      :style="rootStyle"
      tabindex="-1"
      @keydown.esc.prevent="onEsc"
    >
      <Transition
        :name="transitionName"
        @after-leave="emitAfterLeave"
      >
        <div v-if="visible" :key="transitionKey" class="h-popup__slot-anchor">
          <!-- overlay（除 relative 外） -->
          <div
            v-if="position !== 'relative'"
            class="h-popup__overlay"
            aria-hidden="true"
            @click="onOverlayClick"
          />

          <!-- panel -->
          <section
            ref="panelEl"
            class="h-popup__panel"
            :class="panelClasses"
            :style="panelStyle"
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
              v-if="title || $slots.title"
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
 * position 统摄 bottom / top / left / right / center / relative（相对 trigger 定位）。
 * 居中/贴边形态带 overlay；relative 无 overlay、JS 定位 + 边缘翻转 + scroll/resize 重算。
 *
 * 后记：底部面板 handle、关闭按钮 closeable、标题 title/#title、footer #footer、
 * scroll lock（useScrollLock）、teleport（useTeleportTarget）。
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
  position?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'relative'
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
  if ((props.title || slots.title) && !slots.title) return titleId
  return undefined
})

const describedBy = computed(() => props.panelDescribedBy || undefined)

const positionClass = computed(() => `h-popup--position-${props.position}`)

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

/** overlay 用淡入淡出，panel 用位移动画（无 CSSTransition name 冲突因全在 keyframes 内用 both） */
const transitionName = computed(() => {
  if (props.position === 'center') return 'h-popup-fade'
  if (props.position === 'relative') return 'h-popup-fade'
  return 'h-popup-fade'
})

const panelStyle = ref<CSSProperties>({})

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
      transitionKey.value++
      await nextTick()
      focusRoot()
      emit('open')
      if (props.position === 'relative') {
        nextTick(positionRelative)
        addWindowListeners()
      }
    } else {
      visible.value = false
      removeWindowListeners()
    }
  },
)

function focusRoot() {
  rootEl.value?.focus()
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
  removeWindowListeners()
})
</script>