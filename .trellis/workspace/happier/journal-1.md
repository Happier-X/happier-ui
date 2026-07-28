# Journal - happier (Part 1)

> AI development session journal
> Started: 2026-07-22

---



## Session 1: 组件路线图定稿（HeroUI Native 视觉）

**Date**: 2026-07-22
**Task**: 组件路线图定稿（HeroUI Native 视觉）
**Branch**: `master`

### Summary

完成 happier-ui 组件路线图：边界/P0-P2/不进库清单；锁定直接抄 HeroUI Native 移动端样式；归档 component-roadmap。Bootstrap Guidelines 仍 open。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `aa937ba` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 2: Bootstrap Guidelines：填满 frontend spec

**Date**: 2026-07-22
**Task**: Bootstrap Guidelines：填满 frontend spec
**Branch**: `master`

### Summary

按 src/playground 实况填满 frontend 指南（含 tokens.md）；backend 空模板删除并标 N/A；归档 00-bootstrap-guidelines。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `59cc4a4` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 3: P0 组件打磨与 HButton/HListSection

**Date**: 2026-07-22
**Task**: P0 组件打磨与 HButton/HListSection
**Branch**: `master`

### Summary

打磨 HIconButton/HListRow/HSettingRow/HEmptyState 与 tokens；新增 HButton（7 variants）与 HListSection；playground 演示；build 通过；仅 happier-ui。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `87609d8` | (see git log) |
| `dfa5959` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 4: 移除 legacy 组件，仅保留 HButton

**Date**: 2026-07-22
**Task**: 移除 legacy 组件，仅保留 HButton
**Branch**: `master`

### Summary

按决策 C 删除 HEmptyState/HIconButton/HListRow/HListSection/HSettingRow 及 M* 别名；index 仅 HButton；playground/spec/README 同步；build 通过。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `ac598a8` | (see git log) |
| `21b6d74` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 5: 新增 HSwitch 开关组件

**Date**: 2026-07-22
**Task**: 新增 HSwitch 开关组件
**Branch**: `master`

### Summary

实现 HSwitch：v-model、disabled、sm/md/lg、role=switch、--h-* tokens；playground 与 spec/README 同步；build 通过。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `d395377` | (see git log) |
| `e4c90cb` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 6: 新增 HBottomSheet 底部面板

**Date**: 2026-07-22
**Task**: 新增 HBottomSheet 底部面板
**Branch**: `master`

### Summary

实现 HBottomSheet：v-model、遮罩/Esc 关闭、title/内容槽、dialog 语义、--h-* tokens；playground 与 spec/README 同步；build 通过。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `96b7ef9` | (see git log) |
| `cb9b469` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 7: 新增 HDialog 对话框组件

**Date**: 2026-07-22
**Task**: 新增 HDialog 对话框组件
**Branch**: `master`

### Summary

实现 HDialog：居中 modal、v-model、遮罩/Esc 关闭、title/description/actions 槽、dialog 语义、--h-* tokens；playground 与 spec/README 同步；build 通过。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `71eaba4` | (see git log) |
| `24340ef` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 8: HInput + TanStack Form 适配

**Date**: 2026-07-22
**Task**: HInput + TanStack Form 适配
**Branch**: `master`

### Summary

新增 HInput：v-model/label/error/a11y 与 --h-input-*；库不 peer tanstack；playground 用真实 @tanstack/vue-form Field 演示；README 与 frontend specs 更新；build:playground 通过并归档任务。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `16f6cd2` | (see git log) |
| `2def9af` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 9: HCheckbox 复选框（含半选）

**Date**: 2026-07-23
**Task**: HCheckbox 复选框（含半选）
**Branch**: `master`

### Summary

新增 HCheckbox：v-model/label/sizes/disabled、indeterminate 半选（宿主清半选、无 Group）；原生 checkbox + --h-checkbox-*；playground 全选演示；README 与 frontend specs 更新；build:playground 通过并归档。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `423913e` | (see git log) |
| `12382ad` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 10: HEmpty 空状态组件

