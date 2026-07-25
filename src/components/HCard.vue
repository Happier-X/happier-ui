<template>
  <article
    class="h-card"
    :class="[
      `h-card--${variant}`,
      `h-card--pad-${padding}`,
      `h-card--radius-${radius}`,
    ]"
  >
    <div
      v-if="$slots.header"
      class="h-card__header"
    >
      <slot name="header" />
    </div>
    <div class="h-card__body">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="h-card__footer"
    >
      <slot name="footer" />
    </div>
  </article>
</template>

<script setup lang="ts">
/**
 * happier-ui：通用卡片容器。
 * 纯展示容器：无整卡可点击态、无 disabled、无 emit。
 * 可点击场景由宿主在卡内放置交互控件（HButton 等）完成。
 * 层次靠 border + surface 背景 + 圆角表达，无 elevation / box-shadow。
 * 具名 slot #header / #footer + default(body)；header/footer 缺省不渲染对应容器。
 */
withDefaults(defineProps<{
  variant?: 'outlined' | 'filled' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  radius?: 'sm' | 'md'
}>(), {
  variant: 'outlined',
  padding: 'md',
  radius: 'md',
})
</script>
