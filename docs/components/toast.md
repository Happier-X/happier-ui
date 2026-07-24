# Toast

轻提示。短暂、非阻塞的操作反馈。`v-model` 控制显隐；`default | success | warning | danger` 语义；`top | bottom` 位置；`duration` 自动关闭。声明式单条组件，全局命令式调用、队列与堆叠由宿主负责，MVP **无** Portal / Teleport。

## 基础

<script setup>
import { ref } from 'vue'
import { HButton, HToast } from 'happier-ui'

const open = ref(false)
const persist = ref(false)
const topOpen = ref(false)
const closes = ref(0)
const onClose = () => { closes.value++ }
</script>

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <h-button @click="open = true">显示 Toast</h-button>
    <h-button variant="outline" @click="topOpen = true">顶部</h-button>
    <h-button variant="ghost" @click="persist = true">不自动关闭</h-button>
    <h-button size="sm" variant="outline" @click="persist = false">隐藏持续提示</h-button>
  </div>
  <p v-if="closes" class="h-demo__hint">close 次数：{{ closes }}</p>

  <h-toast v-model="open" variant="success" @close="onClose">
    已保存更改
  </h-toast>

  <h-toast v-model="topOpen" position="top" variant="default" @close="onClose">
    顶部提示
  </h-toast>

  <h-toast v-model="persist" variant="warning" :duration="0">
    持续提示：由宿主在外部控制隐藏
  </h-toast>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HButton, HToast } from 'happier-ui'

const open = ref(false)
</script>

<template>
  <h-button @click="open = true">显示 Toast</h-button>
  <h-toast v-model="open" variant="success" @close="onClosed">
    已保存更改
  </h-toast>
</template>
```

## 语义状态

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">四种 <code>variant</code>：default / success / warning / danger（左侧强调条与图标色区分）。</p>
</div>

```vue
<h-toast v-model="a" variant="default">默认提示</h-toast>
<h-toast v-model="b" variant="success">操作成功</h-toast>
<h-toast v-model="c" variant="warning">请注意</h-toast>
<h-toast v-model="d" variant="danger">操作失败</h-toast>
```

## 图标

通过 `#icon` 具名插槽提供前置图标（装饰性，默认 `aria-hidden`）。

```vue
<script setup lang="ts">
import { CheckCircle } from '@lucide/vue'
import { HIcon, HToast } from 'happier-ui'
</script>

<template>
  <h-toast v-model="open" variant="success">
    <template #icon>
      <h-icon :icon="CheckCircle" size="sm" />
    </template>
    已保存更改
  </h-toast>
</template>
```

## 自动关闭

`duration` 默认 `3000` 毫秒；大于 `0` 时在每次由隐藏变为显示后重新计时，到时发出 `update:modelValue(false)` 与 `close`。`duration="0"` 表示不自动关闭，由宿主自行控制。外部隐藏只清理计时器，不重复触发 `close`。

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | 是否显示 |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 语义状态 |
| `position` | `'top' \| 'bottom'` | `'bottom'` | 视口固定位置（含 safe-area） |
| `duration` | `number` | `3000` | 自动关闭毫秒；`0` 表示不自动关闭 |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `boolean` | 显隐状态 |
| `close` | — | 自动关闭时触发 |

### Slots

| 名称 | 说明 |
|------|------|
| `default` | 提示内容 |
| `icon` | 前置图标（装饰性，`aria-hidden`） |

## 无障碍

- `default` / `success`：`role="status"` + `aria-live="polite"`
- `warning` / `danger`：`role="alert"` + `aria-live="assertive"`
- `aria-atomic="true"`；不主动获取焦点，不抢占键盘
- 图标插槽默认 `aria-hidden`
- 尊重 `prefers-reduced-motion`（关闭进场动画）
