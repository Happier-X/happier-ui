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

<style scoped>
.h-empty {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: var(--h-empty-min-height, 60vh);
  padding: var(--h-empty-pad, var(--h-space-xl, 24px));
  color: var(--h-color-ink-muted, #92949c);
  text-align: center;
}

.h-empty__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--h-space-md, 12px);
  color: var(--h-color-ink-muted, #92949c);
}

.h-empty__title {
  margin: 0 0 var(--h-space-sm, 8px);
  color: var(--h-color-ink, #000000);
  font-size: var(--h-font-title, 15px);
  font-weight: 600;
  line-height: var(--h-line-height-title, 1.25);
}

.h-empty__description {
  max-width: var(--h-empty-max-width, 34rem);
  margin: 0;
  font-size: var(--h-font-body-sm, 13px);
  text-wrap: pretty;
}

.h-empty__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--h-space-sm, 8px);
  margin-top: var(--h-space-lg, 16px);
}
</style>
