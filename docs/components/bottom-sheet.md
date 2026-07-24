# BottomSheet

底部面板。`v-model`；遮罩关闭、Esc、标题/内容槽。MVP **无** 拖拽 / snap / Teleport / focus trap。

## 基础

<script setup>
import { ref } from 'vue'
import { HButton, HBottomSheet } from 'happier-ui'

const open = ref(false)
const noOverlay = ref(false)
const closes = ref(0)
const onClose = () => { closes.value++ }
</script>

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <h-button @click="open = true">打开底部面板</h-button>
    <h-button variant="outline" @click="noOverlay = true">打开（遮罩不关）</h-button>
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
