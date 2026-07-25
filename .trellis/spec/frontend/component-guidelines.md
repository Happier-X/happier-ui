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
| 组件名 / 文件名 | `HBadge` / `HTag` / `HButton` / `HIconButton` / `HSwitch` / `HRange` / `HProgress` / `HBottomSheet` / `HDialog` / `HToast` / `HInput` / `HTextarea` / `HCheckbox` / `HEmpty` / `HImage` / `HIcon` / `HTabBar` / `HNavBar` / `HCard` / `HCell` / `HCellGroup` / `HFloatingBubble` / `HSidebar` / `HSelect` / `HTable` → `src/components/H*.vue` |
| 公共 API | `src/index.ts` 导出 `H*` |
| CSS 类前缀 | **一律 `h-*`** |

```ts
// src/index.ts
export { default as HBadge } from './components/HBadge.vue'
export { default as HButton } from './components/HButton.vue'
export { default as HIconButton } from './components/HIconButton.vue'
export { default as HPagination } from './components/HPagination.vue'
export { default as HSwitch } from './components/HSwitch.vue'
export { default as HRange } from './components/HRange.vue'
export { default as HProgress } from './components/HProgress.vue'
export { default as HBottomSheet } from './components/HBottomSheet.vue'
export { default as HDialog } from './components/HDialog.vue'
export { default as HToast } from './components/HToast.vue'
export { default as HInput } from './components/HInput.vue'
export { default as HTextarea } from './components/HTextarea.vue'
export { default as HCheckbox } from './components/HCheckbox.vue'
export { default as HCard } from './components/HCard.vue'
export { default as HCell } from './components/HCell.vue'
export { default as HCellGroup } from './components/HCellGroup.vue'
export { default as HEmpty } from './components/HEmpty.vue'
export { default as HImage } from './components/HImage.vue'
export { default as HIcon } from './components/HIcon.vue'
export { default as HTabBar } from './components/HTabBar.vue'
export { default as HNavBar } from './components/HNavBar.vue'
export { default as HFloatingBubble } from './components/HFloatingBubble.vue'
export { default as HSidebar } from './components/HSidebar.vue'
export { default as HSelect } from './components/HSelect.vue'
export { default as HTable } from './components/HTable.vue'
export { default as HTag } from './components/HTag.vue'
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
- `src/components/HRange.vue` — 单值横向滑块；v-model number；min/max/step；size/disabled；原生 range 语义
- `src/components/HProgress.vue` — 只读线形进度条；value/max 确定进度、越界夹取；indeterminate 循环动画；size/variant/rounded；progressbar 语义；无 emits/slots
- `src/components/HBottomSheet.vue` — `v-model`、overlay/Esc 关闭、dialog 语义、标题/内容槽
- `src/components/HDialog.vue` — 居中 dialog；title/description/actions slots
- `src/components/HToast.vue` — 声明式单条轻提示；v-model；variant/position/duration；live-region；无队列
- `src/components/HInput.vue` — v-model；label/error；可对接 TanStack Field（不 peer tanstack）
- `src/components/HCheckbox.vue` — v-model；label；indeterminate 半选（无 group）
- `src/components/HEmpty.vue` — title/description；icon 与 default 操作槽；无 compact
- `src/components/HImage.vue` — src/alt；fit/radius/loading；默认 fallback + `#fallback`
- `src/components/HIcon.vue` — Lucide `:icon`；variant stroke/fill；size sm/md/lg/number
- `src/components/HTabBar.vue` — items + v-model key；内部 HIcon；safe-area
- `src/components/HNavBar.vue` — header 标题栏；左右/标题插槽；默认返回按钮；无路由
- `src/components/HCard.vue` — 内容分组容器；outlined/filled/flat variant、padding none/sm/md/lg、radius sm/md；header/body/footer 具名 slot；无 elevation、无整卡交互
- `src/components/HCell.vue` / `HCellGroup.vue` — 设置行与分组；title/description、prefix/suffix、clickable 键盘激活、默认 chevron、Surface/flat 分组与直接子 Cell 分隔线
- `src/components/HBadge.vue` — 状态徽章；variant/default/success/warning/danger/info、size sm/md、dot 模式
- `src/components/HTextarea.vue` — 多行文本输入；v-model string；label/error/description、size sm/md/lg、rows、resize auto/none/vertical/both、maxLength+showCount
- `src/components/HTag.vue` — 可关闭标签；variant/default/primary/success/warning/danger、size sm/md、closable、disabled；close emit
- `src/components/HSelect.vue` — 下拉选择框；options(HSelectOption[])、v-model string|number；label/placeholder/size/disabled/clearable；change emit；#option slot
- `src/components/HTable.vue` — 数据表格；columns + data、sortable/striped/bordered/stickyHeader/loading/empty；sort emit；#cell/#empty/#loading slot
- `src/components/HFloatingBubble.vue` — 浮动气泡（悬浮操作按钮）；v-model:offset、axis x/y/xy/lock、gap、magnetic x/y 磁吸、Teleport(默认 body)、icon/default slot、ariaLabel 必填、Pointer 拖拽 + 抑制误触 click
- `src/components/HSidebar.vue` — 常驻式左侧边栏导航；items + v-model(key)、v-model:collapsed 受控折叠、showCollapseToggle 内置折叠按钮、header/footer slot、nav + aria-current、折叠态保留可访问名、无路由/无 overlay

