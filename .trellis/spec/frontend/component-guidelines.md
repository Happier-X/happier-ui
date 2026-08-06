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
| 组件名 / 文件名 | `HBadge` / `HTag` / `HButton` / `HSwitch` / `HRange` / `HProgress` / `HLoading` / `HBottomSheet` / `HDialog` / `HPopup` / `HToast` / `HInput` / `HTextarea` / `HCheckbox` / `HEmpty` / `HImage` / `HIcon` / `HTabBar` / `HNavBar` / `HCard` / `HCell` / `HCellGroup` / `HFloatingBubble` / `HSidebar` / `HSelect` / `HTable` / `HHeatmap` / `HTooltip` → `src/components/H*.vue` |
| 公共 API | `src/index.ts` 导出 `H*` |
| CSS 类前缀 | **一律 `h-*`** |

```ts
// src/index.ts
export { default as HBadge } from './components/HBadge.vue'
export { default as HButton } from './components/HButton.vue'
export { default as HPagination } from './components/HPagination.vue'
export { default as HSwitch } from './components/HSwitch.vue'
export { default as HRange } from './components/HRange.vue'
export { default as HProgress } from './components/HProgress.vue'
export { default as HLoading } from './components/HLoading.vue'
export { default as HBottomSheet } from './components/HBottomSheet.vue'
export { default as HDialog } from './components/HDialog.vue'
export { default as HPopup } from './components/HPopup.vue'
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
export { default as HHeatmap } from './components/HHeatmap.vue'
export { default as HTooltip } from './components/HTooltip.vue'
export { default as HTag } from './components/HTag.vue'
```

## SFC 结构（必须）

1. `<template>` → 2. `<script setup lang="ts">`（**无**大块视觉 `<style scoped>`）
2. Props：`defineProps` + `withDefaults`；必填无默认值。
3. 事件：`defineEmits<{ click: [event: MouseEvent] }>()` 对象形式。
4. 组合：用 **具名 slot**，不把业务子树写死进库。
5. 样式：模板使用 **`h-*` BEM**；视觉规则写在 `src/styles/components/*.css` 的 `@layer components` 中，用 `var(--h-…, fallback)`（或 token utility）。
6. **状态：一律 `ref`，禁止 `reactive`**（唯一响应式原语；`reactive` 深层代理在解构/展开时丢失响应性，`ref` 语义更明确）。
6. 泛型 SFC（仅在需要按业务行/项类型参数化 props/slots 时使用）：
   - 声明：`<script setup lang="ts" generic="T extends object = Record<string, unknown>">`。
   - **约束用 `T extends object`，不要用 `T extends Record<string, unknown>`**——后者要求索引签名，会把普通 `interface`（无 `[key: string]: unknown`）挡在外面，消费方被迫双重断言，失去泛型意义。
   - 默认参数 `= Record<string, unknown>` 保证裸用法（不标注 `T`）零破坏。
   - 字段 key 约束用 `keyof T & string`（既收窄到 `T` 字段，又保证是 string，支持 `row[col.key]` / `:key`）。
   - 用 `defineSlots` 把 slot 作用域里的 `row`/`item` 类型化为 `T`，使消费方 slot 内无需 `as`。
   - 导出的列/项接口也自带类型参数（`export interface HXxxColumn<T extends object = Record<string, unknown>>`），与 SFC 顶层 `generic` 的 `T` 作用域不共享。
   - 构建后核验 `dist/components/H*.vue.d.ts` 是否保留泛型签名（`vite-plugin-dts` 对 Vue 3.3+ 泛型 SFC 支持良好）。
   - 参考：`HTable`。

文档：每个公共 `H*` 在 `docs/components/` 有对应页（示例 + API 表）；指南在 `docs/guide/`。文档主路径为 TW4 + `happier-ui/styles`。

文档演示区宽度约定：`.vp-doc .h-demo`（`docs/.vitepress/theme/custom.css`）带 `overflow-x: auto`。固有宽度组件（如 HHeatmap 年视图 ≈53 列、宽 HTable）天然比 VitePress 正文区（≈688px）宽，**不**为迁就容器压缩格子/列宽 token，由演示容器横向滚动；写新组件文档时无需额外处理。

参考实现：

