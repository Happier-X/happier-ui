# Empty

空状态占位。`title` 必填；可选描述、图标槽与操作槽。**不提供** compact；高度由宿主外层控制。

## 基础

<script setup>
import { ref } from 'vue'
import { HEmpty, HButton } from 'happier-ui'

const n = ref(0)
</script>

<div class="h-demo">
  <h-empty
    title="暂无内容"
    description="这里还没有任何项目。可添加数据或调整筛选条件。"
  >
    <template #icon>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
        <path d="M3 9h18" stroke="currentColor" stroke-width="1.5" />
      </svg>
    </template>
    <h-button size="sm" @click="n++">添加项目</h-button>
    <h-button size="sm" variant="ghost">了解更多</h-button>
  </h-empty>
</div>

<p v-if="n" class="h-demo__hint">操作点击：{{ n }}</p>

```vue
<script setup lang="ts">
import { HEmpty, HButton } from 'happier-ui'
</script>

<template>
  <h-empty title="暂无内容" description="这里还没有数据。">
    <template #icon>
      <span aria-hidden="true">◎</span>
    </template>
    <h-button size="sm">添加内容</h-button>
  </h-empty>
</template>
```

## 仅标题 + 描述

<div class="h-demo">
  <h-empty title="搜索无结果" description="试试其他关键词。" />
</div>

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `title` | `string` | — | **必填**；主标题 |
| `description` | `string` | — | 辅助说明 |

### Slots

| 名称 | 说明 |
|------|------|
| `icon` | 装饰图标区 |
| `default` | 操作区（按钮等） |

### Emits

无。

## 无障碍

- 语义 `section` + 标题
- 装饰 icon 由宿主提供 `aria-hidden`
- 操作槽内放可交互控件
