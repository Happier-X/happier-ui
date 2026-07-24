# Progress

只读线形进度条。用于展示任务完成度、同步状态或加载中的不确定进度；不接收拖动输入，不发出事件。需要用户选择数值时使用 `HRange`。

## 基础

<script setup>
import { ref } from 'vue'
import { HButton, HProgress } from 'happier-ui'

const value = ref(40)
</script>

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">当前进度：{{ value }}%</p>
  <h-progress :value="value" aria-label="安装进度" />
  <div class="h-demo__row">
    <h-button size="sm" variant="outline" @click="value = Math.max(value - 10, 0)">减少</h-button>
    <h-button size="sm" @click="value = Math.min(value + 10, 100)">增加</h-button>
  </div>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HProgress } from 'happier-ui'

const value = ref(40)
</script>

<template>
  <h-progress :value="value" aria-label="安装进度" />
</template>
```

## 不确定进度

`indeterminate` 用于无法计算完成比例的加载状态。此模式忽略 `value`，省略 `aria-valuenow`，并展示循环动画。

<div class="h-demo h-demo--stack">
  <h-progress indeterminate aria-label="加载中" />
</div>

```vue
<h-progress indeterminate aria-label="加载中" />
```

## 尺寸

`size` 仅影响轨道高度。

<div class="h-demo h-demo--stack">
  <h-progress :value="30" size="sm" aria-label="小进度条" />
  <h-progress :value="55" size="md" aria-label="中进度条" />
  <h-progress :value="80" size="lg" aria-label="大进度条" />
</div>

```vue
<h-progress :value="30" size="sm" aria-label="小进度条" />
<h-progress :value="55" size="md" aria-label="中进度条" />
<h-progress :value="80" size="lg" aria-label="大进度条" />
```

## 语义色与圆角

`variant` 映射到现有语义色 token；`rounded=false` 关闭轨道与填充圆角。

<div class="h-demo h-demo--stack">
  <h-progress :value="25" variant="primary" aria-label="Primary 进度" />
  <h-progress :value="50" variant="success" aria-label="Success 进度" />
  <h-progress :value="75" variant="warning" aria-label="Warning 进度" />
  <h-progress :value="90" variant="danger" :rounded="false" aria-label="Danger 进度" />
</div>

```vue
<h-progress :value="25" variant="primary" aria-label="Primary 进度" />
<h-progress :value="50" variant="success" aria-label="Success 进度" />
<h-progress :value="75" variant="warning" aria-label="Warning 进度" />
<h-progress :value="90" variant="danger" :rounded="false" aria-label="Danger 进度" />
```

## 边界值

`value` 会夹取到 `[0, max]`。`max <= 0` 或非有限数时回退为 `100`；`value` 非有限数时按 `0` 展示。

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">value=140 max=120，展示为 100%</p>
  <h-progress :value="140" :max="120" variant="success" aria-label="同步进度" />
  <p class="h-demo__hint">value=-20，展示为 0%</p>
  <h-progress :value="-20" variant="danger" aria-label="失败恢复进度" />
</div>

```vue
<h-progress :value="140" :max="120" aria-label="同步进度" />
<h-progress :value="-20" aria-label="恢复进度" />
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `value` | `number` | `0` | 当前进度值；确定进度模式生效 |
| `max` | `number` | `100` | 最大值；非法或 `<= 0` 时回退为 `100` |
| `indeterminate` | `boolean` | `false` | 不确定进度模式，忽略 `value` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 轨道高度 |
| `variant` | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | 填充语义色 |
| `rounded` | `boolean` | `true` | 是否使用 pill 圆角 |
| `ariaLabel` | `string` | — | 无可见标签时的可访问名称 |

### Emits

无。

### Slots

无。进度文字、业务标签和操作按钮由宿主在组件外组合。

## 无障碍

- 根节点输出 `role="progressbar"`。
- 确定进度输出 `aria-valuemin="0"`、归一化后的 `aria-valuemax` 与 `aria-valuenow`。
- 不确定进度保留 `aria-valuemin` / `aria-valuemax`，省略 `aria-valuenow`。
- 无可见标签时请传 `ariaLabel`（组件输出原生 `aria-label`）。
- 组件不聚焦、不响应键盘；它是状态指示，不是输入控件。
- 尊重 `prefers-reduced-motion`：关闭不确定进度循环动画，改为静态居中填充段。

## Token

| Token | 默认 | 说明 |
|-------|------|------|
| `--h-progress-height-sm` | `4px` | 小号轨道高度 |
| `--h-progress-height-md` | `6px` | 中号轨道高度 |
| `--h-progress-height-lg` | `8px` | 大号轨道高度 |
| `--h-progress-track-bg` | `var(--h-color-surface-secondary)` | 轨道背景 |
| `--h-progress-fill` | `var(--h-color-primary)` | 默认填充色；variant 会局部覆盖 |
| `--h-progress-transition-duration` | `200ms` | 确定进度宽度过渡时长 |
| `--h-progress-indeterminate-duration` | `1.4s` | 不确定进度循环动画时长 |
