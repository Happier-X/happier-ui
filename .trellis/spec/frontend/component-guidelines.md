# Component Guidelines（happier-ui）

## 原则

- **语义组件**：解决 UI 问题，不 1:1 镜像 Ionic 标签名。
- **视觉直接抄 HeroUI Native 移动端**（色 / 圆角 / 间距 / 状态 / 变体观感）；Vue 自实现，不依赖 `@heroui/react-native`。
- **无 elevation**；数值只走 `--h-*`（`src/tokens.css`）。
- **不实现**导航栈、Modal / ActionSheet / Alert 引擎（宿主负责）。
- **触控热区**默认 ≥ 48px（`--h-touch-target`）。
- 图标/装饰优先 **slot**（内联 SVG）；不 peer `@ionic/vue`。

## 命名与导出

| 规则 | 现状 |
|------|------|
| 组件名 / 文件名 | `HButton` / `HSwitch` / `HBottomSheet` / `HDialog` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` → `src/components/H*.vue` |
| 公共 API | `src/index.ts` 导出 `H*` |
| CSS 类前缀 | **一律 `h-*`** |

```ts
// src/index.ts
export { default as HButton } from './components/HButton.vue'
export { default as HSwitch } from './components/HSwitch.vue'
export { default as HBottomSheet } from './components/HBottomSheet.vue'
export { default as HDialog } from './components/HDialog.vue'
export { default as HInput } from './components/HInput.vue'
export { default as HCheckbox } from './components/HCheckbox.vue'
export { default as HEmpty } from './components/HEmpty.vue'
export { default as HImage } from './components/HImage.vue'
```

## SFC 结构（必须）

1. `<template>` → 2. `<script setup lang="ts">` → 3. `<style scoped>`
2. Props：`defineProps` + `withDefaults`；必填无默认值。
3. 事件：`defineEmits<{ click: [event: MouseEvent] }>()` 对象形式。
4. 组合：用 **具名 slot**，不把业务子树写死进库。
5. 样式：`scoped`；`var(--h-…, fallback)`。

参考实现：

- `src/components/HButton.vue` — 7 variants × sm/md/lg、leading/trailing、disabled、focus-visible
- `src/components/HSwitch.vue` — `v-model`、size、disabled、`role="switch"`
- `src/components/HBottomSheet.vue` — `v-model`、overlay/Esc 关闭、dialog 语义、标题/内容槽
- `src/components/HDialog.vue` — 居中 dialog；title/description/actions slots
- `src/components/HInput.vue` — v-model；label/error；可对接 TanStack Field（不 peer tanstack）
- `src/components/HCheckbox.vue` — v-model；label；indeterminate 半选（无 group）
- `src/components/HEmpty.vue` — title/description；icon 与 default 操作槽；无 compact
- `src/components/HImage.vue` — src/alt；fit/radius/loading；默认 fallback + `#fallback`

## API 约定

| 主题 | 约定 | 例子 |
|------|------|------|
| 文字按钮 | `variant` + `size` + default slot | `HButton` |
| 开关 | `modelValue` + `update:modelValue`；`role="switch"` | `HSwitch` |
| 底部面板 | `modelValue` + overlay/Esc 请求关闭；`role="dialog"` | `HBottomSheet` |
| 居中对话框 | `modelValue` + overlay/Esc；title/description/actions | `HDialog` |
| 文本输入 | `modelValue` + `update:modelValue` + `blur`；label/error | `HInput` |
| 复选框 | `modelValue` + `update:modelValue`；`indeterminate`；label | `HCheckbox` |
| 空状态 | `title`；可选 `description`、`#icon`、default 操作槽；无 compact | `HEmpty` |
| 图片 | `src`/`alt`；fit/radius/loading；失败 fallback | `HImage` |
| 无障碍 | 可聚焦控件 `:focus-visible`；输入/复选关联 label；空状态标题语义；图片需 `alt`；面板/对话框需标题或 `ariaLabel` | `HButton` / `HSwitch` / `HBottomSheet` / `HDialog` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` |
| 领域 UI | **不进库** | 封面、播放器、WebDAV 逻辑 |

## 当前导出

| 导出 | 文件 | 备注 |
|------|------|------|
| `HButton` | `HButton.vue` | primary/secondary/tertiary/outline/ghost/danger/danger-soft；sm/md/lg |
| `HSwitch` | `HSwitch.vue` | v-model；sm/md/lg；disabled；HeroUI Native 观感 |
| `HBottomSheet` | `HBottomSheet.vue` | v-model；overlay/Esc；title/default slots；非 Portal MVP |
| `HDialog` | `HDialog.vue` | 居中；title/description/default/actions；非 Portal MVP |
| `HInput` | `HInput.vue` | v-model；label/description/error；TanStack Field 友好绑定 |
| `HCheckbox` | `HCheckbox.vue` | v-model；label；indeterminate 半选；宿主清半选 |
| `HEmpty` | `HEmpty.vue` | title/description；icon 与 default 操作槽；无旧别名 |
| `HImage` | `HImage.vue` | src/alt；fit/radius/loading；失败 fallback |
| `tokens.css` | `src/tokens.css` | 经 `happier-ui/tokens.css` 导出 |

### 已移除（勿再导出）

`HEmptyState`、`HIconButton`、`HListRow`、`HListSection`、`HSettingRow` 及全部 `M*` 兼容别名。宿主若仍依赖请自实现或改 import。

## 路线图

以 `HButton` / `HSwitch` / `HBottomSheet` / `HDialog` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` + tokens 为基线，按需再引入 Form/Notice/Surface 等。历史路线图见  
`.trellis/tasks/archive/2026-07/07-22-component-roadmap/prd.md`（其中已删组件条目作废）。

## 反模式

| 不要 | 原因 |
|------|------|
| 在组件内 `import` `@ionic/vue` | 无 Ionic 宿主会挂 |
| 新魔法数颜色 / px 间距 | 破坏 token 一致性 |
| Material 阴影 elevation | 与 HeroUI Native / 项目定位冲突 |
| 把音乐封面、队列、播放手势做进库 | 领域语义属 Muses |
| 只写组件不上 playground | 消费方与 AI 无法目视回归 |
| 恢复已删除的 M* 别名而不经任务评审 | 破坏性 API 需显式决策 |

## 新组件清单

1. 在 `src/components/HXxx.vue` 实现（HeroUI Native 观感 + `--h-*`）。
2. `src/index.ts` 导出 `HXxx`。
3. `playground/src/App.vue` 增加演示段。
4. 更新本文件「当前导出」表。
