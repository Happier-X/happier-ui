import { computed, onMounted, ref, watch, type ComputedRef } from 'vue'

/**
 * happier-ui：浮层组件的 Teleport 目标解析。
 *
 * 背景：带 `transform` / `contain: layout` / `filter` / `will-change` 的祖先会成为
 * `position: fixed` 后代的包含块（CSS Containment §3 / MDN fixed 例外），令浮层参考系
 * 被宿主劫持而错位。默认 teleport 到 `body` 可逃离任意祖先的包含块 / stacking context。
 *
 * 契约：
 * - `target` 取值 `string`（CSS 选择器）| `Element` | `false`。
 * - `false`：禁用 teleport，就地渲染（向后兼容逃生口）。
 * - SSR（无 `document`）或选择器查无元素：降级为原地渲染（`disabled` 为 true）。
 * - 目标在 `onMounted` 后解析，避免 SSR / 首帧 DOM 未就绪时报错；`target` 变化时重解析。
 *
 * @param getTarget 返回当前 `teleport` prop 值的 getter。
 * @returns `to`（`<Teleport :to>`）与 `disabled`（`<Teleport :disabled>`）两个 computed。
 */
export function useTeleportTarget(
  getTarget: () => string | Element | false,
): { to: ComputedRef<string | Element>, disabled: ComputedRef<boolean> } {
  const resolved = ref<string | Element | null>(null)

  const resolve = () => {
    const target = getTarget()
    if (target === false) {
      resolved.value = null
      return
    }
    if (typeof document === 'undefined') {
      resolved.value = null
      return
    }
    if (typeof target === 'string') {
      resolved.value = document.querySelector(target) ?? null
      return
    }
    resolved.value = target
  }

  onMounted(resolve)
  watch(getTarget, resolve)

  const disabled = computed(() => resolved.value === null)
  const to = computed(() => resolved.value ?? 'body')

  return { to, disabled }
}
