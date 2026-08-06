<template>
  <Teleport
    :to="teleportTo"
    :disabled="teleportDisabled"
  >
    <div
      class="h-loading"
      :class="[
        `h-loading--${mode}`,
        `h-loading--${size}`,
      ]"
      role="status"
      :aria-label="resolvedAriaLabel"
    >
      <div
        class="h-loading__body"
        :class="{ 'h-loading__card': isGlobal }"
      >
        <span
          class="h-loading__spinner"
          aria-hidden="true"
        />
        <span
          v-if="hasLabel"
          class="h-loading__label"
        >
          <slot>{{ label }}</slot>
        </span>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * happier-ui：加载指示。CSS 圆环 spinner，内置两种展示形态。
 * - mode local（默认）：绝对定位覆盖父容器（父需 position: relative），spinner + label 垂直居中，无遮罩
 * - mode global：Teleport 到 body；fixed 全屏 + 极淡遮罩 + 深色 HUD 卡片（对齐 HToast / wanchun loading toast）
 * - size sm/md/lg（16/24/32px）；无 color prop，默认 primary 同色系轨道+顶边；宿主可覆写 --h-loading-track / --h-loading-thumb
 * - label prop 与 default slot（slot 优先）显示在 spinner 下方
 * - 纯展示，无 emits；role="status" + aria-label 三级回退（ariaLabel ?? label ?? '加载中'）；spinner aria-hidden
 * - 0.7s linear 旋转；prefers-reduced-motion: reduce 下关闭动画
 */
import { computed, useSlots } from 'vue'
import { useTeleportTarget } from '../composables/useTeleportTarget'

export interface HLoadingProps {
  /** 展示形态：local 容器内居中；global 全屏 HUD 浮层 */
  mode?: 'local' | 'global'
  /** 圆环尺寸：sm 16px / md 24px / lg 32px */
  size?: 'sm' | 'md' | 'lg'
  /** 可选说明文字；default slot 优先 */
  label?: string
  /** 覆盖默认可访问名（默认取 label，再回退「加载中」） */
  ariaLabel?: string
}

const props = withDefaults(defineProps<HLoadingProps>(), {
  mode: 'local',
  size: 'md',
  label: undefined,
  ariaLabel: undefined,
})

defineSlots<{
  default(): unknown
}>()

const slots = useSlots()

const isGlobal = computed(() => props.mode === 'global')

const { to: teleportTo, disabled: teleportDisabled } = useTeleportTarget(() =>
  props.mode === 'global' ? 'body' : false,
)

const hasLabel = computed(() => (props.label != null && props.label !== '') || !!slots.default)

/** 空串 label/ariaLabel 视为未提供，避免 aria-label="" */
const resolvedAriaLabel = computed(
  () => props.ariaLabel || props.label || '加载中',
)
</script>
