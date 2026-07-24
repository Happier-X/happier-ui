# TabBar

底部导航。`v-model` 为当前 `item.key`；内部用 `HIcon` 渲染图标。**不**内置路由。

文档内演示关闭 `fixed` / `safe-area`，避免遮挡文档页脚。

## 基础

<script setup>
import { ref } from 'vue'
import { Home, Search, Library, User } from '@lucide/vue'
import { HTabBar } from 'happier-ui'

const tab = ref('home')
const items = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'search', label: '搜索', icon: Search },
  { key: 'library', label: '曲库', icon: Library },
  { key: 'me', label: '我的', icon: User },
]
</script>

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">当前 key：{{ tab }}</p>
  <div class="h-demo__frame">
    <h-tab-bar
      v-model="tab"
      :items="items"
      :fixed="false"
      :safe-area="false"
    />
  </div>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Home, Search, User } from '@lucide/vue'
import { HTabBar } from 'happier-ui'
import type { HTabBarItem } from 'happier-ui'

const tab = ref('home')
const items: HTabBarItem[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'search', label: '搜索', icon: Search },
  { key: 'me', label: '我的', icon: User },
]
</script>

<template>
  <h-tab-bar v-model="tab" :items="items" />
</template>
```

`fixed` 与 `safeArea` 默认均为 `true`，可独立关闭。

## API

### Types

```ts
type HTabBarItem = {
  key: string
  label?: string
  icon?: Component
  disabled?: boolean
}
```

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `string` | — | 当前选中 key |
| `items` | `HTabBarItem[]` | — | **必填**；导航项 |
| `ariaLabel` | `string` | `'主导航'` | nav 可访问名 |
| `fixed` | `boolean` | `true` | 固定在视口底部 |
| `safeArea` | `boolean` | `true` | 底部安全区 |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `string` | 选中 key 变化 |

### Slots

无。

## 无障碍

- `nav` + `aria-label`
- 项为 button；选中 `aria-current="page"`
- fixed / safe-area 默认开
