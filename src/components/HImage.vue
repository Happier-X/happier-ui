<template>
  <div
    class="h-image"
    :class="[
      `h-image--radius-${radius}`,
      {
        'h-image--failed': failed,
      },
    ]"
    :style="wrapperStyle"
  >
    <img
      v-if="!failed"
      class="h-image__img"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :style="imageStyle"
      @error="onError"
    >
    <div
      v-else
      class="h-image__fallback"
    >
      <slot name="fallback">
        <span class="h-image__fallback-mark" aria-hidden="true">◎</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  alt: string
  width?: string | number
  height?: string | number
  loading?: 'eager' | 'lazy'
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}>(), {
  width: undefined,
  height: undefined,
  loading: 'lazy',
  fit: 'cover',
  radius: 'md',
})

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  },
)

const wrapperStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

const imageStyle = computed(() => ({
  objectFit: props.fit,
}))

const onError = () => {
  failed.value = true
}
</script>

<style scoped>
.h-image {
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: stretch;
  justify-content: stretch;
  overflow: hidden;
  max-width: 100%;
  background: var(--h-image-bg, var(--h-color-surface-secondary, #f4f4f5));
}

.h-image__img,
.h-image__fallback {
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 100%;
}

.h-image__img {
  max-width: 100%;
}

.h-image__fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;
  color: var(--h-image-fallback-ink, var(--h-color-ink-muted, #92949c));
}

.h-image__fallback-mark {
  font-size: 1.25rem;
  line-height: 1;
}

.h-image--radius-none {
  border-radius: 0;
}

.h-image--radius-sm {
  border-radius: var(--h-image-radius-sm, 8px);
}

.h-image--radius-md {
  border-radius: var(--h-image-radius-md, 12px);
}

.h-image--radius-lg {
  border-radius: var(--h-image-radius-lg, 16px);
}

.h-image--radius-full {
  border-radius: var(--h-image-radius-full, 999px);
}
</style>
