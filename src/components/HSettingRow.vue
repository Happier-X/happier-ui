<template>
  <div
    class="h-setting-row"
    :class="[
      `h-setting-row--lines-${lines}`,
      interactive ? 'h-setting-row--interactive' : null,
    ]"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    @click="onClick"
    @keydown.enter.prevent="onActivate"
    @keydown.space.prevent="onActivate"
  >
    <div class="h-setting-row__text">
      <h2 class="h-setting-row__label">{{ label }}</h2>
      <p v-if="description" class="h-setting-row__description">{{ description }}</p>
    </div>
    <div v-if="$slots.end" class="h-setting-row__end">
      <slot name="end" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：纯 Vue 设置行壳。
 * toggle/input 由宿主放入 end 槽，不封装表单引擎。
 * interactive=true 时整行可点（role=button + 键盘）。
 */
const props = withDefaults(defineProps<{
  label: string
  description?: string
  lines?: 'none' | 'inset' | 'full'
  interactive?: boolean
}>(), {
  description: undefined,
  lines: 'full',
  interactive: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

const onClick = (event: MouseEvent) => {
  if (!props.interactive) return
  emit('click', event)
}

const onActivate = (event: KeyboardEvent) => {
  if (!props.interactive) return
  emit('click', event)
}
</script>

<style scoped>
.h-setting-row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  min-height: var(--h-touch-target, 48px);
  padding: var(--h-space-md, 12px) var(--h-space-md, 12px)
    var(--h-space-md, 12px) var(--h-space-lg, 16px);
  background: transparent;
  -webkit-tap-highlight-color: transparent;
}

.h-setting-row--interactive {
  cursor: pointer;
}

.h-setting-row--interactive:focus-visible {
  outline: 2px solid var(--h-color-focus-ring, var(--h-color-primary, #006fee));
  outline-offset: -2px;
}

.h-setting-row--interactive:active {
  background: var(--h-color-playing-bg-soft, rgba(0, 111, 238, 0.08));
}

.h-setting-row--lines-full {
  border-bottom: 1px solid var(--h-color-separator, #e0e0e0);
}

.h-setting-row--lines-inset {
  border-bottom: 1px solid var(--h-color-separator, #e0e0e0);
  margin-inline-start: var(--h-space-lg, 16px);
}

.h-setting-row--lines-none {
  border-bottom: none;
}

.h-setting-row__text {
  flex: 1;
  min-width: 0;
}

.h-setting-row__label {
  margin: 0;
  font-size: var(--h-font-title, 15px);
  font-weight: 600;
  line-height: var(--h-line-height-title, 1.25);
  color: var(--h-color-ink, #000000);
}

.h-setting-row__description {
  margin: var(--h-space-xs, 2px) 0 0;
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-ink-muted, #92949c);
  text-wrap: pretty;
}

.h-setting-row__end {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  margin-inline-start: var(--h-space-md, 12px);
}
</style>