**Date**: 2026-07-23
**Task**: HEmpty 空状态组件
**Branch**: `master`

### Summary

新增 HEmpty：title/description、#icon 与 default 操作槽；无 compact、无 HEmptyState/MEmptyState 别名；--h-empty-* tokens；playground 演示 + README/frontend specs；build:playground 通过并归档。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `a5af2f0` | (see git log) |
| `980e26b` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 11: HImage 图片组件

**Date**: 2026-07-23
**Task**: HImage 图片组件
**Branch**: `master`

### Summary

新增 HImage：src/alt、fit/radius/loading、默认 fallback + #fallback；--h-image-* tokens；playground 演示 + README/frontend specs；build:playground 通过并归档。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `b2fbf15` | (see git log) |
| `50cc562` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 12: HIcon 图标组件（Lucide）

**Date**: 2026-07-23
**Task**: HIcon 图标组件（Lucide）
**Branch**: `master`

### Summary

新增 HIcon：:icon 传 Lucide 组件、variant stroke/fill、size sm/md/lg/number、color/a11y；peer @lucide/vue（替代已弃用 lucide-vue-next）；playground 对比演示 + README/specs；build:playground 通过并归档。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `b9c0dc4` | (see git log) |
| `84b4dd8` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 13: HTabBar 底部导航栏

**Date**: 2026-07-23
**Task**: HTabBar 底部导航栏
**Branch**: `master`

### Summary

完成 HTabBar 纯 Vue 底部导航组件：支持 items 与 string key v-model、fixed 和 safeArea 两个默认开启且可独立关闭的 prop、HIcon 图标、安全区适配、playground 演示、README 与前端 specs；build:playground 通过并归档任务。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `50d1d3c` | (see git log) |
| `44d7a38` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 14: HNavBar 顶部导航栏

**Date**: 2026-07-23
**Task**: HNavBar 顶部导航栏
**Branch**: `master`

### Summary

完成 HNavBar 纯 Vue 顶部导航栏：支持 title 与 title/left/right 插槽、showBack 和 backAriaLabel、Vue 规范左右点击事件、fixed 与 safeArea 默认开启且可独立关闭、顶部安全区、标题视觉居中与单行省略；同步 tokens、playground、README 和前端 specs，build:playground 通过并归档任务。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `d7647f6` | (see git log) |
| `efcb948` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 15: Tailwind v4 / HeroUI 式样式迁移（0.0.2）

**Date**: 2026-07-24
**Task**: Tailwind v4 / HeroUI 式样式迁移（0.0.2）
**Branch**: `master`

### Summary

完成 happier-ui 从 scoped CSS 到 Tailwind v4 CSS-first 的破坏性迁移：styles/tokens/@theme/h- utility、11 个 H* BEM 组件层、playground 与 README、frontend specs；版本 0.0.2 已就绪，未 npm publish（需二次确认）。npm-publish 任务仍 in_progress（0.0.1 已在 registry）。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `d996d30` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 16: VitePress 组件文档站 + GitHub Pages

**Date**: 2026-07-24
**Task**: VitePress 组件文档站 + GitHub Pages
**Branch**: `master`

### Summary

完成 happier-ui VitePress 文档站：指南（接入/token/主题/0.0.2 breaking）+ 全部 11 个 H* 组件页（示例/API/a11y）；TW4 + styles 演示；docs.yml 部署 Pages；README/homepage 与 frontend spec 同步。本地 npm run docs:dev；线上 happier-x.github.io/happier-ui（需 Pages Source=Actions）。npm-publish 仍 in_progress。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `aa6fd18` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete

---

**Date**: 2026-07-24
**Task**: 图标按钮 HIconButton（07-24-icon-button）
**Branch**: `master`

### Summary

新增独立组件 HIconButton：结构与无障碍独立于 HButton，variant 配色与状态复用同一 CSS 规则源（button.css 合并 `.h-button--*` / `.h-icon-button--*` selector，icon-button.css 只保留结构/尺寸/形状）。icon 必填、ariaLabel 类型层面必填并输出原生 aria-label，内部图标 aria-hidden。7 variant × sm/md/lg（32/40/48 正方形）× square/circle 形状。导出 + playground 演示段 + docs/components/icon-button.md + 侧栏 + frontend spec（当前导出/API/a11y/反模式/路线图）同步；从「已移除」清单移出。

