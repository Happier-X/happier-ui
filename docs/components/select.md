# Select

下拉选择框。基于原生 `<select>`，保留浏览器原生弹出行为，对标 `HInput` 标签 / 尺寸体系。

## 基础

<script setup>
import { ref } from 'vue'
import { HSelect } from 'happier-ui'

const value = ref('')
const log = ref('')

const fruits = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃', disabled: true },
  { value: 'durian', label: '榴莲' },
]

const onFruitChange = (v) => log.value = String(v)
</script>

<div class="h-demo h-demo--stack">
  <div>
    <p class="h-demo__hint">选中值：{{ value || '（空）' }}</p>
    <h-select
      v-model="value"
      :options="fruits"
      label="水果"
      placeholder="请选择水果"
      @change="onFruitChange"
    />
  </div>
  <p v-if="log" class="h-demo__hint">change：{{ log }}</p>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HSelect } from 'happier-ui'
import type { HSelectOption } from 'happier-ui'

const value = ref('')
const options: HSelectOption[] = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃', disabled: true },
  { value: 'durian', label: '榴莲' },
]
</script>

<template>
  <h-select
    v-model="value"
    :options="options"
    label="水果"
    placeholder="请选择水果"
    @change="(v) => console.log('change:', v)"
  />
</template>
```

## 尺寸

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" size="sm" placeholder="sm" aria-label="小号" />
  <h-select :options="fruits" size="md" placeholder="md" aria-label="中号" />
  <h-select :options="fruits" size="lg" placeholder="lg" aria-label="大号" />
</div>

```vue
<h-select :options="options" size="sm" placeholder="sm" aria-label="小号" />
<h-select :options="options" size="md" placeholder="md" aria-label="中号" />
<h-select :options="options" size="lg" placeholder="lg" aria-label="大号" />
```

## 禁用

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" disabled placeholder="禁用" aria-label="禁用" />
</div>

```vue
<h-select :options="options" disabled placeholder="禁用" aria-label="禁用" />
```

## 可清除

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" clearable placeholder="可选择清除" aria-label="可选择清除" />
</div>

```vue
<h-select :options="options" clearable placeholder="可选择清除" />
```

## 自定义选项

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" placeholder="选择水果" aria-label="自定义选项">
    <template #option="{ option }">
      <option :value="option.value" :disabled="option.disabled">
        🍉 {{ option.label }}
      </option>
    </template>
  </h-select>
</div>

```vue
<h-select :options="options" placeholder="选择水果">
  <template #option="{ option }">
    <option :value="option.value" :disabled="option.disabled">
      🍉 {{ option.label }}
    </option>
  </template>
</h-select>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `options` | `HSelectOption[]` | `[]` | 选项列表 |
| `modelValue` | `string \| number` | `''` | 当前选中值（v-model） |
| `placeholder` | `string` | — | 未选中时的提示文字 |
| `label` | `string` | — | 标签文字（同 HInput label） |
| `disabled` | `boolean` | `false` | 禁用 |
| `clearable` | `boolean` | `false` | 是否显示清空按钮 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸（对齐 HInput 尺寸体系） |
| `name` | `string` | — | 原生 name |
| `ariaLabel` | `string` | — | 无 label 时的可访问名称 |

### 类型

```ts
interface HSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}
```

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `string \| number` | 选中值改变时触发 |
| `change` | `string \| number` | 用户确认选择后触发 |

### Slots

| 名称 | 作用域 | 说明 |
|------|--------|------|
| `option` | `{ option: HSelectOption }` | 自定义选项渲染（默认渲染 `<option>` 元素） |

## 行为说明

- 基于原生 `<select>`，浏览器弹出行为全平台一致。
- `placeholder` 渲染为 `disabled` 状态的空 `<option>`，不可选中。
- `clearable` 在已有选中值时显示清空按钮；清空后触发 `update:modelValue('')` 与 `change('')`。
- `change` 仅在用户实际交互后触发，programmatic 修改 `modelValue` 不触发。
- iOS 上 `font-size` 最小 16px，防止页面缩放。

## 无障碍

- 原生 `<select>` 内建组合框语义与键盘操作。
- 无可见标签时请传 `ariaLabel`（组件输出原生 `aria-label`）。
- `label` prop 通过 `<label :for="selectId">` 关联 select 元素。
- `disabled` 态使用原生 `disabled` 属性，浏览器内置灰态。
- 清空按钮 `tabindex="-1"`，可通过键盘访问但不参与 Tab 顺序。
