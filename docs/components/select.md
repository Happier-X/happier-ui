# Select

下拉选择框。HeroUI Web 风格的自定义 popover 面板（非原生 `<select>`），支持 `variant` / `color` / `size` / `radius`、键盘导航与完整无障碍语义。

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

const withDesc = [
  { value: 'free', label: '免费版', description: '个人体验，功能受限' },
  { value: 'pro', label: '专业版', description: '适合独立开发者' },
  { value: 'team', label: '团队版', description: '多人协作与管理' },
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

## 变体（variant）

对齐 HeroUI Web：`flat`（默认）/ `bordered` / `faded` / `underlined`。

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" variant="flat" placeholder="flat" aria-label="flat" />
  <h-select :options="fruits" variant="bordered" placeholder="bordered" aria-label="bordered" />
  <h-select :options="fruits" variant="faded" placeholder="faded" aria-label="faded" />
  <h-select :options="fruits" variant="underlined" placeholder="underlined" aria-label="underlined" />
</div>

```vue
<h-select :options="options" variant="flat" placeholder="flat" />
<h-select :options="options" variant="bordered" placeholder="bordered" />
<h-select :options="options" variant="faded" placeholder="faded" />
<h-select :options="options" variant="underlined" placeholder="underlined" />
```

## 强调色（color）

`default`（默认）/ `primary` / `success` / `warning` / `danger`，影响聚焦与展开时的强调色。

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" variant="bordered" color="primary" placeholder="primary" aria-label="primary" />
  <h-select :options="fruits" variant="bordered" color="success" placeholder="success" aria-label="success" />
  <h-select :options="fruits" variant="bordered" color="warning" placeholder="warning" aria-label="warning" />
  <h-select :options="fruits" variant="bordered" color="danger" placeholder="danger" aria-label="danger" />
</div>

```vue
<h-select :options="options" variant="bordered" color="primary" placeholder="primary" />
<h-select :options="options" variant="bordered" color="success" placeholder="success" />
<h-select :options="options" variant="bordered" color="warning" placeholder="warning" />
<h-select :options="options" variant="bordered" color="danger" placeholder="danger" />
```

## 圆角（radius）

`none` / `sm` / `md`（默认）/ `lg` / `full`。

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" variant="bordered" radius="none" placeholder="none" aria-label="radius none" />
  <h-select :options="fruits" variant="bordered" radius="sm" placeholder="sm" aria-label="radius sm" />
  <h-select :options="fruits" variant="bordered" radius="md" placeholder="md" aria-label="radius md" />
  <h-select :options="fruits" variant="bordered" radius="lg" placeholder="lg" aria-label="radius lg" />
  <h-select :options="fruits" variant="bordered" radius="full" placeholder="full" aria-label="radius full" />
</div>

```vue
<h-select :options="options" radius="none" placeholder="none" />
<h-select :options="options" radius="full" placeholder="full" />
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

## 标签位置（labelPlacement）

`outside`（默认，标签在上方）或 `inside`（标签在触发器内）。

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" label="水果" label-placement="outside" placeholder="outside" />
  <h-select :options="fruits" label="水果" label-placement="inside" placeholder="inside" />
</div>

```vue
<h-select :options="options" label="水果" label-placement="outside" />
<h-select :options="options" label="水果" label-placement="inside" />
```

## 描述与错误

`description` 提供辅助说明，`error` 展示错误（自动进入 invalid 态，`role="alert"`）。

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" label="水果" description="选择你最喜欢的水果" placeholder="请选择" />
  <h-select :options="fruits" label="水果" error="此项为必填" placeholder="请选择" />
</div>

```vue
<h-select :options="options" label="水果" description="选择你最喜欢的水果" />
<h-select :options="options" label="水果" error="此项为必填" />
```

## 选项描述

`HSelectOption.description` 在面板中作为副文本渲染。

<div class="h-demo h-demo--stack">
  <h-select :options="withDesc" label="套餐" placeholder="选择套餐" />
</div>

```vue
<script setup lang="ts">
const plans: HSelectOption[] = [
  { value: 'free', label: '免费版', description: '个人体验，功能受限' },
  { value: 'pro', label: '专业版', description: '适合独立开发者' },
  { value: 'team', label: '团队版', description: '多人协作与管理' },
]
</script>

<template>
  <h-select :options="plans" label="套餐" placeholder="选择套餐" />
</template>
```

## 禁用

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" disabled placeholder="禁用" aria-label="禁用" />
</div>

```vue
<h-select :options="options" disabled placeholder="禁用" aria-label="禁用" />
```

## 可清除

有选中值且未禁用时显示清空按钮。

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" clearable placeholder="可选择清除" aria-label="可选择清除" />
</div>

```vue
<h-select :options="options" clearable placeholder="可选择清除" />
```

## 自定义选项内容

`#option` 作用域槽自定义单项渲染。

<div class="h-demo h-demo--stack">
  <h-select :options="fruits" placeholder="选择水果" aria-label="自定义选项">
    <template #option="{ option }">
      🍉 {{ option.label }}
    </template>
  </h-select>
</div>

```vue
<h-select :options="options" placeholder="选择水果">
  <template #option="{ option }">
    🍉 {{ option.label }}
  </template>
</h-select>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `options` | `HSelectOption[]` | `[]` | 选项列表 |
| `modelValue` | `string \| number` | `''` | 当前选中值（v-model） |
| `placeholder` | `string` | `'Select an option'` | 未选中时的提示文字 |
| `label` | `string` | — | 标签文字 |
| `description` | `string` | — | 辅助说明文字 |
| `error` | `string` | — | 错误信息（自动 invalid，`role="alert"`） |
| `disabled` | `boolean` | `false` | 禁用 |
| `clearable` | `boolean` | `false` | 有值时显示清空按钮 |
| `invalid` | `boolean` | `false` | 强制无效态（有 `error` 时自动无效） |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `variant` | `'flat' \| 'bordered' \| 'faded' \| 'underlined'` | `'flat'` | 触发器视觉变体 |
| `color` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 焦点/强调色 |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | 圆角 |
| `labelPlacement` | `'outside' \| 'inside'` | `'outside'` | 标签位置 |
| `name` | `string` | — | 表单字段名（输出隐藏 `<input>`） |
| `ariaLabel` | `string` | — | 无 label 时的可访问名称 |
| `teleport` | `string \| HTMLElement \| false` | `'body'` | popover 挂载目标 |

### 类型

```ts
interface HSelectOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}
```

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `string \| number` | 选中值改变时触发 |
| `change` | `string \| number` | 用户确认选择或清空后触发（programmatic 修改不触发） |

### Slots

| 名称 | 作用域 | 说明 |
|------|--------|------|
| `option` | `{ option: HSelectOption }` | 自定义面板中单个选项的内容 |
| `value` | `{ option: HSelectOption \| null, placeholder: string }` | 自定义触发器显示的值 |
| `start` | — | 触发器左侧内容 |
| `end` | — | 触发器右侧内容（在指示器前） |
| `indicator` | `{ open: boolean }` | 自定义下拉指示器（默认旋转 chevron） |

## 行为说明

- 自定义 popover 面板，脱离原生 `<select>`；面板默认 `teleport` 到 `body`，逃离带 `transform` / `contain` 祖先的定位干扰。
- 打开时按当前选中项（或首个可选项）高亮；点击选项、点击遮罩外部、Esc、选中后自动关闭。
- `clearable` 在已有选中值且未禁用时显示清空按钮；清空触发 `update:modelValue('')` 与 `change('')`。
- `change` 仅在用户实际交互后触发，programmatic 修改 `modelValue` 不触发。
- 传入 `name` 时会输出隐藏 `<input type="hidden">` 承载值，供原生表单提交。
- 面板高度超出时内部滚动；下方空间不足时自动向上翻转。
- 触控/移动端弹层形态（picker / bottom-sheet）不在本组件范围，未来单列组件提供。

## 无障碍

- 触发器 `role="combobox"` + `aria-haspopup="listbox"` + `aria-expanded` + `aria-controls`，键盘可聚焦（`tabindex="0"`）。
- 面板 `role="listbox"`，每项 `role="option"` + `aria-selected`；禁用项 `aria-disabled`。
- 键盘导航：关闭态 Enter / Space / ↓ / ↑ 打开；打开态 ↑↓ 移动高亮、Home / End 跳首尾、Enter / Space 选中、Esc 关闭、Tab 关闭；焦点留在触发器，通过 `aria-activedescendant` 指向高亮项。
- 有可见 `label`（`outside`）时通过 `aria-labelledby` 关联；无可见标签或 `inside` 时请传 `ariaLabel`。
- `error` 以 `role="alert"` 输出并设置 `aria-invalid`；`description` / `error` 通过 `aria-describedby` 关联。
- 装饰图标（chevron / check / clear）均 `aria-hidden`。
