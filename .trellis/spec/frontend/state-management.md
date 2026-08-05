# State Management（happier-ui）

## 定位

本库是 **无全局 store 的展示/交互原语**。状态由 **宿主应用** 拥有；组件通过 props 下行、emit 上行。

## 本库内允许的状态

| 类型 | 是否允许 | 例子 |
|------|----------|------|
| 纯 UI 瞬态 | 是 | 可选内部 hover 等不暴露的 `ref`（**唯一响应式原语，禁止 `reactive`**） |
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

## Pattern：非受控优先、受控可覆盖（含运行期计算初值）

**Problem**：像 `HFloatingBubble` 这类需要在挂载后依据视口/元素尺寸计算初始状态（默认右下角 offset）的组件，既要能受控（`v-model:offset`），又要在未受控时给出合理默认值。

**Solution**：

- 内部持有权威 `state` ref；不直接把 `props.offset` 当渲染源，避免受控回环。
- `onMounted` 计算初值：`props.offset ? clamp(props.offset) : 计算默认值`；初值就绪前用 `visibility:hidden` 防止 (0,0) 闪跳。
- `watch(() => props.offset)` 同步外部更新，但 **值相等短路**（`clamp` 后与当前 `state` 比较），只有不同才写入并 emit，防止 `update:x` → 父回写 → watch → 再 emit 的死循环。
- 语义约定：`offset = null`（或 undefined）表示 **恢复内部默认值**，watch 收到 null 时应重算默认而非忽略。

**Example**：

```ts
watch(() => props.offset, (value) => {
  if (!initialized.value) return
  // null / undefined → 回到运行期默认（右下角）
  commit(value ? value : defaultOffset(), false)
}, { deep: true })

// commit 内部：clamp 后与 state 相等则直接 return（防回环）
const commit = (next, notify) => {
  const clamped = clampOffset(next)
  if (sameOffset(clamped, state.value)) return
  state.value = clamped
  if (notify) { emit('update:offset', { ...clamped }); emit('offset-change', { ...clamped }) }
}
```

参考：`src/components/HFloatingBubble.vue`。

## Pattern：Teleport 目标运行期解析（SSR 安全）

**Problem**：需要脱离祖先 `transform`/`contain`/`overflow` 的浮层（Toast / Dialog / BottomSheet / FloatingBubble）要 `Teleport` 到 `body`，但字符串选择器解析、`document` 访问在 SSR/无 DOM 时会报错。

**Solution**：

- 统一走 `src/composables/useTeleportTarget.ts`：解析推迟到 `onMounted`；`to` / `disabled` 两个 computed 直接绑 `<Teleport>`。
- `teleport === false`、`typeof document === 'undefined'`（SSR）、选择器未命中 → `disabled`，原地渲染，不阻塞显示；`teleport` 变化时 `watch` 重解析。
- 组件视觉全部走全局 `happier-ui/styles`，无 scoped 依赖，teleport 后样式仍生效。

参考：`src/composables/useTeleportTarget.ts`；消费方 `HToast` / `HDialog` / `HBottomSheet` / `HFloatingBubble`。

## Pattern：Pointer 拖拽后抑制误触 click

**Problem**：可拖拽的原生 `<button>` 在拖拽结束时会派发 `click`，导致误触业务回调。

**Solution**：`pointermove` 中记录位移，超过阈值（约 3px）标记 `moved=true`；`click` 处理器发现 `moved` 为真则吞掉并复位，不 emit。键盘 Enter/Space 触发的 click 因 `moved` 恒为 false 正常放行。拖拽用 `setPointerCapture` + CSS `touch-action:none`，`--dragging` 期间关闭 transition 保证跟手。

参考：`src/components/HFloatingBubble.vue`。

## 反模式

- 在 `happier-ui` 内建播放队列、音源连接状态。
- 组件静默读写 `localStorage` 做业务偏好。
- 为库引入 pinia 作为 peer。
- 用 `reactive()` 声明组件状态（深层代理在解构/展开时丢响应性；一律 `ref`）。
