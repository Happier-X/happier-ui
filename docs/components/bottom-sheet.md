# BottomSheet

底部面板。`v-model`；遮罩关闭、Esc、标题/内容槽。默认 `teleport` 到 `body`。MVP **无** 拖拽 / snap / focus trap。

## 宽度行为

- **默认全宽（edge-to-edge）**：面板贴底通栏，`--h-bottom-sheet-max-width` 默认 `100%`；手机竖屏与宽屏预览均为通栏，无两侧遮罩露出。
- **桌面居中卡片感**：宽屏想限宽时传 `max-width`（如 `:max-width="640"`，number 按 px），或全局覆盖 token `--h-bottom-sheet-max-width`；限宽后面板仍水平居中。

## 基础

<script setup>
import { ref } from 'vue'
import { HButton, HBottomSheet } from 'happier-ui'

const open = ref(false)
const noOverlay = ref(false)
const limited = ref(false)
const closes = ref(0)
const onClose = () => { closes.value++ }
</script>

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <h-button @click="open = true">打开底部面板</h-button>
    <h-button variant="outline" @click="limited = true">打开（限宽 640px）</h-button>
    <h-button variant="ghost" @click="noOverlay = true">打开（遮罩不关）</h-button>
  </div>
  <p v-if="closes" class="h-demo__hint">close 次数：{{ closes }}</p>

  <h-bottom-sheet v-model="open" title="示例底部面板" @close="onClose">
    <p class="h-demo__hint">遮罩点击或 Esc 可关闭。内容区可放表单、操作按钮等。</p>
    <div class="h-demo--row" style="margin-top: 0.75rem">
      <h-button size="sm" @click="open = false">完成</h-button>
      <h-button size="sm" variant="ghost" @click="open = false">取消</h-button>
    </div>
  </h-bottom-sheet>

  <h-bottom-sheet
    v-model="limited"
    title="限宽 640px"
    :max-width="640"
    @close="onClose"
  >
    <p class="h-demo__hint">宽屏下 `max-width="640"` 使面板居中最宽 640px（桌面卡片感）；不传则通栏。</p>
    <div class="h-demo--row" style="margin-top: 0.75rem">
      <h-button size="sm" @click="limited = false">完成</h-button>
    </div>
  </h-bottom-sheet>

  <h-bottom-sheet
    v-model="noOverlay"
    :close-on-overlay="false"
    title="遮罩不关闭"
    @close="onClose"
  >
    <p class="h-demo__hint">点击遮罩不会关闭；请用 Esc 或下方按钮。</p>
    <h-button size="sm" style="margin-top: 0.75rem" @click="noOverlay = false">关闭</h-button>
  </h-bottom-sheet>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HButton, HBottomSheet } from 'happier-ui'

const open = ref(false)
</script>

<template>
  <h-button @click="open = true">打开底部面板</h-button>
  <h-bottom-sheet v-model="open" title="示例底部面板" @close="onClosed">
    <p>内容…</p>
    <h-button size="sm" @click="open = false">完成</h-button>
  </h-bottom-sheet>
</template>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | 是否打开 |
| `closeOnOverlay` | `boolean` | `true` | 点击遮罩关闭 |
| `showHandle` | `boolean` | `true` | 顶部拖拽指示条（视觉） |
| `title` | `string` | — | 标题（可被 `#title` 覆盖） |
| `ariaLabel` | `string` | — | 无标题时的 dialog 名称 |
| `teleport` | `string \| HTMLElement \| false` | `'body'` | 挂载目标；`false` 或无效目标/SSR 时原地渲染，用于逃离带 transform/contain 祖先的 fixed 包含块偏移 |
| `maxWidth` | `string \| number` | — | 面板最大宽度；number 按 px，string 原样（`'640px'` / `'none'` / `'100%'`）。不传默认全宽（edge-to-edge）；宽屏想保留桌面居中卡片感时传此值（如 `:max-width="640"`），或全局覆盖 `--h-bottom-sheet-max-width` |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `boolean` | 开闭状态 |
| `close` | — | 请求关闭时触发 |

### Slots

| 名称 | 说明 |
|------|------|
| `title` | 自定义标题 |
| `default` | 面板正文 |

## 无障碍

- `role="dialog"` + `aria-modal`
- 标题关联或 `ariaLabel`
- Esc 可关闭
