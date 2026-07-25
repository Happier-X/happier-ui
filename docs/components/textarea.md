# Textarea

多行文本输入。基于原生 `<textarea>`，对标 `HInput` label / error / size 体系。

## 基础

<script setup>
import { ref } from 'vue'
import { HTextarea } from 'happier-ui'

const value = ref('')
</script>

<div class="h-demo h-demo--stack">
  <h-textarea v-model="value" label="备注" placeholder="输入多行文本..." />
  <p class="h-demo__hint">当前值：{{ value || '（空）' }}</p>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HTextarea } from 'happier-ui'

const value = ref('')
</script>

<template>
  <h-textarea v-model="value" label="备注" placeholder="输入多行文本..." />
</template>
```

## 尺寸

<div class="h-demo h-demo--stack">
  <h-textarea v-model="value" size="sm" label="sm" placeholder="小号" :rows="2" />
  <h-textarea v-model="value" size="md" label="md" placeholder="中号" :rows="3" />
  <h-textarea v-model="value" size="lg" label="lg" placeholder="大号" :rows="4" />
</div>

```vue
<h-textarea v-model="value" size="sm" label="sm" :rows="2" />
<h-textarea v-model="value" size="md" label="md" :rows="3" />
<h-textarea v-model="value" size="lg" label="lg" :rows="4" />
```

## 自动撑高

<div class="h-demo h-demo--stack">
  <h-textarea v-model="value" label="自动撑高" placeholder="输入文字看效果..." resize="auto" />
</div>

```vue
<h-textarea v-model="value" label="自动撑高" placeholder="输入文字..." resize="auto" />
```

## 字数统计

<div class="h-demo h-demo--stack">
  <h-textarea v-model="value" label="限 50 字" :max-length="50" show-count placeholder="最多 50 字..." />
</div>

```vue
<h-textarea v-model="value" label="限 50 字" :max-length="50" show-count placeholder="最多 50 字..." />
```

## 错误态

<div class="h-demo h-demo--stack">
  <h-textarea v-model="value" label="反馈" error="内容不得为空" />
</div>

```vue
<h-textarea v-model="value" label="反馈" error="内容不得为空" />
```

## 禁用

<div class="h-demo h-demo--stack">
  <h-textarea model-value="禁用的内容" label="禁用" disabled />
</div>

```vue
<h-textarea model-value="禁用的内容" label="禁用" disabled />
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `string` | `''` | 当前值（v-model） |
| `label` | `string` | — | 标签（同 HInput） |
| `description` | `string` | — | 描述文字 |
| `error` | `string` | — | 错误消息 |
| `invalid` | `boolean` | — | 显式无效态 |
| `placeholder` | `string` | — | 占位提示 |
| `rows` | `number` | `3` | 初始行数 |
| `disabled` | `boolean` | `false` | 禁用 |
| `readonly` | `boolean` | `false` | 只读 |
| `spellcheck` | `boolean` | `true` | 拼写检查 |
| `resize` | `'none' \| 'vertical' \| 'both' \| 'auto'` | `'vertical'` | 缩放控制；`auto` 为根据内容自动撑高 |
| `maxLength` | `number` | — | 最大字符数 |
| `showCount` | `boolean` | `false` | 显示字数统计 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸（对齐 HInput） |
| `mono` | `boolean` | `false` | 内部 `<textarea>` 使用等宽字体（`var(--h-font-mono)`），适合代码 / JSON / curl 输入 |
| `name` | `string` | — | 原生 name |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `string` | 输入值改变 |
| `focus` | `FocusEvent` | 聚焦 |
| `blur` | `FocusEvent` | 失焦 |

## 行为说明

- `resize="auto"` 时 textarea 高度随内容自动撑高，同时隐藏浏览器原生缩放手柄。
- `showCount` 在 textarea 右下角显示当前字数；配合 `maxLength` 时显示 `n / max`，超限时高亮警示。
- iOS 上 `font-size` 最小 16px，防止页面缩放。

## 无障碍

- 原生 `<textarea>` 内建可编辑文本区域语义与键盘操作。
- `label` prop 通过 `<label :for="textareaId">` 关联 textarea 元素。
- `aria-invalid` / `aria-describedby` 同步 error/description 状态。
- `disabled` 态使用原生 `disabled` 属性。
