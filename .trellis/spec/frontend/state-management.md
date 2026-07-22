# State Management（happier-ui）

## 定位

本库是 **无全局 store 的展示/交互原语**。状态由 **宿主应用** 拥有；组件通过 props 下行、emit 上行。

## 本库内允许的状态

| 类型 | 是否允许 | 例子 |
|------|----------|------|
| 纯 UI 瞬态 | 是 | 可选内部 hover 等不暴露的 `ref` |
| Props 驱动展示 | 是（主路径） | `disabled`、`variant`、`size` |
| 全局 Pinia / Vuex | **否** | 不进依赖、不建 store |
| 服务端缓存 / 请求 | **否** | 无 API 层 |
| 跨组件事件总线 | **否** | 用 props/emit 或宿主编排 |

## 模式（现状）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HButton } from 'happier-ui'

const clicks = ref(0)
</script>

<template>
  <h-button @click="clicks++">点击</h-button>
</template>
```

参考：`playground/src/App.vue`。

## 表单与控件

- 未来 `HFormField` 等若加入：优先 **壳 + slot**，不内置业务 v-model 引擎。
- 库组件若需要受控值，优先 `modelValue` + `update:modelValue`。

## 反模式

- 在 `happier-ui` 内建播放队列、音源连接状态。
- 组件静默读写 `localStorage` 做业务偏好。
- 为库引入 pinia 作为 peer。