## API 约定

| 主题 | 约定 | 例子 |
|------|------|------|
| 文字按钮 | `variant` + `size` + default slot | `HButton` |
| 图标按钮 | `icon` + `ariaLabel`(必填) + `variant` + `size` + `shape` square/circle；TS 项目用 `ariaLabel`/`:ariaLabel` 传入（见反模式） | `HIconButton` |
| 开关 | `modelValue` + `update:modelValue`；`role="switch"` | `HSwitch` |
| 滑块 | `modelValue` number + `min`/`max`/`step`；`change`/`drag-start`/`drag-end` emits；单值横向；原生 `input[type=range]` | `HRange` |
| 进度条 | `value` + `max`（默认 100）；`indeterminate`；`size`/`variant`/`rounded`；`role="progressbar"`；只读无 emits/slots | `HProgress` |
| 底部面板 | `modelValue` + overlay/Esc 请求关闭；`role="dialog"` | `HBottomSheet` |
| 居中对话框 | `modelValue` + overlay/Esc；title/description/actions | `HDialog` |
| 轻提示 | `modelValue` + `duration` 自动关闭；variant/position；live-region；无队列 | `HToast` |
| 文本输入 | `modelValue` + `update:modelValue` + `blur`；label/error | `HInput` |
| 复选框 | `modelValue` + `update:modelValue`；`indeterminate`；label | `HCheckbox` |
| 空状态 | `title`；可选 `description`、`#icon`、default 操作槽；无 compact | `HEmpty` |
| 图片 | `src`/`alt`；fit/radius/loading；失败 fallback | `HImage` |
| 图标 | Lucide `:icon`；`variant` stroke/fill；size | `HIcon` |
| 底部导航 | `items` + `modelValue`（string key）；内部 HIcon；`fixed` / `safeArea` 默认 true | `HTabBar` |
| 顶部标题栏 | `title` / `#title`；`#left` / `#right`；`showBack`；左右点击事件；`fixed` / `safeArea` 默认 true；无路由 | `HNavBar` |
| 卡片容器 | `variant` outlined/filled/flat + `padding` none/sm/md/lg + `radius` sm/md；`#header` / default / `#footer` 具名 slot；纯展示无整卡可点击；无 Emits | `HCard` |
| 设置行 | `title` 必填、可选 `description`；`#prefix` / `#suffix`；`clickable` 默认 false；`showChevron` 默认跟随 clickable；click emit 原始 MouseEvent/KeyboardEvent | `HCell` |
| 设置分组 | `title` 可选；`inset` 默认 true；`#header` 覆盖默认标题，default 直接放 `HCell`；相邻直接子 Cell 自动分隔 | `HCellGroup` |
| 浮动气泡 | `v-model:offset`(`{x,y}`) + `axis` x/y/xy/lock + `gap` number/{x,y} + `magnetic` x/y；`icon` 或 default slot；`ariaLabel` 必填；`teleport` 默认 body；`click`/`offset-change`/`drag-start`/`drag-end` | `HFloatingBubble` |
| 侧边栏 | `items`(必填) + `modelValue`(string key) + `v-model:collapsed`；`showCollapseToggle` 默认 true；`#header` / `#footer` slot；`update:modelValue`/`update:collapsed`；常驻占位、无路由、无 overlay | `HSidebar` |
| 状态徽章 | `variant` default/success/warning/danger/info + `size` sm/md + `dot` 纯圆点模式；default slot | `HBadge` |
| 文本输入(多行) | `modelValue` string + `rows`/`resize`/`maxLength`/`showCount`；`label`/`error`/`description`/`size` sm/md/lg；`update:modelValue`/`focus`/`blur` | `HTextarea` |
| 标签 | `variant` default/primary/success/warning/danger + `size` sm/md + `closable` + `disabled`；`close` emit；default slot | `HTag` |
| 下拉选择框 | `options`(HSelectOption[]) + `modelValue` string|number；`label`/`placeholder`/`size`/`disabled`/`clearable`；`change` emit；`#option` slot | `HSelect` |
| 数据表格 | `columns`(HTableColumn[]) + `data`(Record[]) + `rowKey`；`sortable`/`striped`/`bordered`/`stickyHeader`/`loading`/`emptyText`；`sort` emit；`#cell`/`#empty`/`#loading` slot | `HTable` |
| 无障碍 | 可聚焦控件 `:focus-visible`；输入/复选关联 label；Range 无可见标签时传 `ariaLabel`；Progress 用 `role="progressbar"` + `aria-value*`（indeterminate 省 valuenow）且无可见标签时传 `ariaLabel`；空状态标题语义；图片需 `alt`；装饰图标默认 hidden；底栏 nav + `aria-current`；顶栏 header + 返回 `aria-label`；面板/对话框需标题或 `ariaLabel`；图标按钮 `ariaLabel` 必填；Toast live-region 不抢焦点；Cell 交互行 `role="button"`+`tabindex="0"`+Enter/Space，chevron `aria-hidden`，Group 默认标题 `aria-labelledby` | `HBadge` / `HTextarea` / `HTag` / `HButton` / `HIconButton` / `HSwitch` / `HRange` / `HProgress` / `HBottomSheet` / `HDialog` / `HToast` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` / `HIcon` / `HTabBar` / `HNavBar` / `HCell` / `HCellGroup` / `HSelect` / `HTable` |
| 领域 UI | **不进库** | 封面、播放器、WebDAV 逻辑 |

## 当前导出

| 导出 | 文件 | 备注 |
|------|------|------|
| `HButton` | `HButton.vue` | primary/secondary/tertiary/outline/ghost/danger/danger-soft；sm/md/lg |
| `HIconButton` | `HIconButton.vue` | 纯图标按钮；同 HButton 7 variant；sm/md/lg；square/circle；ariaLabel 必填 |
| `HSwitch` | `HSwitch.vue` | v-model；sm/md/lg；disabled；HeroUI Native 观感 |
| `HRange` | `HRange.vue` | 单值横向滑块；v-model number；min/max/step；sm/md/lg；disabled；原生 range 语义 |
| `HProgress` | `HProgress.vue` | 只读线形进度条；value/max、越界夹取；indeterminate 循环动画；sm/md/lg；primary/success/warning/danger；rounded；progressbar 语义 |
| `HBottomSheet` | `HBottomSheet.vue` | v-model；overlay/Esc；title/default slots；非 Portal MVP |
| `HDialog` | `HDialog.vue` | 居中；title/description/default/actions；非 Portal MVP |
| `HToast` | `HToast.vue` | 声明式单条轻提示；v-model；default/success/warning/danger；top/bottom；duration 自动关闭；live-region |
| `HInput` | `HInput.vue` | v-model；label/description/error；TanStack Field 友好绑定 |
| `HCheckbox` | `HCheckbox.vue` | v-model；label；indeterminate 半选；宿主清半选 |
| `HEmpty` | `HEmpty.vue` | title/description；icon 与 default 操作槽；无旧别名 |
| `HImage` | `HImage.vue` | src/alt；fit/radius/loading；失败 fallback |
| `HIcon` | `HIcon.vue` | Lucide 组件；stroke/fill；peer `@lucide/vue` |
| `HTabBar` | `HTabBar.vue` | items + v-model key；fixed/safeArea 默认开且可独立关；无路由 |
| `HNavBar` | `HNavBar.vue` | header；title/left/right slots；showBack；fixed/safeArea；无路由 |
| `HCard` | `HCard.vue` | 内容分组容器；outlined/filled/flat；padding none/sm/md/lg；radius sm/md；header/body/footer slot；无 elevation |
| `HCell` | `HCell.vue` | 设置行；title/description；prefix/suffix；clickable 与 Enter/Space；默认 chevron |
| `HCellGroup` | `HCellGroup.vue` | section 分组；默认标题 aria-labelledby；inset/flat；直接子 Cell 分隔线 |
| `HFloatingBubble` | `HFloatingBubble.vue` | 浮动气泡；v-model:offset；axis x/y/xy/lock；gap；magnetic x/y 磁吸；Teleport 默认 body；icon/default slot；ariaLabel 必填；Pointer 拖拽 |
| `HSidebar` | `HSidebar.vue` | 常驻式左侧边栏；items + v-model(key)；v-model:collapsed 受控折叠；showCollapseToggle 内置折叠按钮；header/footer slot；nav + aria-current；无路由/无 overlay |
| `HBadge` | `HBadge.vue` | 状态徽章；variant+size+dot；default slot |
| `HTextarea` | `HTextarea.vue` | 多行文本输入；v-model + rows/resize/maxLength/showCount + label/error/description/size；focus/blur |
| `HTag` | `HTag.vue` | 可关闭标签；variant+size+closable+disabled；close emit；default slot |
| `HSelect` | `HSelect.vue` | <select> 下拉选择框；options + v-model(string\|number)；label/placeholder/size/disabled/clearable；change emit；#option slot |
| `HTable` | `HTable.vue` | 数据表格；columns + data + rowKey；sortable/striped/bordered/stickyHeader/loading/emptyText；sort emit；#cell/#empty/#loading slot |
| `styles` | `src/styles/` | 经 `happier-ui/styles` 导出（tokens + theme + components） |
| `tokens.css` | `src/styles/tokens.css` | 经 `happier-ui/tokens.css` 导出（可选） |

### 已移除（勿再导出）

`HEmptyState`、`HListRow`、`HListSection`、`HSettingRow` 及全部 `M*` 兼容别名。宿主若仍依赖请自实现或改 import。

## 路线图

以 `HButton` / `HIconButton` / `HSwitch` / `HRange` / `HProgress` / `HBottomSheet` / `HDialog` / `HToast` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` / `HIcon` / `HTabBar` / `HNavBar` / `HCard` / `HCell` / `HCellGroup` + tokens 为基线，按需再引入 Form/Notice/Surface 等。历史路线图见 `.trellis/tasks/archive/2026-07/07-22-component-roadmap/prd.md`（其中已删组件条目作废）。

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
