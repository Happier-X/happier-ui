# Component Guidelines（happier-ui）

## 原则

- **语义组件**：解决 UI 问题（列表行、图标按钮、设置行），不 1:1 镜像 Ionic 标签名。
- **视觉直接抄 HeroUI Native 移动端**（色 / 圆角 / 间距 / 状态 / 变体观感）；Vue 自实现，不依赖 `@heroui/react-native`。
- **无 elevation**；数值只走 `--h-*`（`src/tokens.css`）。
- **不实现**导航栈、Modal / ActionSheet / Alert 引擎（宿主负责）。
- **触控热区**默认 ≥ 48px（`--h-touch-target`）。
- **图标优先 default slot**（内联 SVG）；`icon` path + `ion-icon` 仅可选，且不 import `@ionic/vue`。

## 命名与导出

| 规则 | 现状 |
|------|------|
| 组件名 / 文件名 | `HEmptyState` → `src/components/HEmptyState.vue` |
| 公共 API | `src/index.ts` 导出 `H*` |
| 兼容 Muses | 同文件再导出 `M*` 别名（过渡期） |
| CSS 类前缀 | **新代码用 `h-*`**；存量 `m-*`（如 `HSettingRow`、`HEmptyState`）为迁移债，改样式时顺手收敛 |

```ts
// src/index.ts 模式
export { default as HIconButton } from './components/HIconButton.vue'
export { default as MIconButton } from './components/HIconButton.vue' // 兼容
```

## SFC 结构（必须）

1. `<template>` → 2. `<script setup lang="ts">` → 3. `<style scoped>`
2. Props：`defineProps` + `withDefaults`；必填无默认值（如 `ariaLabel`、`title`）。
3. 事件：`defineEmits<{ click: [event: MouseEvent] }>()` 对象形式。
4. 组合：用 **具名 slot**（`start` / `end` / default），不把业务子树写死进库。
5. 样式：`scoped`；`var(--h-…, fallback)`；禁止硬编码主色/间距（fallback 仅兜底）。

参考实现：

- `src/components/HIconButton.vue` — slot 图标、`variant` / `size`、focus-visible、disabled
- `src/components/HListRow.vue` — `start`/`end` slot、`button` 键盘激活、`playing` 态
- `src/components/HSettingRow.vue` — 壳 + `end` 槽放宿主控件
- `src/components/HEmptyState.vue` — 标题/描述 + default 操作槽

## API 约定

| 主题 | 约定 | 例子 |
|------|------|------|
| 可点行 | `button` prop + `role="button"` + Enter/Space | `HListRow` |
| 无障碍 | 图标按钮强制 `ariaLabel` | `HIconButton` |
| 事件冒泡 | 可选 `stopPropagation` | `HIconButton` |
| 领域 UI | **不进库** | 封面 `MCover`、播放器、WebDAV 逻辑 |

## 当前导出

| 导出 | 文件 | 备注 |
|------|------|------|
| `HEmptyState` | `HEmptyState.vue` | 样式仍多用 `--muses-*`，P0 应改 `--h-*` |
| `HIconButton` | `HIconButton.vue` | 较完整的 `--h-*` 范本 |
| `HListRow` | `HListRow.vue` | 无默认封面 |
| `HSettingRow` | `HSettingRow.vue` | 类名仍 `m-setting-row` |
| `tokens.css` | `src/tokens.css` | 经 `happier-ui/tokens.css` 导出 |

## 路线图

P0 打磨 → `HButton` / `HListSection` → Form/Notice/Surface。详见  
`.trellis/tasks/archive/2026-07/07-22-component-roadmap/prd.md`。

## 反模式

| 不要 | 原因 |
|------|------|
| 在组件内 `import` `@ionic/vue` | 无 Ionic 宿主会挂 |
| 新魔法数颜色 / px 间距 | 破坏 token 一致性 |
| Material 阴影 elevation | 与 HeroUI Native / 项目定位冲突 |
| 把音乐封面、队列、播放手势做进库 | 领域语义属 Muses |
| 只写组件不上 playground | 消费方与 AI 无法目视回归 |

## 新组件清单

1. 在 `src/components/HXxx.vue` 实现（HeroUI Native 观感 + `--h-*`）。
2. `src/index.ts` 导出 `HXxx`（需要时再 `MXxx`）。
3. `playground/src/App.vue` 增加演示段。
4. 需要时更新本文件「当前导出」表。
