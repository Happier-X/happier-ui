# Sidebar

常驻式左侧边栏导航。占据文档流一列宽度（非浮层 Drawer），`items + v-model` 驱动选中；`v-model:collapsed` 控制折叠。内部用 `HIcon` 渲染图标，内置折叠按钮复用 `HIconButton`。**不**内置路由。

## 基础

<script setup>
import { ref } from 'vue'
import { Home, Search, Library, Bell, User } from '@lucide/vue'
import { HSidebar, HIconButton } from 'happier-ui'

const active = ref('home')
const collapsed = ref(false)
const items = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'search', label: '搜索', icon: Search },
  { key: 'library', label: '曲库', icon: Library },
  { key: 'settings', label: '设置', icon: Bell, disabled: true },
]
</script>

<div class="h-demo h-demo--stack">
  <p class="h-demo__hint">当前 key：{{ active }}；{{ collapsed ? '已折叠' : '展开' }}</p>
  <div style="display:flex;height:320px;overflow:hidden;border:1px solid var(--h-color-border-subtle);border-radius:var(--h-radius-md);">
    <h-sidebar v-model="active" v-model:collapsed="collapsed" :items="items">
      <template #header>
        <strong style="font-size:var(--h-font-title);">happier</strong>
      </template>
      <template #footer>
        <h-icon-button :icon="User" ariaLabel="账户" variant="ghost" />
      </template>
    </h-sidebar>
    <div style="flex:1 1 auto;min-width:0;padding:var(--h-space-lg);">
      <p>主内容区：侧栏为常驻列，不遮挡此区域。</p>
    </div>
  </div>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Home, Search, Library } from '@lucide/vue'
import { HSidebar } from 'happier-ui'
import type { HSidebarItem } from 'happier-ui'

const active = ref('home')
const collapsed = ref(false)
const items: HSidebarItem[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'search', label: '搜索', icon: Search },
  { key: 'library', label: '曲库', icon: Library },
]
</script>

<template>
  <h-sidebar
    v-model="active"
    v-model:collapsed="collapsed"
    :items="items"
  />
</template>
```

## 折叠

`v-model:collapsed` 控制展开/折叠。折叠后侧栏缩窄，导航项仅视觉显示图标，label 视觉隐藏但仍通过 `label` 或 `ariaLabel` 提供可访问名。`showCollapseToggle` 默认 `true`，在 footer 区域内置一个折叠按钮；也可由宿主外部改写 `collapsed`。

```vue
<h-sidebar v-model="active" v-model:collapsed="collapsed" :items="items" />

<!-- 关闭内置折叠按钮，完全由宿主控制 -->
<h-sidebar
  v-model="active"
  :collapsed="collapsed"
  :items="items"
  :show-collapse-toggle="false"
/>
```

折叠态下建议为无可见 label 的项提供 `ariaLabel`；有 `label` 时组件会用 `label` 兜底可访问名。

## Header / Footer

`#header` 承载品牌区或标题，`#footer` 承载底部操作区（内置折叠按钮位于 footer 内）。

```vue
<h-sidebar v-model="active" :items="items">
  <template #header>
    <strong>happier</strong>
  </template>
  <template #footer>
    <h-icon-button :icon="User" ariaLabel="账户" variant="ghost" />
  </template>
</h-sidebar>
```

## 无可见 label 的项

导航项省略 `label` 时必须提供 `ariaLabel`，否则纯图标项缺少可访问名。

```vue
<script setup lang="ts">
import { Home, Search } from '@lucide/vue'
import type { HSidebarItem } from 'happier-ui'

const items: HSidebarItem[] = [
  { key: 'home', icon: Home, ariaLabel: '首页' },
  { key: 'search', icon: Search, ariaLabel: '搜索' },
]
</script>
```

## API

### Types

```ts
type HSidebarItem = {
  key: string
  label?: string
  icon?: Component
  disabled?: boolean
  /** 无可见 label（或折叠态）时的可访问名 */
  ariaLabel?: string
}
```

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `items` | `HSidebarItem[]` | — | **必填**；导航项 |
| `modelValue` | `string` | — | 当前选中 key |
| `collapsed` | `boolean` | `false` | 折叠态（`v-model:collapsed`） |
| `showCollapseToggle` | `boolean` | `true` | 是否显示内置折叠按钮 |
| `ariaLabel` | `string` | `'侧边导航'` | 根 `nav` 可访问名 |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `string` | 选中 key 变化（disabled 项不触发） |
| `update:collapsed` | `boolean` | 折叠态变化（内置折叠按钮触发） |

### Slots

| 名称 | 说明 |
|------|------|
| `header` | 顶部品牌/标题区 |
| `footer` | 底部操作区（内置折叠按钮位于其中） |

## 无障碍

- 根 `nav` + `aria-label`
- 导航项为原生 `button`；当前项 `aria-current="page"`；`disabled` 用原生 `disabled`
- 折叠态下 label 视觉隐藏，button 输出 `aria-label`（`ariaLabel` 优先，回退 `label`）保留可访问名
- 图标装饰性 `aria-hidden`
- 导航项触控热区 ≥ `--h-touch-target`（48px）；保留 `:focus-visible` 焦点环
- 尊重 `prefers-reduced-motion`（关闭折叠过渡）
