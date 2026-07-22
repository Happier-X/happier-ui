# State Management（happier-ui）

## 定位

本库是 **无全局 store 的展示/交互原语**。状态由 **宿主应用** 拥有；组件通过 props 下行、emit 上行。

## 本库内允许的状态

| 类型 | 是否允许 | 例子 |
|------|----------|------|
| 纯 UI 瞬态 | 是 | 可选：内部 hover 不暴露时用 `ref`（当前组件几乎全受控） |
| Props 驱动展示 | 是（主路径） | `playing`、`disabled`、`title` |
| 全局 Pinia / Vuex | **否** | 不进依赖、不建 store |
| 服务端缓存 / 请求 | **否** | 无 API 层 |
| 跨组件事件总线 | **否** | 用 props/emit 或宿主编排 |

## 模式（现状）

```vue
<!-- 宿主 / playground -->
<script setup lang="ts">
import { ref } from 'vue'
import { HSettingRow, HIconButton } from 'happier-ui'

const enabled = ref(true)
const pingCount = ref(0)
</script>

<template>
  <h-setting-row label="示例开关">
    <template #end>
      <input v-model="enabled" type="checkbox" />
    </template>
  </h-setting-row>
  <h-icon-button ariaLabel="示例" @click="pingCount++">…</h-icon-button>
</template>
```

参考：`playground/src/App.vue`。

## 表单与控件

- `HSettingRow` / 未来 `HFormField`：**壳**，不内置 v-model 引擎。
- toggle / input / checkbox 放进 slot，由宿主 `v-model`。
- 库组件若需要受控值，优先 `modelValue` + `update:modelValue`（当前尚未大规模使用；新增时再统一）。

## 反模式

- 在 `happier-ui` 内建播放队列、音源连接状态。
- 组件静默读写 `localStorage` 做业务偏好。
- 为库引入 pinia 作为 peer。
