<template>
  <section
    class="h-list-section"
    :class="{ 'h-list-section--inset': inset }"
  >
    <header
      v-if="title || $slots.header"
      class="h-list-section__header"
    >
      <slot name="header">
        <h3 class="h-list-section__title">{{ title }}</h3>
      </slot>
    </header>
    <div class="h-list-section__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * happier-ui：列表分组容器。
 * - inset=false（默认）：全宽 flat
 * - inset=true：圆角卡片式分组
 * 不引入 ion-list。
 */
withDefaults(defineProps<{
  title?: string
  inset?: boolean
}>(), {
  title: undefined,
  inset: false,
})
</script>

<style scoped>
.h-list-section {
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
}

.h-list-section--inset {
  margin-inline: var(--h-space-md, 12px);
  overflow: hidden;
  border-radius: var(--h-radius-control, 12px);
  background: var(--h-color-surface, #ffffff);
}

.h-list-section__header {
  padding: var(--h-space-sm, 8px) var(--h-space-lg, 16px) var(--h-space-xs, 2px);
}

.h-list-section__title {
  margin: 0;
  font-size: var(--h-font-label, 12px);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--h-color-ink-muted, #92949c);
}

.h-list-section__body {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* inset 时 body 可用次级表面底，与外层 surface 区分 */
.h-list-section--inset .h-list-section__body {
  background: var(--h-color-surface, #ffffff);
}
</style>