### Main Changes

- `src/components/HIconButton.vue` 新增：props(icon 必填/ariaLabel 必填/variant/size/shape/disabled/type)，emit click，内部经 HIcon 渲染，iconSize 透传 size。
- `src/styles/components/icon-button.css` 新增：结构/尺寸(复用 --h-button-height-*)/形状(square=--h-radius-control, circle=--h-image-radius-full)；variant/disabled/focus-visible 合并进 button.css 单一来源。
- `src/index.ts` 导出 HIconButton；`src/styles/components.css` 追加 @import。
- `playground/src/App.vue` 演示段：variant×size×shape 矩阵 + disabled + X 关闭示例。
- `docs/components/icon-button.md` + 侧栏；`.trellis/spec/frontend/component-guidelines.md` 多表同步。

### Key Decision / Gotcha

- 独立组件而非 HButton iconOnly：ariaLabel 类型必填是核心价值。
- vue-tsc 会把模板里的 `aria-label` 当原生 ARIA 属性、不满足必填 camelCase prop；TS 项目须用 `ariaLabel` / `:ariaLabel` 传入（组件内部仍输出原生 aria-label）。已记入 spec 反模式。
- variant 配色合并单一 selector 源，避免两份颜色定义漂移；CSS 产物 37.18→36.18kB。

### Testing

- `npm run build:playground`（vue-tsc + vite）通过。
- `npm run docs:build` 通过。
- `npm run build:lib` 通过；dist .d.ts 含 HIconButton.ariaLabel 必填。

### Status

[OK] **Completed**

### Next Steps

- 提交本任务改动；archive 07-24-icon-button。

---

## 07-25 HRange 事件契约完善

### Changed

- `src/components/HRange.vue`：新增 `change`、`drag-start`、`drag-end` emit。
  - `change`：用户完成交互（松手/回车/失焦/点击轨道）时触发一次；programmatic 写入不触发；disabled 态不触发。
  - `drag-start`：pointerdown / 键盘方向键（Arrow*/Home/End）按下时触发。
  - `drag-end`：pointerup / 键盘失焦（blur）时触发；时序上先于或与 change 一致。
  - 所有事件 payload 走 `normalize()` 统一归一化（夹取 + step 对齐 + 浮点修约）。
  - 新增 `isDragging` ref 追踪交互状态，防止键盘+pointer 交叉重复触发。
- `docs/components/range.md`：更新 Emits 表，新增 `change`/`drag-start`/`drag-end` 说明。
- `.trellis/spec/frontend/component-guidelines.md`：同步 API 约定表。

### Build Verification

- `npm run build:lib` ✓（dist/components/HRange.vue.d.ts 自动生成 4 个 emit）
- `npm run build:playground` ✓
- `npm run docs:build` ✓
- `npm pack --dry-run` ✓（不含 src/docs/playground/.trellis）

### Notes

- Prev npm published: 0.0.2。已准备好发 0.0.3。
- 提案来自 Muses 项目 `07-24-replace-player-range`。
- 建议发版后 Muses 可正式从 onChange fallthrough 升级到 emit 绑定。

---

## 2026-07-25 — HButton 合并 isIconOnly + 修正 ghost 配色（07-25-button-icononly-ghost）

**Task**: HButton 合并 isIconOnly 并修正 ghost 配色

### 背景 / 决策

对齐 HeroUI Native：图标按钮不是独立组件，而是 Button 的 `isIconOnly` 能力（`.button__root--is-icon-only`: `padding:0; aspect-ratio:1`，图标作 children）。同时 HeroUI 的 ghost 是「透明底 + `--color-default-foreground` 墨色字」，本库先前做成主色蓝字 + 主色柔光底（偏 light/secondary），视觉不一致。据此删除 HIconButton，能力并入 HButton；ghost 改回透明底 + 墨色字。

