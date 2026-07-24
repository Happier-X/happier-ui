# Checkbox

复选框。`v-model`；label；`indeterminate` 半选（无 group 组件，由宿主组合）。

## 基础

<script setup>
import { computed, ref } from 'vue'
import { HCheckbox } from 'happier-ui'

const on = ref(false)
const sm = ref(false)
const md = ref(true)
const lg = ref(false)
const ariaOnly = ref(false)
const a = ref(true)
const b = ref(false)
const c = ref(false)

const selectAll = computed(() => a.value && b.value && c.value)
const selectIndeterminate = computed(() => {
  const n = [a.value, b.value, c.value].filter(Boolean).length
  return n > 0 && n < 3
})

const onSelectAll = (value) => {
  a.value = value
  b.value = value
  c.value = value
}
</script>

<div class="h-demo h-demo--stack">
  <h-checkbox v-model="on" label="接受条款" />
  <p class="h-demo__hint">v-model：{{ on ? 'checked' : 'unchecked' }}</p>
  <h-checkbox :model-value="true" disabled label="禁用（已选）" />
  <h-checkbox :model-value="false" disabled label="禁用（未选）" />
  <div class="h-demo--row">
    <h-checkbox v-model="sm" size="sm" label="sm" />
    <h-checkbox v-model="md" size="md" label="md" />
    <h-checkbox v-model="lg" size="lg" label="lg" />
  </div>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HCheckbox } from 'happier-ui'

const on = ref(false)
</script>

<template>
  <h-checkbox v-model="on" label="接受条款" />
</template>
```

## 半选 / 全选

半选点击时 emit `true`；宿主负责清除 `indeterminate`。

<div class="h-demo h-demo--stack">
  <h-checkbox
    :model-value="selectAll"
    :indeterminate="selectIndeterminate"
    label="全选（半选演示）"
    @update:model-value="onSelectAll"
  />
  <div style="margin-left: 1rem" class="h-demo--stack">
    <h-checkbox v-model="a" label="子项 A" />
    <h-checkbox v-model="b" label="子项 B" />
    <h-checkbox v-model="c" label="子项 C" />
  </div>
  <h-checkbox v-model="ariaOnly" aria-label="无文案复选框" />
</div>

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | 是否选中 |
| `indeterminate` | `boolean` | `false` | 半选展示 |
| `label` | `string` | — | 文案 |
| `disabled` | `boolean` | `false` | 禁用 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `ariaLabel` | `string` | — | 无 label 时的可访问名 |
| `name` | `string` | — | 表单 name |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `boolean` | 选中变化；半选点击为 `true` |

### Slots

无。

## 无障碍

- 原生 checkbox
- 提供 `label` 或 `ariaLabel`
- 半选状态由 `indeterminate` 同步到原生属性
