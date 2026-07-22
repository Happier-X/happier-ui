<template>
  <section
    class="h-empty-state"
    :class="{ 'h-empty-state--compact': compact }"
  >
    <div v-if="$slots.icon" class="h-empty-state__icon">
      <slot name="icon" />
    </div>
    <h2 class="h-empty-state__title">{{ title }}</h2>
    <p v-if="description" class="h-empty-state__description">{{ description }}</p>
    <div v-if="$slots.default" class="h-empty-state__actions">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * happier-ui：空态。标题/描述 + default 操作槽；可选 icon 槽与 compact 密度。
 */
withDefaults(defineProps<{
  title: string
  description?: string
  compact?: boolean
}>(), {
  description: undefined,
  compact: false,
})
</script>

<style scoped>
.h-empty-state {
  box-sizing: border-box;
  min-height: var(--h-empty-state-min-height, 60vh);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--h-space-xl, 24px);
  color: var(--h-color-ink-muted, #92949c);
  text-align: center;
}

.h-empty-state--compact {
  min-height: var(--h-empty-state-min-height-compact, 40vh);
  padding: var(--h-space-lg, 16px);
}

.h-empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--h-space-md, 12px);
  color: var(--h-color-ink-muted, #92949c);
}

.h-empty-state__title {
  margin: 0 0 var(--h-space-sm, 8px);
  color: var(--h-color-ink, #000000);
  font-size: var(--h-font-title, 15px);
  line-height: var(--h-line-height-title, 1.25);
}

.h-empty-state__description {
  max-width: var(--h-empty-state-max-width, 34rem);
  margin: 0;
  font-size: var(--h-font-body-sm, 13px);
  text-wrap: pretty;
}

.h-empty-state__actions {
  margin-top: var(--h-space-lg, 16px);
}
</style>