- `src/components/HButton.vue` — 7 variants × sm/md/lg、leading/trailing、disabled、focus-visible；`isIconOnly`(方形/圆形、aspect-ratio:1、图标走默认 slot、ariaLabel 提供可访问名) 覆盖纯图标场景（对齐 HeroUI Native，不再单列组件）
- `src/components/HSwitch.vue` — `v-model`、size、disabled、`role="switch"`
- `src/components/HRange.vue` — 单值横向滑块；v-model number；min/max/step；size/disabled；原生 range 语义
- `src/components/HProgress.vue` — 只读线形进度条；value/max 确定进度、越界夹取；indeterminate 循环动画；size/variant/rounded；progressbar 语义；无 emits/slots
- `src/components/HLoading.vue` — 加载指示；mode local/global（默认 local）；size sm/md/lg；label + default slot（slot 优先）；无 color prop；role=status；global Teleport + 深色 HUD；无 emits
- `src/components/HBottomSheet.vue` — 基于 `HPopup(position="bottom")` 的薄包装；`showHandle` 映射 HPopup `handle`；`maxWidth` 透传（默认全宽 edge-to-edge，per-instance 限宽）；公共 API 完全保持向后兼容
- `src/components/HDialog.vue` — 基于 `HPopup(position="center")` 的薄包装；`#actions` → `#footer`，`#description` 并入 `#title`；公共 API 完全保持向后兼容
- `src/components/HPopup.vue` — 通用浮层基础件，`position` 统摄 bottom/top/left/right/center/relative/fullscreen 七种形态；内置 `useScrollLock`（引用计数）+ `useTeleportTarget`；无 before-close；`closeable` + Lucide X 关闭按钮（默认隐藏）；`keepAlive`（默认 false，true 时 slot 首渲即挂载、关闭仅隐藏不卸载、重开重放入场动画）；`swipeClose`（默认 true，false 时禁用 fullscreen 内置下滑手势，`touch-action` 复位 `auto` 交还宿主、其余关闭通道/转场/滚动锁不变）；relative 形态用 JS 计算坐标 + 边缘翻转 + resize/scroll 重算；fullscreen 占满（`inset:0`、无圆角/无 safe-area padding/无 header/`handle` 无效），内容顶部（`scrollTop===0`）支持 touch 下滑关闭（≥80px 或 ≥0.3px/ms；否则 250ms 回弹；拖动期 `touch-action:none` + overlay 透明度随 delta 衰减）
- `src/components/HToast.vue` — 声明式单条轻提示；深色 HUD；v-model；variant/position(center 默认)/duration/icon；内置语义图标 + `#icon` 插槽；live-region；`teleport` 默认 body；无队列
- `src/components/HInput.vue` — v-model；label/error；可对接 TanStack Field（不 peer tanstack）
- `src/components/HCheckbox.vue` — v-model；label；indeterminate 半选（无 group）
- `src/components/HEmpty.vue` — title/description；icon 与 default 操作槽；无 compact
- `src/components/HImage.vue` — src/alt；fit/radius/loading；默认 fallback + `#fallback`
- `src/components/HIcon.vue` — Lucide `:icon`；variant stroke/fill；size sm/md/lg/number
- `src/components/HTabBar.vue` — items + v-model key；内部 HIcon；safe-area
- `src/components/HNavBar.vue` — header 标题栏；左右/标题插槽；默认返回按钮；无路由
- `src/components/HCard.vue` — 内容分组容器；outlined/filled/flat variant、padding none/sm/md/lg、radius sm/md；header/body/footer 具名 slot；无 elevation、无整卡交互
- `src/components/HCell.vue` / `HCellGroup.vue` — 设置行与分组；title/description、prefix/suffix、clickable 键盘激活、默认 chevron、Surface/card/flat 分组（`variant` 三态，`inset` 布尔兼容映射）与直接子 Cell 分隔线
- `src/components/HBadge.vue` — 状态徽章；variant/default/success/warning/danger/info、size sm/md、dot 模式
- `src/components/HTextarea.vue` — 多行文本输入；v-model string；label/error/description、size sm/md/lg、rows、resize auto/none/vertical/both、maxLength+showCount、mono 等宽字体（var(--h-font-mono)）
- `src/components/HTag.vue` — 可关闭标签；variant/default/primary/success/warning/danger、size sm/md、closable、disabled；close emit
- `src/components/HSelect.vue` — HeroUI Web 风格自定义 popover 下拉选择框（非原生 `<select>`）；options(HSelectOption[]，含可选 description)、v-model string|number；variant flat/bordered/faded/underlined、color default/primary/success/warning/danger、size sm/md/lg、radius none/sm/md/lg/full、labelPlacement outside/inside；label/description/error/invalid/placeholder/disabled/clearable/name/ariaLabel/teleport(默认 body)；combobox+listbox+aria-activedescendant 键盘导航、点外部/Esc/选中关闭、下方空间不足向上翻转、隐藏 input 承载 name；change emit；#option/#value/#start/#end/#indicator slot
- `src/components/HTable.vue` — 数据表格；泛型组件 `<script setup generic="T extends object = Record<string, unknown>">`，`data: T[]`、`HTableColumn<T>` 的 `key: keyof T & string`、`cell` slot `row` 推断为 `T`（消费方传具体 interface[] 无需 as 断言，裸用法默认 `Record<string, unknown>` 兼容）；sortable/striped/bordered/stickyHeader/loading/empty；sort emit；#cell/#empty/#loading slot
- `src/components/HFloatingBubble.vue` — 浮动气泡（悬浮操作按钮）；v-model:offset、axis x/y/xy/lock、gap、magnetic x/y 磁吸、Teleport(默认 body)、icon/default slot、ariaLabel 必填、Pointer 拖拽 + 抑制误触 click
- `src/components/HHeatmap.vue` — GitHub 贡献图风格日历热力图；`data: HHeatmapItem[]`（`{timestamp, value}`，同日 value 求和）、时间范围由 data min/max timestamp 推断并向前对齐周首/向后补周末；firstDayOfWeek 0-6、size small/medium/large、colors 覆盖默认主色蓝阶梯、show{Week,Month}Labels/showColorIndicator/loading；每格原生 title、`role="img"`；纯派生只读，无 emits/slots；**依赖 dayjs**（首个 runtime dependency）
- `src/components/HTooltip.vue` — 悬浮提示；hover/focus/tap 触发；content prop 或 #content slot；placement(top/bottom/left/right) + 边缘翻转；color(default/primary/success/warning/danger)+radius+showArrow+delay+disabled；teleport(默认 body)；role=tooltip+aria-describedby
- `src/components/HSidebar.vue` — 常驻式左侧边栏导航；items + v-model(key)、v-model:collapsed 受控折叠、showCollapseToggle 内置折叠按钮、header/footer slot、nav + aria-current、折叠态保留可访问名、无路由/无 overlay

