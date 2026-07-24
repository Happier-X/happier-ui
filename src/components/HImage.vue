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
