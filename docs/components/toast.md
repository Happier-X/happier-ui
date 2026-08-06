# Toast

轻提示。深色 HUD / iOS 原生 toast 风格：深色半透明圆角卡片、默认屏幕居中、内置语义图标。`v-model` 控制显隐；`default | success | warning | danger` 语义；`center | top | bottom` 位置；`duration` 自动关闭。声明式单条组件，全局命令式调用、队列与堆叠由宿主负责。默认 `teleport` 到 `body`。无遮罩层，完全非阻塞。

## 基础

<script setup>
import { ref } from 'vue'
import { HButton, HToast } from 'happier-ui'

const open = ref(false)
const persist = ref(false)
const topOpen = ref(false)
const bottomOpen = ref(false)
const textOnly = ref(false)
const closes = ref(0)
const onClose = () => { closes.value++ }
</script>

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <h-button @click="open = true">显示 Toast（居中）</h-button>
    <h-button variant="outline" @click="topOpen = true">顶部</h-button>
    <h-button variant="secondary" @click="bottomOpen = true">底部</h-button>
    <h-button variant="ghost" @click="textOnly = true">纯文字</h-button>
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

  <h-toast v-model="bottomOpen" position="bottom" variant="success" @close="onClose">
    底部提示
  </h-toast>

  <h-toast v-model="textOnly" :icon="false" @close="onClose">
    纯文字 toast
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

四种 `variant` 卡片观感一致为深色 HUD；success / warning / danger 默认显示内置语义图标（✓ / ! / ✕，浅色系），default 无内置图标。

```vue
<h-toast v-model="a" variant="default">默认提示</h-toast>
<h-toast v-model="b" variant="success">操作成功</h-toast>
<h-toast v-model="c" variant="warning">请注意</h-toast>
<h-toast v-model="d" variant="danger">操作失败</h-toast>
```

## 图标

- success / warning / danger 默认显示内置 Unicode 图标（✓ / ! / ✕）
- `#icon` 具名插槽可覆盖内置图标（插槽优先）
- `:icon="false"` 时整个图标区（含插槽）不渲染，用于纯文字 toast
- 图标装饰性，默认 `aria-hidden`

```vue
<script setup lang="ts">
import { CheckCircle } from '@lucide/vue'
import { HIcon, HToast } from 'happier-ui'
</script>

<template>
  <!-- 内置图标（success → ✓） -->
  <h-toast v-model="a" variant="success">已保存</h-toast>

  <!-- 插槽覆盖内置图标 -->
  <h-toast v-model="b" variant="success">
    <template #icon>
      <h-icon :icon="CheckCircle" size="sm" />
    </template>
    已保存更改
  </h-toast>

  <!-- 纯文字 -->
  <h-toast v-model="c" :icon="false">纯文字提示</h-toast>
</template>
```

## 位置

默认 `center`（屏幕居中）；可选 `top` / `bottom`（含 safe-area 偏移）保持向后兼容。

```vue
<h-toast v-model="a">居中（默认）</h-toast>
<h-toast v-model="b" position="top">顶部</h-toast>
<h-toast v-model="c" position="bottom">底部</h-toast>
```

## 自动关闭

`duration` 默认 `3000` 毫秒；大于 `0` 时在每次由隐藏变为显示后重新计时，到时发出 `update:modelValue(false)` 与 `close`。`duration="0"` 表示不自动关闭，由宿主自行控制。外部隐藏只清理计时器，不重复触发 `close`。

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | 是否显示 |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 语义状态；success/warning/danger 默认带内置图标 |
| `position` | `'center' \| 'top' \| 'bottom'` | `'center'` | 视口固定位置（top/bottom 含 safe-area） |
| `duration` | `number` | `3000` | 自动关闭毫秒；`0` 表示不自动关闭 |
| `icon` | `boolean` | `true` | 是否显示图标区；`false` 时隐藏内置图标与 `#icon` 插槽 |
| `teleport` | `string \| HTMLElement \| false` | `'body'` | 挂载目标；`false` 或无效目标/SSR 时原地渲染，用于逃离带 transform/contain 祖先的 fixed 包含块偏移 |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `boolean` | 显隐状态 |
| `close` | — | 自动关闭时触发 |

### Slots

| 名称 | 说明 |
|------|------|
| `default` | 提示内容 |
| `icon` | 前置图标（优先于内置图标；装饰性，`aria-hidden`） |

## 无障碍

- `default` / `success`：`role="status"` + `aria-live="polite"`
- `warning` / `danger`：`role="alert"` + `aria-live="assertive"`
- `aria-atomic="true"`；不主动获取焦点，不抢占键盘
- 内置图标与 `#icon` 插槽默认 `aria-hidden`
- 尊重 `prefers-reduced-motion`（关闭进场动画）
- 无遮罩层，点击穿透，完全非阻塞

## 破坏性变更（相对旧版）

- `position` 默认值由 `bottom` 改为 `center`
- 视觉由浅色卡片 + 左侧语义竖条改为深色 HUD；旧 token `--h-toast-accent` 已移除，请改用 `--h-toast-icon-*` / `--h-toast-bg` 等新 token