## API 约定

| 主题 | 约定 | 例子 |
|------|------|------|
| 文字按钮 | `variant` + `size` + default slot | `HButton` |
| 图标按钮 | `HButton` 的 `isIconOnly` + `shape` square/circle + `ariaLabel`；图标走默认 slot；无独立组件（对齐 HeroUI Native） | `HButton` |
| 开关 | `modelValue` + `update:modelValue`；`role="switch"` | `HSwitch` |
| 滑块 | `modelValue` number + `min`/`max`/`step`；`change`/`drag-start`/`drag-end` emits；单值横向；原生 `input[type=range]` | `HRange` |
| 进度条 | `value` + `max`（默认 100）；`indeterminate`；`size`/`variant`/`rounded`；`role="progressbar"`；只读无 emits/slots | `HProgress` |
| 加载指示 | `mode` local/global（默认 local）+ `size` sm/md/lg（默认 md）+ `label`/`ariaLabel`；default slot 优先于 label；无 color prop；local 覆盖父容器（需 relative）、global Teleport 全屏 HUD；`role="status"`；纯展示无 emits | `HLoading` |
| 底部面板 | 基础件见 `HPopup(position=bottom)`；旧 wrapper `HBottomSheet` 保持 modelValue + overlay/Esc + showHandle API；`maxWidth`（string/number，per-instance 限宽，默认全宽 edge-to-edge）；`role="dialog"`；`teleport` 默认 body | `HBottomSheet` / `HPopup` |
| 居中对话框 | 基础件见 `HPopup(position=center)`；旧 wrapper `HDialog` 保持 modelValue + overlay/Esc + title/description/actions API；`role="dialog"`；`teleport` 默认 body | `HDialog` / `HPopup` |
| 轻提示 | `modelValue` + `duration` 自动关闭；深色 HUD；variant + position(center/top/bottom，默认 center) + icon；内置语义图标/`#icon`；live-region；`teleport` 默认 body；无队列 | `HToast` |
| 文本输入 | `modelValue` + `update:modelValue` + `blur`；label/error | `HInput` |
| 复选框 | `modelValue` + `update:modelValue`；`indeterminate`；label | `HCheckbox` |
| 空状态 | `title`；可选 `description`、`#icon`、default 操作槽；无 compact | `HEmpty` |
| 图片 | `src`/`alt`；fit/radius/loading；失败 fallback | `HImage` |
| 图标 | Lucide `:icon`；`variant` stroke/fill；size | `HIcon` |
| 底部导航 | `items` + `modelValue`（string key）；内部 HIcon；`fixed` / `safeArea` 默认 true | `HTabBar` |
| 顶部标题栏 | `title` / `#title`；`#left` / `#right`；`showBack`；左右点击事件；`fixed` / `safeArea` 默认 true；无路由 | `HNavBar` |
| 卡片容器 | `variant` outlined/filled/flat + `padding` none/sm/md/lg + `radius` sm/md；`#header` / default / `#footer` 具名 slot；纯展示无整卡可点击；无 Emits | `HCard` |
| 设置行 | `title` 必填、可选 `description`；`#prefix` / `#suffix`；`clickable` 默认 false；`showChevron` 默认跟随 clickable；click emit 原始 MouseEvent/KeyboardEvent | `HCell` |
| 设置分组 | `title` 可选；`variant` card/inset/flat（默认 inset，card=圆角+左右留白对齐 riceui 卡片）；`inset` 布尔保留兼容映射（variant 优先）；`#header` 覆盖默认标题，default 直接放 `HCell`；相邻直接子 Cell 自动分隔 | `HCellGroup` |
| 浮动气泡 | `v-model:offset`(`{x,y}`) + `axis` x/y/xy/lock + `gap` number/{x,y} + `magnetic` x/y；`icon` 或 default slot；`ariaLabel` 必填；`teleport` 默认 body；`click`/`offset-change`/`drag-start`/`drag-end` | `HFloatingBubble` |
| 侧边栏 | `items`(必填) + `modelValue`(string key) + `v-model:collapsed`；`showCollapseToggle` 默认 true；`#header` / `#footer` slot；`update:modelValue`/`update:collapsed`；常驻占位、无路由、无 overlay | `HSidebar` |
| 状态徽章 | `variant` default/success/warning/danger/info + `size` sm/md + `dot` 纯圆点模式；default slot | `HBadge` |
| 文本输入(多行) | `modelValue` string + `rows`/`resize`/`maxLength`/`showCount`/`mono`；`label`/`error`/`description`/`size` sm/md/lg；`update:modelValue`/`focus`/`blur` | `HTextarea` |
| 标签 | `variant` default/primary/success/warning/danger + `size` sm/md + `closable` + `disabled`；`close` emit；default slot | `HTag` |
| 下拉选择框 | 自定义 popover 面板（非原生 select，视觉对齐 HeroUI Web）；`options`(HSelectOption[]) + `modelValue` string|number；`variant`(flat/bordered/faded/underlined) + `color`(default/primary/success/warning/danger) + `size`(sm/md/lg) + `radius`(none/sm/md/lg/full) + `labelPlacement`(outside/inside)；`label`/`description`/`error`/`invalid`/`placeholder`/`disabled`/`clearable`/`name`/`ariaLabel`/`teleport`(默认 body)；`change` emit；`#option`/`#value`/`#start`/`#end`/`#indicator` slot；combobox/listbox 语义 + 键盘导航；单选（多选/搜索/分组/移动 picker 不在范围） | `HSelect` |
| 数据表格 | 泛型行类型 `T extends object`：`columns`(`HTableColumn<T>[]`，`key: keyof T & string`) + `data`(`T[]`) + `rowKey`；`cell` slot `row: T`；`sortable`/`striped`/`bordered`/`stickyHeader`/`loading`/`emptyText`；`sort` emit（`HTableSort.key` 保持 string）；`#cell`/`#empty`/`#loading` slot；裸用法默认参数 `Record<string, unknown>` 向后兼容 | `HTable` |
| 悬浮提示 | `content` + `placement` top/bottom/left/right + `color` default/primary/success/warning/danger + `radius` none/sm/md/lg/full + `showArrow` + `delay`(默认 200ms) + `disabled`；`role="tooltip"` + `aria-describedby`；`teleport` 默认 body；hover/focus/tap 触发、边缘翻转、滚动/resize 关闭；`#content` slot；无 emits | `HTooltip` |
| 日历热力图 | `data`(`HHeatmapItem[]`，`{timestamp, value}` 同日求和) + `firstDayOfWeek` 0-6 + `size` small/medium/large + `colors` 覆盖默认蓝阶梯 + `showWeekLabels`/`showMonthLabels`/`showColorIndicator`/`loading`；范围由 data min/max timestamp 推断；每格原生 `title`；`role="img"`；只读无 emits/slots；日期计算走 dayjs | `HHeatmap` |
| 无障碍 | 可聚焦控件 `:focus-visible`；输入/复选关联 label；Range 无可见标签时传 `ariaLabel`；Progress 用 `role="progressbar"` + `aria-value*`（indeterminate 省 valuenow）且无可见标签时传 `ariaLabel`；Loading 用 `role="status"` + aria-label 三级回退（ariaLabel \|\| label \|\| 「加载中」，空串视为未提供），spinner `aria-hidden`；空状态标题语义；图片需 `alt`；装饰图标默认 hidden；底栏 nav + `aria-current`；顶栏 header + 返回 `aria-label`；面板/对话框需标题或 `ariaLabel`；`HButton isIconOnly` 传 `ariaLabel`；Toast live-region 不抢焦点；Cell 交互行 `role="button"`+`tabindex="0"`+Enter/Space，chevron `aria-hidden`，Group 默认标题 `aria-labelledby`；Select 触发器 `role="combobox"`+`aria-expanded/controls/haspopup/activedescendant`，面板 `role="listbox"`，选项 `role="option"`+`aria-selected/disabled` | `HBadge` / `HTextarea` / `HTag` / `HButton` / `HSwitch` / `HRange` / `HProgress` / `HLoading` / `HBottomSheet` / `HDialog` / `HToast` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` / `HIcon` / `HTabBar` / `HNavBar` / `HCell` / `HCellGroup` / `HSelect` / `HTable` |
| 领域 UI | **不进库** | 封面、播放器、WebDAV 逻辑 |

## 当前导出

| 导出 | 文件 | 备注 |
|------|------|------|
| `HButton` | `HButton.vue` | primary/secondary/tertiary/outline/ghost/danger/danger-soft；sm/md/lg；`isIconOnly`+`shape` square/circle+`ariaLabel` 覆盖纯图标（无独立 HIconButton） |
| `HSwitch` | `HSwitch.vue` | v-model；sm/md/lg；disabled；HeroUI Native 观感 |
| `HRange` | `HRange.vue` | 单值横向滑块；v-model number；min/max/step；sm/md/lg；disabled；原生 range 语义 |
| `HProgress` | `HProgress.vue` | 只读线形进度条；value/max、越界夹取；indeterminate 循环动画；sm/md/lg；primary/success/warning/danger；rounded；progressbar 语义 |
| `HLoading` | `HLoading.vue` | 加载指示；mode local/global（默认 local）；size sm/md/lg；label + default slot（slot 优先）；无 color；local 覆盖父容器、global Teleport 全屏 HUD；role=status；无 emits |
| `HBottomSheet` | `HBottomSheet.vue` | HPopup(position=bottom) 薄包装；v-model；overlay/Esc；showHandle 映射 HPopup `handle`；`maxWidth` 透传（默认全宽，宽屏限宽走 prop/token）；title/default slots；`teleport` 默认 body（旧 API 不变） |
| `HDialog` | `HDialog.vue` | HPopup(position=center) 薄包装；v-model；overlay/Esc；title/description/default/actions(#actions→#footer)；`teleport` 默认 body（旧 API 不变） |
| `HPopup` | `HPopup.vue` | 通用浮层基础件；position bottom/top/left/right/center/relative/fullscreen；fullscreen=`inset:0`、无 header/圆角/safe-area、`handle` 无效、内容顶部 touch 下滑关闭（80px / 0.3px/ms，拖动期 lock 面板滚动）；`keepAlive`（默认 false，true 保活仅隐藏）+ `swipeClose`（默认 true，false 禁 fullscreen 下滑手势+touch-action 复位 auto）+ `maxWidth`（默认全宽，bottom/top 限宽）；modelValue；closeOnOverlay/Esc；lockScroll（useScrollLock）；title/ariaLabel；closeable + closeIconPosition；radius；handle（仅 bottom）；teleport 默认 body；无 before-close；emits close/open/after-leave/click-overlay/click-close-icon |
| `HToast` | `HToast.vue` | 声明式单条轻提示；深色 HUD；v-model；default/success/warning/danger；center/top/bottom（默认 center）；内置语义图标 + icon prop + `#icon`；duration 自动关闭；live-region；`teleport` 默认 body |
| `HInput` | `HInput.vue` | v-model；label/description/error；TanStack Field 友好绑定 |
| `HCheckbox` | `HCheckbox.vue` | v-model；label；indeterminate 半选；宿主清半选 |
| `HEmpty` | `HEmpty.vue` | title/description；icon 与 default 操作槽；无旧别名 |
| `HImage` | `HImage.vue` | src/alt；fit/radius/loading；失败 fallback |
| `HIcon` | `HIcon.vue` | Lucide 组件；stroke/fill；peer `@lucide/vue` |
| `HTabBar` | `HTabBar.vue` | items + v-model key；fixed/safeArea 默认开且可独立关；无路由 |
| `HNavBar` | `HNavBar.vue` | header；title/left/right slots；showBack；fixed/safeArea；无路由 |
| `HCard` | `HCard.vue` | 内容分组容器；outlined/filled/flat；padding none/sm/md/lg；radius sm/md；header/body/footer slot；无 elevation |
| `HCell` | `HCell.vue` | 设置行；title/description；prefix/suffix；clickable 与 Enter/Space；默认 chevron |
| `HCellGroup` | `HCellGroup.vue` | section 分组；默认标题 aria-labelledby；variant card/inset/flat（`inset` 布尔兼容映射）；直接子 Cell 分隔线 |
| `HFloatingBubble` | `HFloatingBubble.vue` | 浮动气泡；v-model:offset；axis x/y/xy/lock；gap；magnetic x/y 磁吸；Teleport 默认 body；icon/default slot；ariaLabel 必填；Pointer 拖拽 |
| `HSidebar` | `HSidebar.vue` | 常驻式左侧边栏；items + v-model(key)；v-model:collapsed 受控折叠；showCollapseToggle 内置折叠按钮；header/footer slot；nav + aria-current；无路由/无 overlay |
| `HBadge` | `HBadge.vue` | 状态徽章；variant+size+dot；default slot |
| `HTextarea` | `HTextarea.vue` | 多行文本输入；v-model + rows/resize/maxLength/showCount/mono(等宽) + label/error/description/size；focus/blur |
| `HTag` | `HTag.vue` | 可关闭标签；variant+size+closable+disabled；close emit；default slot |
| `HSelect` | `HSelect.vue` | HeroUI Web 风格自定义 popover 下拉选择框（非原生 select）；options(+description) + v-model(string\|number)；variant flat/bordered/faded/underlined + color default/primary/success/warning/danger + size sm/md/lg + radius none/sm/md/lg/full + labelPlacement outside/inside；label/description/error/invalid/placeholder/disabled/clearable/name/ariaLabel/teleport(默认 body)；combobox+listbox+aria-activedescendant 键盘导航、点外部/Esc/选中关闭、向上翻转、隐藏 input 保 name；change emit；#option/#value/#start/#end/#indicator slot；单选 MVP |
| `HTable` | `HTable.vue` | 数据表格（泛型 `T extends object`）；`columns: HTableColumn<T>[]` + `data: T[]` + rowKey；`cell` slot `row: T`；sortable/striped/bordered/stickyHeader/loading/emptyText；sort emit；#cell/#empty/#loading slot；默认参数 `Record<string, unknown>` 兼容裸用法 |
| `HScrollbar` | `HScrollbar.vue` | CSS-only 细窄主题滚动容器；mode thin/default/none + axis x/y/both + size sm/md/lg + color default/primary/success/warning/danger + ariaLabel；default slot；无 emits；高度由宿主控制 |
| `HTooltip` | `HTooltip.vue` | 悬浮提示；hover/focus/tap 触发；content+#content slot；placement 四向+翻转；color 五色+radius+showArrow+delay+disabled；teleport body；role=tooltip+aria-describedby |
| `HHeatmap` | `HHeatmap.vue` | GitHub 贡献图风格日历热力图；data `{timestamp,value}[]` 同日求和；范围由 data min/max 推断、对齐周首；firstDayOfWeek 0-6；size small/medium/large；colors 覆盖蓝阶梯；show{Week,Month}Labels/showColorIndicator/loading；每格原生 title；只读无 emits/slots；**依赖 dayjs**（首个 runtime dependency） |
| `styles` | `src/styles/` | 经 `happier-ui/styles` 导出（tokens + theme + components） |
| `tokens.css` | `src/styles/tokens.css` | 经 `happier-ui/tokens.css` 导出（可选） |