### 改动

- `src/components/HButton.vue`：新增 `isIconOnly`(默认 false) / `shape`('square'|'circle', 默认 square) / `ariaLabel`。isIconOnly 时输出 `.h-button--icon-only` + `.h-button--{shape}`，图标走默认 slot（不渲染 label/leading/trailing）；`:aria-label` 直接绑定。
- `src/styles/components/button.css`：
  - 共享 selector 从 `.h-button, .h-icon-button` 收敛为仅 `.h-button`（disabled/focus-visible/全部 variant）。
  - ghost 修正：文字 `--h-color-primary` → `--h-color-ink`；按下态 `--h-color-playing-bg-soft`(主色柔光) → `--h-color-surface-secondary`(中性)。
  - 并入 icon-only：`padding:0; aspect-ratio:1; flex-shrink:0`；sm/md/lg 宽度复用 `--h-button-height-*`；square=`--h-radius-control`，circle=`--h-image-radius-full`；`.h-button--icon-only svg { width/height: 1.35em }` 让 slot 图标居中。
- 删除 `src/components/HIconButton.vue` 与 `src/styles/components/icon-button.css`；`components.css` 移除对应 @import。
- `src/components/HSidebar.vue`：内置折叠按钮改用 `<h-button is-icon-only variant="ghost">` + slot 内 `<h-icon>`；import 从 HIconButton 换成 HButton。
- `src/index.ts`：移除 HIconButton 导出。
- `src/components/HCard.vue`：注释去掉 HIconButton 提及。
- playground `App.vue`：图标段改用 HButton isIconOnly；sidebar footer 同步；import 移除 HIconButton。
- docs：删除 `components/icon-button.md`；`button.md` 增加 isIconOnly / shape 段与 API；`sidebar.md` 折叠按钮示例改 HButton；`.vitepress/config.ts` 移除 IconButton 侧栏项。
- spec `component-guidelines.md`：命名表/导出示例/参考实现/API 约定表(图标按钮行)/a11y 行/当前导出表/路线图/反模式 全部从 HIconButton 收敛到「HButton isIconOnly」。

### Build Verification

- `npm run build:lib` ✓（HSidebar 的 `import.meta.env.DEV` 类型告警为既有，非本次引入，不阻塞）
- `npm run build:playground` ✓（`vue-tsc --noEmit` 通过，确认 isIconOnly/ariaLabel 类型安全）
- grep 源码无 `HIconButton` / `h-icon-button` 残留（仅 archive 历史任务与本任务 PRD 保留）

### Notes

- ghost 现与 HeroUI Native 一致：静态透明底墨色字，按下中性灰底。
- 迁移：宿主 `<h-icon-button :icon="X" ariaLabel="…">` → `<h-button is-icon-only aria-label="…"><h-icon :icon="X" /></h-button>`。


## Session 17: HButton 合并 isIconOnly 并修正 ghost 配色

**Date**: 2026-07-25
**Task**: HButton 合并 isIconOnly 并修正 ghost 配色
**Branch**: `master`

### Summary

对齐 HeroUI Native：图标按钮不再独立组件，改为 HButton 的 isIconOnly(+shape square/circle +ariaLabel)，图标走默认 slot；删除 HIconButton.vue 与 icon-button.css，尺寸/形状规则并入 button.css，配色 selector 收敛为仅 .h-button。修正 ghost 配色：文字 --h-color-primary→--h-color-ink，按下态主色柔光→中性 --h-color-surface-secondary，改回透明底+墨色字。同步 HSidebar/index.ts/HCard 注释/playground/docs/spec。build:lib 与 build:playground(vue-tsc)均通过。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `8be6b02` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 18: 修复文档演示区热力图横向溢出

**Date**: 2026-07-27
**Task**: 修复文档演示区热力图横向溢出
**Branch**: `master`

### Summary

