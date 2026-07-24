# Switch

开关。`v-model`；sizes；disabled；`role="switch"`。

## 基础

<script setup>
import { ref } from 'vue'
import { HSwitch } from 'happier-ui'

const on = ref(true)
const sm = ref(false)
const md = ref(true)
const lg = ref(false)
</script>

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <span class="h-demo__hint">md v-model</span>
    <h-switch v-model="on" aria-label="示例开关" />
    <span class="h-demo__hint">{{ on ? 'on' : 'off' }}</span>
  </div>
  <div class="h-demo--row">
    <span class="h-demo__hint">disabled on</span>
    <h-switch :model-value="true" disabled aria-label="禁用开" />
    <span class="h-demo__hint">disabled off</span>
    <h-switch :model-value="false" disabled aria-label="禁用关" />
  </div>
  <p class="h-demo__hint">sizes</p>
  <div class="h-demo--row">
    <h-switch v-model="sm" size="sm" aria-label="小开关" />
    <h-switch v-model="md" size="md" aria-label="中开关" />
    <h-switch v-model="lg" size="lg" aria-label="大开关" />
  </div>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HSwitch } from 'happier-ui'

const on = ref(true)
</script>

<template>
  <h-switch v-model="on" aria-label="示例开关" />
</template>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | 是否打开 |
| `disabled` | `boolean` | `false` | 禁用（不切换） |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `ariaLabel` | `string` | — | 可访问名称（建议填写） |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `boolean` | 切换后的值 |

### Slots

无。

## 无障碍

- `role="switch"` + `aria-checked`
- 建议提供 `ariaLabel`
- disabled 时不切换；`:focus-visible`
