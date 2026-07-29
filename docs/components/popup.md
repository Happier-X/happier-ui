# Popup 弹层

通用浮层基础组件。通过 `position` 统摄 **bottom / top / left / right / center / relative / fullscreen** 七种形态，内置滚动锁定（`useScrollLock`）与 `useTeleportTarget`。

`HDialog` 与 `HBottomSheet` 已基于 `HPopup(position=center/bottom)` 重构，原有 API 完全不变。

## 基础 · bottom（底部面板）

<script setup>
import { ref } from 'vue'
import { HButton, HPopup } from 'happier-ui'

const bottom = ref(false)
const center = ref(false)
const left = ref(false)
const relative = ref(false)
const fullscreen = ref(false)
const relTrigger = ref(null)
</script>

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <h-button @click="bottom = true">打开底部弹层</h-button>
    <h-button @click="center = true">打开居中弹层</h-button>
    <h-button @click="left = true">打开左侧弹层</h-button>
  </div>

  <h-popup v-model="bottom" position="bottom" title="底部弹层" :handle="true">
    <p class="h-demo__hint">position="bottom"，自带拖拽手柄（:handle="true"）。</p>
    <h-button size="sm" @click="bottom = false">关闭</h-button>
  </h-popup>

  <h-popup v-model="center" position="center" title="居中弹层">
    <p class="h-demo__hint">position="center"，全屏遮罩居中卡片。</p>
    <template #footer>
      <h-button size="sm" @click="center = false">确认</h-button>
    </template>
  </h-popup>

  <h-popup v-model="left" position="left" title="左侧面板">
    <p class="h-demo__hint">position="left"，面板从左侧滑入。</p>
    <h-button size="sm" @click="left = false">关闭</h-button>
  </h-popup>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HButton, HPopup } from 'happier-ui'

const show = ref(false)
</script>

<template>
  <h-button @click="show = true">打开弹层</h-button>

  <!-- 底部面板 -->
  <h-popup v-model="show" position="bottom" title="底部弹层" :handle="true">
    <p>position="bottom"</p>
    <h-button @click="show = false">关闭</h-button>
  </h-popup>

  <!-- 居中对话框 -->
  <h-popup v-model="show" position="center" title="居中弹层">
    <p>position="center"</p>
    <template #footer>
      <h-button @click="show = false">确认</h-button>
    </template>
  </h-popup>

  <!-- 左侧面板 -->
  <h-popup v-model="show" position="left" title="左侧面板">
    <p>position="left"</p>
    <h-button @click="show = false">关闭</h-button>
  </h-popup>
</template>
```

## relative（相对 trigger 定位）

无遮罩，JS 计算相对触发元素的固定坐标，支持边缘翻转与 `resize`/`scroll` 重算。适用于下拉选择、呼出菜单等。

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <h-button ref="relTrigger" variant="outline" @click="relative = !relative">
      {{ relative ? '关闭弹层' : '打开 relative 弹层' }}
    </h-button>
  </div>

  <h-popup
    v-model="relative"
    position="relative"
    :trigger-ref="relTrigger"
    title="相对弹层"
    closeable
    :close-on-overlay="false"
    :close-on-esc="true"
    radius="sm"
  >
    <p class="h-demo__hint">position="relative" · 无遮罩 · 带 X 按钮（closeable）</p>
    <p class="h-demo__hint" style="margin:0">trigger-ref 为 ref 绑定触发按钮</p>
    <h-button size="sm" style="margin-top: 0.5rem" @click="relative = false">关闭</h-button>
  </h-popup>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HButton, HPopup } from 'happier-ui'

const show = ref(false)
const btn = ref(null)
</script>

<template>
  <h-button ref="btn" @click="show = !show">
    {{ show ? '关闭' : '打开 relative 弹层' }}
  </h-button>

  <h-popup
    v-model="show"
    position="relative"
    :trigger-ref="btn"
    title="相对弹层"
    closeable
    radius="sm"
  >
    <p>相对 trigger 定位，带 X 关闭按钮</p>
    <h-button @click="show = false">关闭</h-button>
  </h-popup>
</template>
```

## fullscreen（全屏 + 下滑关闭）

`position="fullscreen"` 让面板完全覆盖视口：无圆角、无 safe-area 内边距，也不会渲染 `title` / `#title` header。请在 default slot 内自行组织导航栏或标题。

全屏内容可正常纵向滚动；**仅在 `scrollTop === 0` 且向下拖**时接管手势关闭：位移 ≥ 80px 或速度 ≥ 0.3px/ms 即关闭，未达阈值会在 250ms 内回弹。拖动过程中遮罩透明度同步降低，并临时 `touch-action: none` 锁住面板滚动以免手势与内容滚动打架。`handle` 在 fullscreen 无效。`closeable`、Esc 和遮罩点击仍然可用。