### 已移除（勿再导出）

`HEmptyState`、`HListRow`、`HListSection`、`HSettingRow` 及全部 `M*` 兼容别名。宿主若仍依赖请自实现或改 import。

## 路线图

以 `HButton` / `HSwitch` / `HRange` / `HProgress` / `HBottomSheet` / `HDialog` / `HToast` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` / `HIcon` / `HTabBar` / `HNavBar` / `HCard` / `HCell` / `HCellGroup` + tokens 为基线，按需再引入 Form/Notice/Surface 等。历史路线图见 `.trellis/tasks/archive/2026-07/07-22-component-roadmap/prd.md`（其中已删组件条目作废）。

## 反模式

> **Gotcha（keepAlive/v-show 保活）**：`<Transition>` 子元素在「保活」与「卸载」两种模式间切换时，同一元素上的 `v-if` 与 `v-show` **永不能在同一个渲染周期内同时翻转**——v-show 的 `display:none` 会提前杀死 Transition 离场动画（实现在 `HPopup.vue` 的 slot 锚点上）。守则：非保活时 `v-if` 跟随 `visible`、`v-show` 恒 `true`；保活时 `v-if` 恒 `true`（首渲即挂载）、`v-show` 跟随 `visible`；且保活路径不可再递增 `transitionKey`（否则强制重挂载、销毁保活内容）。


| 不要 | 原因 |
|------|------|
| 在组件内 `import` `@ionic/vue` | 无 Ionic 宿主会挂 |
| 用 `reactive()` 声明组件状态 | 深层代理解构/展开易丢响应性；统一 `ref`（唯一响应式原语） |
| 新魔法数颜色 / px 间距 | 破坏 token 一致性 |
| Material 阴影 elevation | 与 HeroUI Native / 项目定位冲突 |
| 把音乐封面、队列、播放手势做进库 | 领域语义属 Muses |
| 只写组件不上 playground | 消费方与 AI 无法目视回归 |
| 在 SFC 大块 scoped 视觉 CSS 与 styles/components 双源 | 与 Tailwind/HeroUI 式分发冲突 |
| `HButton isIconOnly` 传纯图标却漏 `ariaLabel` | 纯图标无文本可访问名，辅助技术读不出用途 |
| 恢复已删除的 M* 别名而不经任务评审 | 破坏性 API 需显式决策 |

## 新组件清单

1. 在 `src/components/HXxx.vue` 实现逻辑与 BEM 类（HeroUI Native 观感）。
2. 在 `src/styles/components/xxx.css` 写 `@layer components` 视觉规则；`components.css` 增加 `@import`。
3. `src/index.ts` 导出 `HXxx`。
4. `playground/src/App.vue` 增加演示段（宿主已 `@import "happier-ui/styles"`）。
5. 更新本文件「当前导出」表。
