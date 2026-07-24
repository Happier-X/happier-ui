<template>
  <section class="h-empty">
    <div
      v-if="$slots.icon"
      class="h-empty__icon"
    >
      <slot name="icon" />
    </div>
    <h2 class="h-empty__title">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="h-empty__description"
    >
      {{ description }}
    </p>
    <div
      v-if="$slots.default"
      class="h-empty__actions"
    >
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * happier-ui：空状态占位。
 * title 必填；可选 description、#icon、default 操作槽。
 * 不提供 compact；收紧高度由宿主外层控制。
 */
withDefaults(defineProps<{
  title: string
  description?: string
}>(), {
  description: undefined,
})
</script>