热力图年视图（约53列，~800px）在 VitePress 正文内容区（~688px）横向溢出。根因是 .h-heatmap 为 inline-flex 固有宽度组件，格子边长是设计 token 不宜压缩。修复：给 .vp-doc .h-demo 加 overflow-x: auto，宽内容容器内横向滚动。沉淀 spec：component-guidelines 新增文档演示区宽度约定（固有宽度组件不压缩 token，容器滚动）。docs:build 通过。

### Main Changes

- Detailed change bullets were not supplied; see the summary above.

### Git Commits

| Hash | Message |
|------|---------|
| `c42d1b4` | (see git log) |

### Testing

- Validation was not recorded for this session.

### Status

[OK] **Completed**

### Next Steps

- None - task complete

## Session 19: HButton 补齐 PC 端 hover 交互态

**Date**: 2026-07-27
**Task**: 为所有 button variant 补齐桌面 hover 效果
**Branch**: `master`

### Summary

用户反馈所有 HButton 在桌面端悬停无反馈。根因：button.css 此前只定义了 `:active`（按压）态，没有任何 `:hover` 规则。修复：为每个 variant 新增 `@media (hover: hover) and (pointer: fine)` 包裹的 `:hover` 规则（避免触屏 hover 粘连），形成「hover 浅一档 → active 深一档」层次。icon-only 共用 variant 配色，一并生效。同步在文档新增「交互状态」小节。构建通过（HSidebar 的 import.meta.env 为既有无关告警）。

### Main Changes

- `src/styles/components/button.css`：primary/secondary/tertiary/outline/ghost/danger/danger-soft 各加一段 media-query 包裹的 `:hover`；secondary/tertiary/outline/ghost/danger-soft active 值相应加深；danger 用 opacity（hover 0.8 / active 0.9）。
- `docs/components/button.md`：无障碍上方新增「交互状态」小节，说明 hover 仅精确指针设备生效、hover→active 渐深、disabled 禁用交互态。

### Git Commits

| Hash | Message |
|------|---------|
| (uncommitted) | 待提交 |

### Testing

- `npm run build:lib` 通过（dts 正常生成；HSidebar import.meta.env 为既有告警）。

### Status

[OK] **Completed**

### Next Steps

- 可选：提交改动


## Session 19: feat(tooltip): HTooltip 悬浮提示组件

**Date**: 2026-07-27
**Task**: feat(tooltip): HTooltip 悬浮提示组件
**Branch**: `master`

### Summary

实现 HTooltip 组件：hover/focus/tap 触发、四向定位+边缘翻转、5 color+radius+showArrow、aria-describedby、teleport body。新文件：HTooltip.vue、tooltip.css、docs/components/tooltip.md。修改：index.ts 导出、components.css @import、config.ts 侧栏、App.vue 演示段、component-guidelines.md 规范更新。

### Git Commits

| Hash | Message |
|------|---------|
| `8d5f679` | (see git log) |

### Status

[OK] **Completed**

## Session 20: feat(scrollbar): HScrollbar CSS-only 滚动条组件

**Date**: 2026-07-28
**Task**: feat(scrollbar): HScrollbar CSS-only 滚动条组件
**Branch**: `master`

### Summary

实现 HScrollbar 组件：CSS-only 细窄主题滚动容器，对齐 HeroUI v3 的 `data-scrollbar` 模式 + `--scrollbar-*` token 思路。mode(thin/default/none) + axis(x/y/both) + size(sm/md/lg=4/6/8px) + color(default/primary/success/warning/danger) + ariaLabel；default slot；无 emits；高度由宿主控制。web 端 `::-webkit-scrollbar` 伪元素 + Firefox `scrollbar-width`/`scrollbar-color`；移动端 (`pointer: coarse`) 媒体查询自动回退原生滚动。无 JS thumb、无 ResizeObserver、无 SSR guard。

新文件：HScrollbar.vue、scrollbar.css、docs/components/scrollbar.md。修改：index.ts 导出 HScrollbar + HScrollbarProps、components.css @import、tokens.css 新增 `--h-scrollbar-*`、config.ts 侧栏、App.vue 演示段、component-guidelines.md / tokens.md spec 同步。