<div class="h-demo h-demo--stack">
  <h-button @click="fullscreen = true">打开全屏弹层</h-button>
  <h-popup
    v-model="fullscreen"
    position="fullscreen"
    title="不会渲染的标题"
    aria-label="全屏演示弹层"
    closeable
  >
    <div style="min-height:120vh;padding:24px;background:var(--h-color-surface,#fff)">
      <h2 style="margin:0 0 12px">宿主自管全屏头部</h2>
      <p class="h-demo__hint">滚动到顶部后向下拖动关闭；右上角 X 是备用关闭方式。</p>
      <h-button size="sm" @click="fullscreen = false">关闭</h-button>
    </div>
  </h-popup>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HButton, HPopup } from 'happier-ui'

const show = ref(false)
</script>

<template>
  <h-button @click="show = true">打开全屏弹层</h-button>
  <h-popup
    v-model="show"
    position="fullscreen"
    aria-label="全屏设置"
    closeable
  >
    <div class="fullscreen-page">
      <h2>宿主自管头部</h2>
      <p>向下滑动即可关闭。</p>
    </div>
  </h-popup>
</template>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | 受控显隐（v-model） |
| `position` | `'bottom' \| 'top' \| 'left' \| 'right' \| 'center' \| 'relative' \| 'fullscreen'` | `'bottom'` | 弹层形态与动画；fullscreen 占满视口并支持下滑关闭 |
| `triggerRef` | `HTMLElement \| null` | `null` | relative 定位的触发元素引用（`ref` 传对象） |
| `closeOnOverlay` | `boolean` | `true` | 点击遮罩关闭（relative 无遮罩故无作用） |
| `closeOnEsc` | `boolean` | `true` | Esc 键关闭 |
| `lockScroll` | `boolean` | `true` | 打开时锁定 body 滚动 |
| `title` | `string` | — | 面板标题文本 |
| `ariaLabel` | `string` | — | 无障碍标签（title 为空时生效） |
| `teleport` | `string \| HTMLElement \| false` | `'body'` | Teleport 目标（传 false 就地渲染） |
| `closeable` | `boolean` | `false` | 显示 X 关闭按钮（Lucide X 图标） |
| `closeIconPosition` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'top-right'` | X 按钮位置 |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg'` | — | 面板圆角粒度 |
| `handle` | `boolean` | `false` | position="bottom" 时显示拖拽手柄 |

### Emits

| 名称 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `value: boolean` | v-model 双向绑定 |
| `close` | — | 面板关闭瞬间 |
| `open` | — | 面板打开瞬间 |
| `after-leave` | — | Transition 离场动画结束后 |
| `click-overlay` | — | 点击遮罩瞬间（先于 close 处理） |
| `click-close-icon` | — | 点击 X 关闭按钮瞬间 |

### Slots

| 名称 | 作用域 | 说明 |
|------|--------|------|
| `default` | — | 面板正文内容 |
| `title` | — | 自定义标题（覆盖 prop `title`） |
| `footer` | — | 面板底部操作区 |

## 行为说明

- **滚动锁定**：默认 `lockScroll: true`，打开时通过 `useScrollLock`（引用计数，模块级安全）禁止 body 滚动，关闭自动还原。
- **遮罩**：除 `position="relative"` 外均渲染遮罩层。遮罩点击关闭受 `closeOnOverlay` 控制。
- **Fullscreen 手势**：内容位于顶部时向下拖动；位移 ≥ 80px 或速度 ≥ 0.3px/ms 关闭，未达阈值则回弹。全屏不渲染内置 header，需由 default slot 自管。
- **Esc**：Esc 键触发关闭（`closeOnEsc`）。
- **关闭按钮**：`closeable` 显示 X 图标按钮（Heroicons ×，通过 Lucide `X`）；默认隐藏。
- **Title 无障碍**：`title` prop 无 #title slot 时渲染 VS `ariaLabelledBy`（`HLabel` 不带 `aria-describedby`）。
- **Teleport**：默认 `'body'`。传 `false` 就地渲染。
- **无 before-close**：不做钩子拦截；受控宿主可通过 `v-model` 提前阻止。

<style scoped>
.h-demo__hint {
  font-size: var(--h-font-body-sm, 13px);
  line-height: var(--h-line-height-body, 1.4);
  color: var(--h-color-ink-muted, #6b6b6b);
  margin-bottom: var(--h-space-xs, 8px);
}

.h-popup--radius-sm {
  --h-popup-radius: var(--h-popup-radius-sm, 12px);
}
</style>