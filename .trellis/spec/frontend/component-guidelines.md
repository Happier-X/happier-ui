# Component Guidelines（happier-ui）

## 原则

- **语义组件**：解决 UI 问题，不 1:1 镜像 Ionic 标签名。
- **视觉参考 HeroUI Native**（色 / 圆角 / 间距 / 状态 / 变体观感）；组件交付面向 **Web 与移动端**；Vue 自实现，不依赖 `@heroui/react-native`。
- **无 elevation**；数值只走 `--h-*`（`src/styles/tokens.css`）。
- **不实现**导航栈、Modal / ActionSheet / Alert 引擎（宿主负责）。
- **触控热区**默认 ≥ 48px（`--h-touch-target`）。
- 图标/装饰优先 **slot**（内联 SVG）；不 peer `@ionic/vue`。

## 命名与导出

| 规则 | 现状 |
|------|------|
| 组件名 / 文件名 | `HButton` / `HIconButton` / `HSwitch` / `HBottomSheet` / `HDialog` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` / `HIcon` / `HTabBar` / `HNavBar` / `HCard` → `src/components/H*.vue` |
| 公共 API | `src/index.ts` 导出 `H*` |
| CSS 类前缀 | **一律 `h-*`** |

```ts
// src/index.ts
export { default as HButton } from './components/HButton.vue'
export { default as HIconButton } from './components/HIconButton.vue'
export { default as HSwitch } from './components/HSwitch.vue'
export { default as HBottomSheet } from './components/HBottomSheet.vue'
export { default as HDialog } from './components/HDialog.vue'
export { default as HInput } from './components/HInput.vue'
export { default as HCheckbox } from './components/HCheckbox.vue'
export { default as HCard } from './components/HCard.vue'
export { default as HEmpty } from './components/HEmpty.vue'
export { default as HImage } from './components/HImage.vue'
export { default as HIcon } from './components/HIcon.vue'
export { default as HTabBar } from './components/HTabBar.vue'
export { default as HNavBar } from './components/HNavBar.vue'
```

## SFC 结构（必须）

1. `<template>` → 2. `<script setup lang="ts">`（**无**大块视觉 `<style scoped>`）
2. Props：`defineProps` + `withDefaults`；必填无默认值。
3. 事件：`defineEmits<{ click: [event: MouseEvent] }>()` 对象形式。
4. 组合：用 **具名 slot**，不把业务子树写死进库。
5. 样式：模板使用 **`h-*` BEM**；视觉规则写在 `src/styles/components/*.css` 的 `@layer components` 中，用 `var(--h-…, fallback)`（或 token utility）。

文档：每个公共 `H*` 在 `docs/components/` 有对应页（示例 + API 表）；指南在 `docs/guide/`。文档主路径为 TW4 + `happier-ui/styles`。

参考实现：

- `src/components/HButton.vue` — 7 variants × sm/md/lg、leading/trailing、disabled、focus-visible
- `src/components/HIconButton.vue` — 纯图标按钮；7 variants × sm/md/lg、square/circle 形状、ariaLabel 必填、disabled、focus-visible；配色与 token 复用 HButton
- `src/components/HSwitch.vue` — `v-model`、size、disabled、`role="switch"`
- `src/components/HBottomSheet.vue` — `v-model`、overlay/Esc 关闭、dialog 语义、标题/内容槽
- `src/components/HDialog.vue` — 居中 dialog；title/description/actions slots
- `src/components/HInput.vue` — v-model；label/error；可对接 TanStack Field（不 peer tanstack）
- `src/components/HCheckbox.vue` — v-model；label；indeterminate 半选（无 group）
- `src/components/HEmpty.vue` — title/description；icon 与 default 操作槽；无 compact
- `src/components/HImage.vue` — src/alt；fit/radius/loading；默认 fallback + `#fallback`
- `src/components/HIcon.vue` — Lucide `:icon`；variant stroke/fill；size sm/md/lg/number
- `src/components/HTabBar.vue` — items + v-model key；内部 HIcon；safe-area
- `src/components/HNavBar.vue` — header 标题栏；左右/标题插槽；默认返回按钮；无路由
- `src/components/HCard.vue` — 内容分组容器；outlined/filled/flat variant、padding none/sm/md/lg、radius sm/md；header/body/footer 具名 slot；无 elevation、无整卡交互

## API 约定

| 主题 | 约定 | 例子 |
|------|------|------|
| 文字按钮 | `variant` + `size` + default slot | `HButton` |
| 图标按钮 | `icon` + `ariaLabel`(必填) + `variant` + `size` + `shape` square/circle；TS 项目用 `ariaLabel`/`:ariaLabel` 传入（见反模式） | `HIconButton` |
| 开关 | `modelValue` + `update:modelValue`；`role="switch"` | `HSwitch` |
| 底部面板 | `modelValue` + overlay/Esc 请求关闭；`role="dialog"` | `HBottomSheet` |
| 居中对话框 | `modelValue` + overlay/Esc；title/description/actions | `HDialog` |
| 文本输入 | `modelValue` + `update:modelValue` + `blur`；label/error | `HInput` |
| 复选框 | `modelValue` + `update:modelValue`；`indeterminate`；label | `HCheckbox` |
| 空状态 | `title`；可选 `description`、`#icon`、default 操作槽；无 compact | `HEmpty` |
| 图片 | `src`/`alt`；fit/radius/loading；失败 fallback | `HImage` |
| 图标 | Lucide `:icon`；`variant` stroke/fill；size | `HIcon` |
| 底部导航 | `items` + `modelValue`（string key）；内部 HIcon；`fixed` / `safeArea` 默认 true | `HTabBar` |
| 顶部标题栏 | `title` / `#title`；`#left` / `#right`；`showBack`；左右点击事件；`fixed` / `safeArea` 默认 true；无路由 | `HNavBar` |
| 卡片容器 | `variant` outlined/filled/flat + `padding` none/sm/md/lg + `radius` sm/md；`#header` / default / `#footer` 具名 slot；纯展示无整卡可点击；无 Emits | `HCard` |
| 无障碍 | 可聚焦控件 `:focus-visible`；输入/复选关联 label；空状态标题语义；图片需 `alt`；装饰图标默认 hidden；底栏 nav + `aria-current`；顶栏 header + 返回 `aria-label`；面板/对话框需标题或 `ariaLabel`；图标按钮 `ariaLabel` 必填 | `HButton` / `HIconButton` / `HSwitch` / `HBottomSheet` / `HDialog` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` / `HIcon` / `HTabBar` / `HNavBar` |
| 领域 UI | **不进库** | 封面、播放器、WebDAV 逻辑 |

## 当前导出

| 导出 | 文件 | 备注 |
|------|------|------|
| `HButton` | `HButton.vue` | primary/secondary/tertiary/outline/ghost/danger/danger-soft；sm/md/lg |
| `HIconButton` | `HIconButton.vue` | 纯图标按钮；同 HButton 7 variant；sm/md/lg；square/circle；ariaLabel 必填 |
| `HSwitch` | `HSwitch.vue` | v-model；sm/md/lg；disabled；HeroUI Native 观感 |
| `HBottomSheet` | `HBottomSheet.vue` | v-model；overlay/Esc；title/default slots；非 Portal MVP |
| `HDialog` | `HDialog.vue` | 居中；title/description/default/actions；非 Portal MVP |
| `HInput` | `HInput.vue` | v-model；label/description/error；TanStack Field 友好绑定 |
| `HCheckbox` | `HCheckbox.vue` | v-model；label；indeterminate 半选；宿主清半选 |
| `HEmpty` | `HEmpty.vue` | title/description；icon 与 default 操作槽；无旧别名 |
| `HImage` | `HImage.vue` | src/alt；fit/radius/loading；失败 fallback |
| `HIcon` | `HIcon.vue` | Lucide 组件；stroke/fill；peer `@lucide/vue` |
| `HTabBar` | `HTabBar.vue` | items + v-model key；fixed/safeArea 默认开且可独立关；无路由 |
| `HNavBar` | `HNavBar.vue` | header；title/left/right slots；showBack；fixed/safeArea；无路由 |
| `HCard` | `HCard.vue` | 内容分组容器；outlined/filled/flat；padding none/sm/md/lg；radius sm/md；header/body/footer slot；无 elevation |
| `styles` | `src/styles/` | 经 `happier-ui/styles` 导出（tokens + theme + components） |
| `tokens.css` | `src/styles/tokens.css` | 经 `happier-ui/tokens.css` 导出（可选） |

### 已移除（勿再导出）

`HEmptyState`、`HListRow`、`HListSection`、`HSettingRow` 及全部 `M*` 兼容别名。宿主若仍依赖请自实现或改 import。

## 路线图

以 `HButton` / `HIconButton` / `HSwitch` / `HBottomSheet` / `HDialog` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` / `HIcon` / `HTabBar` / `HNavBar` + tokens 为基线，按需再引入 Form/Notice/Surface 等。历史路线图见 `.trellis/tasks/archive/2026-07/07-22-component-roadmap/prd.md`（其中已删组件条目作废）。

## 反模式

| 不要 | 原因 |
|------|------|
| 在组件内 `import` `@ionic/vue` | 无 Ionic 宿主会挂 |
| 新魔法数颜色 / px 间距 | 破坏 token 一致性 |
| Material 阴影 elevation | 与 HeroUI Native / 项目定位冲突 |
| 把音乐封面、队列、播放手势做进库 | 领域语义属 Muses |
| 只写组件不上 playground | 消费方与 AI 无法目视回归 |
| 在 SFC 大块 scoped 视觉 CSS 与 styles/components 双源 | 与 Tailwind/HeroUI 式分发冲突 |
| `HIconButton` 示例写 `aria-label` 而不是 `ariaLabel` | `vue-tsc` 会把 `aria-label` 当原生 ARIA 属性，不满足必填 prop；组件内部仍输出原生 `aria-label` |
| 恢复已删除的 M* 别名而不经任务评审 | 破坏性 API 需显式决策 |

## 新组件清单

1. 在 `src/components/HXxx.vue` 实现逻辑与 BEM 类（HeroUI Native 观感）。
2. 在 `src/styles/components/xxx.css` 写 `@layer components` 视觉规则；`components.css` 增加 `@import`。
3. `src/index.ts` 导出 `HXxx`。
4. `playground/src/App.vue` 增加演示段（宿主已 `@import "happier-ui/styles"`）。
5. 更新本文件「当前导出」表。