### Key Decisions

| 决策 | 理由 |
|------|------|
| CSS-only（不 JS thumb） | 对齐 HeroUI；移动端自动原生惯性；零 SSR |
| `mode` prop → DOM `data-scrollbar` | 与项目 prop 风格一致，DOM 可调试 |
| `color-mix` + rgba 同声明 fallback | 现代优先，旧浏览器退化半透明灰 |
| 高度由宿主控制 | 容器无固定 height，文档/playground 示例明示 |

### Validation

- `vue-tsc --noEmit`（playground）exit 0
- `npm run docs:build` exit 0
- `npm run build:lib` exit 0；`dist/components/HScrollbar.vue.d.ts` props 类型完整、default slot 保留；`dist/styles.css` 合并 scrollbar CSS（64 处 `h-scrollbar`）

### Git Commits

| Hash | Message |
|------|---------|
| `d26eeea` | feat(scrollbar): HScrollbar CSS-only 滚动条组件 |

### Status

[OK] **Completed**

---

## 2026-07-28 · Popup 任务（07-28-popup）完成

### Deliverables

- `src/composables/useScrollLock.ts`（新增，引用计数式 SSR 安全）
- `src/components/HPopup.vue`（新增，6 形态 position + relative JS 定位 + closeable + handle）
- `src/styles/components/popup.css`（新增，BEM + 6 position modifiers + keyframes + safe-area）
- `src/styles/tokens.css` 新增 `--h-popup-*` token 组 + z-index 层级更新
- `src/components/HBottomSheet.vue` 重构为 HPopup(position=bottom) 薄包装（旧 API 不变）
- `src/components/HDialog.vue` 重构为 HPopup(position=center) 薄包装（旧 API 不变；新增 `panelLabelledBy` / `panelDescribedBy` prop 透传保留 aria 关联）
- `src/styles/components/{bottom-sheet,dialog}.css` 减化为向后兼容 stub（规则迁至 popup.css）
- `src/index.ts` 导出 HPopup
- `docs/components/popup.md`（中文 API + 4 用例）+ 侧栏入口
- `.trellis/spec/frontend/{component-guidelines,hook-guidelines,tokens}.md` 更新
- playground `App.vue` 新增 HPopup 演示段（bottom/center/left/right/relative + closeable）

### Key Decisions

| 决策 | 理由 |
|------|------|
| wrapper 常驻（visibility:hidden 关闭态）非 v-if 全根 | 保留 rootEl ref、可捕获 `<Transition @after-leave>` |
| HDialog 自渲 title + description 于 #title slot，不透传 title prop 给 HPopup | 避免 HPopup 内部 `<h2>` 与 wrapper 重复渲染；通过新增 `panelLabelledBy` / `panelDescribedBy` 注入 aria |
| TDZ 修复：useScrollLock 的 enabled 在 visible ref 声明后调用 | arrow function 闭包延迟访问 visible，但 useScrollLock 内 watch 会立即求值 |
| bottom-sheet.css / dialog.css 保留 stub 不删 | 保证消费方 `@import` 路径不炸 |
| 不实现 before-close hook | 受控 v-model 天然拦截，符合规范「不造引擎」 |

### Validation

- `npm run build:lib` exit 0；`dist/styles.css` 含 `--h-popup-*` 全部 token；`dist/index.js` 导出 HPopup；`dist/components/HPopup.vue.d.ts` 生成
- `npm pack --dry-run` tarball 不含 src/playground/docs/.trellis（仅 `dist/HPopup.vue.d.ts`）
- `npm run build:playground` exit 0；新演示段编译通过
- `npm run docs:build` exit 0；`docs/.vitepress/dist/components/popup.html` 中 `aria-labelledby` / `aria-describedby` / `h-popup--position-*` 正确输出

### Git Commits

| Hash | Message |
|------|---------|
| `cda7abc` | feat(popup): HPopup 通用浮层 + HBottomSheet/HDialog 薄包装重构 + useScrollLock |

### Status

[OK] **Completed** — 待 finish-work 归档
