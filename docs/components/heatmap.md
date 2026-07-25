# Heatmap

GitHub 贡献图风格的日历热力图。把「按日期的数值序列」渲染成「7 行星期 × N 列周」的方格网格，用颜色深浅表达当日数值大小。适合展示活跃度、提交数、打卡等随时间分布的计数。

## 基础

传入 `data`（`{ timestamp, value }[]`）即可。时间范围由数据的最早/最晚时间戳推断，缺失的日期渲染为最浅底色。

<script setup>
import { ref } from 'vue'
import { HButton, HHeatmap } from 'happier-ui'

// 造一段近一年的样例数据
function makeYearData(seed = 1) {
  const out = []
  const today = Date.now()
  const day = 24 * 60 * 60 * 1000
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < 365; i++) {
    const ts = today - i * day
    const r = rand()
    // 约 40% 的天数无数据（value 0）
    const value = r < 0.4 ? 0 : Math.ceil(r * 12)
    out.push({ timestamp: ts, value })
  }
  return out
}

const data = makeYearData(7)
const loading = ref(false)
const customColors = ['#9be9a8', '#40c463', '#30a14e', '#216e39']
</script>

<div class="h-demo h-demo--stack">
  <h-heatmap :data="data" />
</div>

```vue
<script setup lang="ts">
import { HHeatmap } from 'happier-ui'
import type { HHeatmapData } from 'happier-ui'

const data: HHeatmapData = [
  { timestamp: Date.now(), value: 5 },
  { timestamp: Date.now() - 86400000, value: 2 },
  // …
]
</script>

<template>
  <h-heatmap :data="data" />
</template>
```

## 尺寸

`size` 控制格子边长（`small` / `medium` / `large`）。

<div class="h-demo h-demo--stack">
  <h-heatmap :data="data" size="small" />
  <h-heatmap :data="data" size="medium" />
  <h-heatmap :data="data" size="large" />
</div>

```vue
<h-heatmap :data="data" size="small" />
<h-heatmap :data="data" size="medium" />
<h-heatmap :data="data" size="large" />
```

## 周首

`firstDayOfWeek` 决定网格首行是星期几（0=周日，1=周一，……）。改变它会同时影响周首对齐与左侧星期标签。

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">周一起始</p>
  <h-heatmap :data="data" :first-day-of-week="1" />
</div>

```vue
<h-heatmap :data="data" :first-day-of-week="1" />
```

## 自定义色阶

`colors` 覆盖默认的主色蓝阶梯。数组按档位从浅到深映射（level 1..4）；空日 / 0 值始终用最浅底色。下例用经典的 GitHub 绿。

<div class="h-demo h-demo--stack">
  <h-heatmap :data="data" :colors="customColors" />
</div>

```vue
<script setup lang="ts">
const colors = ['#9be9a8', '#40c463', '#30a14e', '#216e39']
</script>

<template>
  <h-heatmap :data="data" :colors="colors" />
</template>
```

## 隐藏标签与图例

`showWeekLabels` / `showMonthLabels` / `showColorIndicator` 分别控制左侧星期标签、顶部月份标签、底部 Less→More 图例。

<div class="h-demo h-demo--stack">
  <h-heatmap
    :data="data"
    :show-week-labels="false"
    :show-month-labels="false"
    :show-color-indicator="false"
  />
</div>

```vue
<h-heatmap
  :data="data"
  :show-week-labels="false"
  :show-month-labels="false"
  :show-color-indicator="false"
/>
```

## 加载态

`loading` 展示占位网格（不渲染真实数据）。

<div class="h-demo h-demo--stack">
  <div class="h-demo__row">
    <h-button size="sm" @click="loading = !loading">切换 loading（当前：{{ loading }}）</h-button>
  </div>
  <h-heatmap :data="data" :loading="loading" />
</div>

```vue
<h-heatmap :data="data" :loading="loading" />
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `data` | `HHeatmapData` | `[]` | 按日聚合的数值序列；同一天多条按 `value` 求和 |
| `firstDayOfWeek` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | 周首（0=周日）；决定首行星期与周首对齐 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 格子边长档 |
| `colors` | `string[]` | — | 覆盖默认蓝阶梯；按 level 1..4 从浅到深映射 |
| `showWeekLabels` | `boolean` | `true` | 左侧星期标签（隔行显示） |
| `showMonthLabels` | `boolean` | `true` | 顶部月份标签 |
| `showColorIndicator` | `boolean` | `true` | 底部 Less→More 图例 |
| `loading` | `boolean` | `false` | 加载占位网格 |

### 类型

```ts
interface HHeatmapItem {
  timestamp: number      // 毫秒时间戳
  value?: number | null
}
type HHeatmapData = HHeatmapItem[]
```

### Emits

无。

### Slots

无。tooltip 用原生 `title` 属性（每格显示「日期 · 数值」）。

## 无障碍

- 根节点输出 `role="img"` + `aria-label`（概述数据时间范围，如「2025-01-01 到 2025-12-31 的活跃度热力图」）。
- 每格输出原生 `title`，hover 显示「日期 · 数值」，无值日显示「无数据」。
- 组件不聚焦、不响应键盘；它是数据展示，不是交互控件。

## Token

| Token | 默认 | 说明 |
|-------|------|------|
| `--h-heatmap-cell-sm` | `10px` | 小号格子边长 |
| `--h-heatmap-cell-md` | `12px` | 中号格子边长 |
| `--h-heatmap-cell-lg` | `15px` | 大号格子边长 |
| `--h-heatmap-gap` | `3px` | 格子间距 |
| `--h-heatmap-radius` | `2px` | 格子圆角 |
| `--h-heatmap-empty` | `var(--h-color-surface-secondary)` | 空日 / 0 值底色 |
| `--h-heatmap-level-1` | `rgba(var(--h-color-primary-rgb), 0.25)` | 档位 1 |
| `--h-heatmap-level-2` | `rgba(var(--h-color-primary-rgb), 0.45)` | 档位 2 |
| `--h-heatmap-level-3` | `rgba(var(--h-color-primary-rgb), 0.7)` | 档位 3 |
| `--h-heatmap-level-4` | `rgba(var(--h-color-primary-rgb), 1)` | 档位 4 |
