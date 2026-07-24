# Input

文本输入。`v-model`；label / description / error；可对接 TanStack Vue Form Field（**不** peer 依赖 tanstack）。

## 基础

<script setup>
import { ref } from 'vue'
import { HInput } from 'happier-ui'

const name = ref('')
</script>

<div class="h-demo h-demo--stack">
  <h-input
    v-model="name"
    label="v-model 示例"
    description="标准受控输入"
    placeholder="输入名称"
  />
  <p class="h-demo__hint">当前值：{{ name || '（空）' }}</p>
  <h-input model-value="bad" label="错误态" error="请输入有效内容" size="sm" />
  <h-input model-value="disabled" label="禁用" disabled size="lg" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HInput } from 'happier-ui'

const name = ref('')
</script>

<template>
  <h-input
    v-model="name"
    label="名称"
    description="标准受控输入"
    placeholder="输入名称"
  />
</template>
```

## TanStack Vue Form

库不依赖 `@tanstack/vue-form`。在宿主用 Field 绑定：

```vue
<form.Field name="email">
  <template #default="{ field }">
    <h-input
      label="Email"
      :name="field.name"
      :model-value="String(field.state.value ?? '')"
      @update:model-value="field.handleChange"
      @blur="field.handleBlur"
    />
  </template>
</form.Field>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `string \| number` | `''` | 受控值 |
| `type` | `string` | `'text'` | input type |
| `name` | `string` | — | 表单 name |
| `id` | `string` | 自动 | 关联 label |
| `label` | `string` | — | 标签文案 |
| `description` | `string` | — | 辅助说明 |
| `error` | `string` | — | 错误文案（同时倾向 invalid） |
| `placeholder` | `string` | — | 占位 |
| `disabled` | `boolean` | `false` | 禁用 |
| `readonly` | `boolean` | `false` | 只读 |
| `autocomplete` | `string` | — | 原生 autocomplete |
| `inputmode` | `'none' \| 'text' \| 'tel' \| 'url' \| 'email' \| 'numeric' \| 'decimal' \| 'search'` | — | 输入模式 |
| `invalid` | `boolean` | 由 error 推断 | 显式校验态 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `string` | 输入变化 |
| `blur` | `FocusEvent` | 失焦 |

### Slots

无。

## 无障碍

- label 与 input 关联
- `aria-invalid` / `aria-describedby`（description / error）
