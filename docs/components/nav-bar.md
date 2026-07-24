# NavBar

顶部标题栏。**不**执行路由或 `history.back()`，只抛出左右点击事件。

## 基础（非 fixed）

文档内演示关闭 `fixed` / `safe-area`，避免遮挡文档布局。

<script setup>
import { ref } from 'vue'
import { HNavBar } from 'happier-ui'

const last = ref('尚未点击')
const onLeft = (e) => { last.value = `左侧（${e.type}）` }
const onRight = (e) => { last.value = `右侧（${e.type}）` }
</script>

<div class="h-demo">
  <div class="h-demo__frame">
    <h-nav-bar
      title="播放列表"
      show-back
      :fixed="false"
      :safe-area="false"
      @handle-left-click="onLeft"
      @handle-right-click="onRight"
    >
      <template #right>
        <button type="button" style="border:0;background:transparent;color:var(--h-color-primary);font:inherit;font-weight:600;min-height:48px;padding:0 8px;cursor:pointer">
          保存
        </button>
      </template>
    </h-nav-bar>
  </div>
  <p class="h-demo__hint" style="margin-top: 0.75rem">最近操作：{{ last }}</p>
</div>

```vue
<script setup lang="ts">
import { HNavBar } from 'happier-ui'
</script>

<template>
  <h-nav-bar
    title="播放列表"
    show-back
    @handle-left-click="onBack"
    @handle-right-click="onSave"
  >
    <template #right>
      <button type="button">保存</button>
    </template>
  </h-nav-bar>
</template>
```

## 自定义插槽

<div class="h-demo">
  <div class="h-demo__frame">
    <h-nav-bar
      title="此 prop 会被插槽覆盖"
      show-back
      :fixed="false"
      :safe-area="false"
      @handle-left-click="onLeft"
      @handle-right-click="onRight"
    >
      <template #left>
        <button type="button" style="border:0;background:transparent;color:var(--h-color-primary);font:inherit;font-weight:600;min-height:48px;padding:0 8px;cursor:pointer">
          取消
        </button>
      </template>
      <template #title>
        <h2 style="margin:0;font-size:var(--h-font-title);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          自定义标题插槽
        </h2>
      </template>
      <template #right>
        <button type="button" style="border:0;background:transparent;color:var(--h-color-primary);font:inherit;font-weight:600;min-height:48px;padding:0 8px;cursor:pointer">
          完成
        </button>
      </template>
    </h-nav-bar>
  </div>
</div>

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `title` | `string` | — | 默认标题（可被 `#title` 覆盖） |
| `showBack` | `boolean` | `false` | 显示默认返回按钮 |
| `backAriaLabel` | `string` | `'返回'` | 返回按钮可访问名 |
| `fixed` | `boolean` | `true` | 固定在视口顶部 |
| `safeArea` | `boolean` | `true` | 叠加顶部 safe-area |

### Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `handleLeftClick` | `MouseEvent` | 左侧区点击（含默认返回） |
| `handleRightClick` | `MouseEvent` | 右侧区点击 |

### Slots

| 名称 | 说明 |
|------|------|
| `left` | 覆盖左侧（含返回） |
| `title` | 覆盖标题 |
| `right` | 右侧操作 |

## 无障碍

- 语义 `header`；默认标题为 `h1`
- 返回为原生 button，由 `backAriaLabel` 命名
- fixed / safe-area 默认开；不执行实际导航
