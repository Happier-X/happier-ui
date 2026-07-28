/**
 * happier-ui：useScrollLock
 * 引用计数式 body 滚动锁定，供多弹层协作（HPopup / HBottomSheet / HDialog 等）。
 *
 * 契约：
 * - `enabled` 为 true 时锁 `document.documentElement` 滚动，隐藏滚动条并补 padding
 * 避免页面横跳；false / SSR / 无 document 时 no-op。
 * - 多组件共用模块级计数器 `lockCount`：每个组件 lock → +1；unlock → -1；
 * lockCount = 0 时还原 body style。
 * - `onBeforeUnmount` 自动 unlock，防泄漏。
 * - 只依赖 vue（computed/watch/onBeforeUnmount），不引入宿主框架。
 */
import { computed, onBeforeUnmount, watch, type ComputedRef } from 'vue'

/** 全局锁计数 */
let lockCount = 0
/** 锁前的 `paddingRight` 值，仅在 lockCount 0→1 时记录 */
let savedPaddingRight = ''

function getScrollbarWidth(): number {
  if (typeof document === 'undefined') return 0
  const doc = document.documentElement
  return doc.offsetWidth - doc.clientWidth
}

function lock() {
  if (typeof document === 'undefined') return
  const doc = document.documentElement
  if (lockCount === 0) {
    savedPaddingRight = doc.style.paddingRight
    const sbw = getScrollbarWidth()
    doc.style.overflow = 'hidden'
    if (sbw > 0) {
      doc.style.paddingRight = `${sbw}px`
    }
  }
  lockCount++
}

function unlock() {
  if (typeof document === 'undefined') return
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    const doc = document.documentElement
    doc.style.overflow = ''
    doc.style.paddingRight = savedPaddingRight
    savedPaddingRight = ''
  }
}

/**
 * @param options.enabled - computed 或 getter，返回是否需锁滚动。
 * 当 enabled 由 false→true即 lock, true→false即 unlock；
 * 组件卸载时自动 unlock。
 */
export function useScrollLock(
  options: { enabled: ComputedRef<boolean> | (() => boolean) },
): { lockCount: number } {
  const enabled = computed(() => {
    const getter = options.enabled
    return typeof getter === 'function' ? getter() : getter.value
  })

  watch(
    enabled,
    (val, old) => {
      if (val && !old) lock()
      else if (!val && old) unlock()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    // 当前若还持有锁，释放一次
    if (enabled.value) unlock()
  })

  return { lockCount }
}