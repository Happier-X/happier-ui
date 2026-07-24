# Cell

`HCell` 与 `HCellGroup` 用于设置页、菜单列表和相关信息分组。分组提供 Surface、圆角与相邻行分隔线；Cell 提供稳定的前缀、标题/说明、后缀和导航指示结构。

## 基础

<script setup>
import { ref } from 'vue'
import { Bell, Languages } from '@lucide/vue'
import { HCell, HCellGroup, HIcon, HSwitch } from 'happier-ui'

const notifications = ref(true)
const lastAction = ref('')
</script>

<div class="h-demo h-demo--stack">
  <h-cell-group title="通用">
    <h-cell
      title="语言"
      description="用于界面与内容显示"
      clickable
      @click="lastAction = '语言'"
    >
      <template #prefix><h-icon :icon="Languages" /></template>
      <template #suffix>简体中文</template>
    </h-cell>
    <h-cell title="通知" description="允许重要提醒">
      <template #prefix><h-icon :icon="Bell" /></template>
      <template #suffix>
        <h-switch v-model="notifications" ariaLabel="允许通知" />
      </template>
    </h-cell>
    <h-cell title="应用版本" description="稳定版">
      <template #suffix>0.0.2</template>
    </h-cell>
  </h-cell-group>
  <p v-if="lastAction" class="h-demo__hint">最近激活：{{ lastAction }}</p>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Languages } from '@lucide/vue'
import { HCell, HCellGroup, HIcon, HSwitch } from 'happier-ui'

const notifications = ref(true)
</script>

<template>
  <h-cell-group title="通用">
    <h-cell title="语言" description="用于界面与内容显示" clickable>
      <template #prefix><h-icon :icon="Languages" /></template>
      <template #suffix>简体中文</template>
    </h-cell>
    <h-cell title="通知">
      <template #suffix>
        <h-switch v-model="notifications" ariaLabel="允许通知" />
      </template>
    </h-cell>
  </h-cell-group>
</template>
```

`clickable` 行默认显示 chevron。静态值、Chip 等可以放进 clickable 行的 `suffix`。`HSwitch`、`HCheckbox`、button 等可交互控件只能放在非 clickable Cell 中，由控件自身处理焦点与激活，避免嵌套交互与重复事件。

## Flat 分组

<div class="h-demo h-demo--stack">
  <h-cell-group :inset="false">
    <h-cell title="存储空间" description="已使用 1.2 GB" />
    <h-cell title="关于" clickable :show-chevron="false" />
    <h-cell title="装饰导航指示" show-chevron />
  </h-cell-group>
</div>

```vue
<h-cell-group :inset="false">
  <h-cell title="存储空间" description="已使用 1.2 GB" />
  <h-cell title="关于" clickable :show-chevron="false" />
</h-cell-group>
```

为了自动绘制分隔线，`HCell` 必须是 `HCellGroup` default slot 的直接子元素。分隔线只出现在相邻 Cell 之间，最后一行不显示。

## HCell API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `title` | `string` | 必填 | 主标题 |
| `description` | `string` | — | 标题下方的次要说明 |
| `clickable` | `boolean` | `false` | 启用整行点击与键盘激活 |
| `showChevron` | `boolean` | 跟随 `clickable` | 控制后缀之后的导航指示 |
| `ariaLabel` | `string` | — | 覆盖可见文本形成的可访问名称 |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `click` | `MouseEvent \| KeyboardEvent` | 仅 `clickable=true` 时由点击、Enter 或 Space 触发 |

### Slots

| 名称 | 说明 |
|------|------|
| `prefix` | 图标、头像等前缀内容 |
| `suffix` | 静态值、Chip 或独立控件；chevron 始终位于其后 |

不提供 default 内容槽；标题与说明由 props 保持结构稳定。

## HCellGroup API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `title` | `string` | — | 默认分组标题 |
| `inset` | `boolean` | `true` | 圆角 Surface；`false` 为全宽 flat 分组 |

### Slots

| 名称 | 说明 |
|------|------|
| `header` | 覆盖默认标题；自定义内容自行提供所需标题语义 |
| `default` | 直接放置 `HCell` |

### Emits

无。

## 无障碍

- clickable Cell 输出 `role="button"`、`tabindex="0"`，支持 Enter / Space，并提供 `:focus-visible` 焦点环。
- 非 clickable Cell 不输出 button role/tabindex，也不响应整行点击或键盘激活。
- chevron 是装饰元素并设置 `aria-hidden="true"`。
- 有默认 `title` 的 Group 使用 `section`，并通过稳定 id 建立 `aria-labelledby`。自定义 `header` 时不猜测内部 id。
- 不要在 clickable Cell 内放置开关、复选框或 button 等交互控件。
