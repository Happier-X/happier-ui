# Dialog

居中对话框。`v-model`；遮罩 / Esc 关闭；title / description / default / actions。MVP **无** Portal / focus trap。

## 基础

<script setup>
import { ref } from 'vue'
import { HButton, HDialog } from 'happier-ui'

const open = ref(false)
const noOverlay = ref(false)
const closes = ref(0)
const onClose = () => { closes.value++ }
</script>

<div class="h-demo h-demo--stack">
  <div class="h-demo--row">
    <h-button @click="open = true">打开对话框</h-button>
    <h-button variant="outline" @click="noOverlay = true">打开（遮罩不关）</h-button>
  </div>
  <p v-if="closes" class="h-demo__hint">close 次数：{{ closes }}</p>

  <h-dialog
    v-model="open"
    title="确认操作"
    description="这是居中 Dialog 示例。遮罩或 Esc 可关闭。"
    @close="onClose"
  >
    <p class="h-demo__hint">也可在内容区放自定义正文。</p>
    <template #actions>
      <h-button size="sm" variant="ghost" @click="open = false">取消</h-button>
      <h-button size="sm" @click="open = false">确认</h-button>
    </template>
  </h-dialog>

  <h-dialog
    v-model="noOverlay"
    :close-on-overlay="false"
    title="遮罩不关闭"
    description="请用 Esc 或按钮关闭。"
    @close="onClose"
  >
    <template #actions>
      <h-button size="sm" @click="noOverlay = false">关闭</h-button>
    </template>
  </h-dialog>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HButton, HDialog } from 'happier-ui'

const open = ref(false)
</script>

<template>
  <h-button @click="open = true">打开对话框</h-button>
  <h-dialog
    v-model="open"
    title="确认操作"
    description="遮罩或 Esc 可关闭。"
    @close="onClosed"
  >
    <template #actions>
      <h-button size="sm" variant="ghost" @click="open = false">取消</h-button>
      <h-button size="sm" @click="open = false">确认</h-button>
    </template>
  </h-dialog>
</template>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | 是否打开 |
| `closeOnOverlay` | `boolean` | `true` | 点击遮罩关闭 |
| `closeOnEsc` | `boolean` | `true` | Esc 关闭 |
| `title` | `string` | — | 标题（可被 `#title` 覆盖） |
| `description` | `string` | — | 描述（可被 `#description` 覆盖） |
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
| `description` | 自定义描述 |
| `default` | 正文 |
| `actions` | 底部操作区 |

## 无障碍

- `role="dialog"` + `aria-modal`
- title/description 关联或 `ariaLabel`
- Esc 可关闭（`closeOnEsc`）
