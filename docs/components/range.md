# Range

数值滑块。基于原生 `input[type="range"]`，在连续或离散区间内选择数值；`v-model` 读写；`min` / `max` / `step` 定义区间与步进；`disabled` 与 `sm | md | lg` 尺寸。已填充轨道、thumb、焦点态走 `--h-*` token。MVP **仅** 横向单值滑块。

## 基础

<script setup>
import { ref } from 'vue'
import { HRange } from 'happier-ui'

const value = ref(40)
const stepped = ref(2)
const disabledValue = ref(50)
</script>

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">当前值：{{ value }}</p>
  <h-range v-model="value" aria-label="基础滑块" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HRange } from 'happier-ui'

const value = ref(40)
</script>

<template>
  <h-range v-model="value" aria-label="音量" />
</template>
```

## 步进 / 区间

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">min=0 max=10 step=2；当前：{{ stepped }}</p>
  <h-range v-model="stepped" :min="0" :max="10" :step="2" aria-label="步进滑块" />
</div>

```vue
<h-range
  v-model="stepped"
  :min="0"
  :max="10"
  :step="2"
  aria-label="评分"
/>
```

## 尺寸

<div class="h-demo h-demo--stack">
  <h-range v-model="value" size="sm" aria-label="小号" />
  <h-range v-model="value" size="md" aria-label="中号" />
  <h-range v-model="value" size="lg" aria-label="大号" />
</div>

```vue
<h-range v-model="value" size="sm" aria-label="小号" />
<h-range v-model="value" size="md" aria-label="中号" />
<h-range v-model="value" size="lg" aria-label="大号" />
```

## 禁用

<div class="h-demo h-demo--stack">
  <h-range v-model="disabledValue" disabled aria-label="禁用滑块" />
</div>

```vue
<h-range v-model="disabledValue" disabled aria-label="禁用滑块" />
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `number` | `0` | 当前值（v-model） |
| `min` | `number` | `0` | 最小值 |
| `max` | `number` | `100` | 最大值 |
| `step` | `number` | `1` | 步进；`<= 0` 时不对齐步进 |
| `disabled` | `boolean` | `false` | 禁用 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 轨道与 thumb 尺寸 |
| `ariaLabel` | `string` | — | 无可见标签时的可访问名称 |
| `name` | `string` | — | 原生 name |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `number` | 归一化后的数值 |

### Slots

无。

## 行为说明

- 外部传入越界或非步进值时，UI 展示归一化后的值；用户交互后 `emit` 归一化结果。
- 夹取区间为 `[min, max]`（若 `max < min` 则以较大者为上界，progress 视为 0）。
- 已填充轨道由 CSS 自定义属性 `--h-range-progress` 驱动。

## 无障碍

- 原生 `input[type="range"]`，内建 `role="slider"` 与键盘操作（方向键 / Home / End）
- `aria-valuemin` / `aria-valuemax` / `aria-valuenow` 同步
- 无可见标签时请传 `ariaLabel`（组件输出原生 `aria-label`）
- `:focus-visible` 焦点环；`disabled` 不可交互
- 尊重 `prefers-reduced-motion`（关闭 thumb 缩放动效）
