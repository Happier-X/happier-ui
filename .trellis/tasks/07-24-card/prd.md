# 卡片组件 HCard

## Goal

为 happier-ui 新增通用卡片容器组件 `HCard`，用于承载分组内容（列表条目、信息块、媒体卡等）。提供统一的表面（surface）、边框、圆角与内边距节奏，视觉观感对齐 HeroUI Native Card，但遵循本项目「无 elevation 阴影」约束——层次靠 border + surface 背景 + 圆角表达。

## Background / Confirmed Facts

- 组件规范（`.trellis/spec/frontend/component-guidelines.md`）：`src/components/H*.vue` + `src/styles/components/*.css`（`@layer components`）+ `src/index.ts` 导出 + `playground` 演示 + `docs/components` 文档页；类前缀一律 `h-*`；SFC 无大块 scoped 视觉 CSS。
- **禁止 Material elevation / box-shadow**（反模式表 + 原则）。卡片层次只能用 `--h-color-border-subtle` 边框、`--h-color-surface` / `--h-color-surface-secondary` 背景、`--h-radius-*` 圆角。
- 现有 token 可复用：`--h-color-surface`(#fff)、`--h-color-surface-secondary`(#f4f4f5)、`--h-color-border-subtle`、`--h-color-separator`、`--h-radius-md`(12px)、`--h-radius-sm`(8px)、`--h-space-sm/md/lg/xl`(8/12/16/24px)、`--h-color-ink` / `--h-color-ink-muted`。
- 插槽约定参考：`HEmpty`（具名 slot + 条件渲染容器）。
- 交互控件由宿主在卡内自行组合（`HButton` / `HIconButton` 等）；本组件不做整卡可点击。

## Key Decisions

- **纯展示容器，无整卡可点击态**：根节点不渲染 `<button>`，无 `clickable` / `disabled` / `click` emit。可点击场景由宿主在卡内放置交互控件完成，避免嵌套交互与无障碍冲突。
- **三个视觉 variant**：`outlined`（默认，surface 背景 + subtle border）、`filled`（secondary surface 背景、无边框）、`flat`（透明背景、无边框）。三者均无 elevation / box-shadow。
- **分区分隔**：`#header` 与 body、body 与 `#footer` 之间，在 `outlined` / `filled` 下用 1px `--h-color-separator` 分隔线；`flat` 下不画线、仅靠间距。分隔线随对应 slot 存在才渲染。
- **根节点语义 `<article>`**：内容分组语义，无整卡交互、无焦点环。

## Requirements

### R1 组件与 API
- 新建 `src/components/HCard.vue`，SFC 结构遵循规范（template → script setup，无大块 scoped 视觉 CSS）。
- 结构：具名 slot `#header` / `#footer` + default（body）；header/footer 缺省不渲染对应容器。
- Props：
  - `variant?: 'outlined' | 'filled' | 'flat'`，默认 `'outlined'`
  - `padding?: 'none' | 'sm' | 'md' | 'lg'`，默认 `'md'`（映射 `--h-space-*`）
  - `radius?: 'sm' | 'md'`，默认 `'md'`
- 无 Emits。

### R2 视觉与状态
- variant 配色复用现有 token，无新增魔法数颜色 / px 间距（新增 `--h-card-*` 语义 token 时，值必须引用现有 `--h-*` token）。
- `outlined`：`--h-color-surface` 背景 + 1px `--h-color-border-subtle` 边框。
- `filled`：`--h-color-surface-secondary` 背景、无边框。
- `flat`：透明背景、无边框。
- 分区分隔：`outlined` / `filled` 用 1px `--h-color-separator` 分隔线（仅当对应 header/footer slot 存在时渲染）；`flat` 用 `--h-space-*` 间距、不画线。
- `padding` 映射：`none`=0 / `sm`=`--h-space-sm` / `md`=`--h-space-md` / `lg`=`--h-space-lg`；作用于各分区内边距。
- `radius` 映射：`sm`=`--h-radius-sm`(8px) / `md`=`--h-radius-md`(12px)。
- 无 elevation / box-shadow。

### R3 导出与集成
- `src/index.ts` 导出 `HCard`。
- `playground/src/App.vue` 增加演示段：variant 矩阵、padding/radius、header/footer 组合。
- 新增 `docs/components/card.md`（示例 + API 表）。
- 更新 `component-guidelines.md`「当前导出」表与 API 约定表。

### R4 无障碍
- 根节点渲染 `<article>`（内容分组语义）。
- 不提供整卡焦点环；卡内交互控件自带 focus-visible。

## Acceptance Criteria

- [ ] `HCard` 为纯展示容器，无 `clickable`/`disabled`/`click` emit。
- [ ] 支持 `#header` / default / `#footer`；缺省 slot 不渲染对应区域容器。
- [ ] 根节点渲染 `<article>`。
- [ ] `variant` 三态渲染正确：`outlined`（白底+描边）/ `filled`（灰底无边）/ `flat`（透明无边），默认 `outlined`。
- [ ] `padding` none/sm/md/lg 与 `radius` sm/md 按映射渲染，复用 `--h-*` token，无 elevation / box-shadow / 魔法数。
- [ ] `outlined` / `filled` 下 header/footer 存在时有 `--h-color-separator` 分隔线；`flat` 无分隔线。
- [ ] `src/index.ts` 导出 `HCard`；playground 有演示段；`docs/components/card.md` 存在且 API 与源码一致。
- [ ] `component-guidelines.md` 的「当前导出」与 API 约定已补入 `HCard`。
- [ ] `npm run build:playground` 通过；改 docs 时 `npm run docs:build` 通过。

## Out of Scope

- 整卡可点击 / pressable / hover 整卡高亮。
- elevation / box-shadow。
- 媒体封面、列表行、设置行等领域卡片（宿主组合）。
- 拖拽、折叠、选中态。

## Notes

- 轻量任务，PRD-only。实现按规范「新组件清单」5 步 + docs 页 + spec 更新执行。
- 所有 UI 决策已收敛，无阻塞未决项。
