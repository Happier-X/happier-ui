# Range 滑块组件

## Goal

为 Web 与移动端 Vue 宿主提供数值滑块控件，用于在连续或离散区间内选择数值，视觉与 happier-ui 现有 HeroUI Native 风格保持一致。

## Background

- 公共组件使用 `H*` 命名、`h-*` BEM 类，并从 `src/index.ts` 导出。
- 视觉样式集中在 `src/styles/components/*.css`，所有新增数值使用 `--h-*` token。
- 新组件必须提供 playground 演示，并同步组件文档与前端组件规范。
- 现有单值控件（HSwitch、HCheckbox）采用极简 `v-model` + `size` + `disabled` API。
- 组件路线图早已登记 `HRange`（`.trellis/tasks/archive/2026-07/07-22-component-roadmap/prd.md`），定位为纯 Vue range，用于播放器进度等场景替代 `ion-range`。
- MVP 采用横向单值滑块，基于原生 `input[type="range"]` 保留浏览器拖动、触控和键盘能力。

## Requirements

- 提供 `HRange` 滑块组件，通过 `modelValue` / `update:modelValue` 控制数值。
- 支持 `min` / `max` / `step` 配置区间与步进，越界值需夹取到合法范围。
- 支持原生键盘操作（方向键步进、Home/End 到端点）与 `aria-valuemin/max/now` 滑块语义；支持 `ariaLabel` 为无可见标签场景提供名称。
- 支持 `disabled` 态；`size` 支持 `sm | md | lg`，默认 `md`。
- 已填充轨道、thumb、焦点态视觉均走 `--h-*` token，尊重 `prefers-reduced-motion`。
- 在 playground 展示基础、步进、禁用与尺寸，并新增公共组件文档与规范同步。

## Acceptance Criteria

- [ ] 宿主可通过 v-model 读写数值，拖动与键盘均能改变值并触发更新。
- [ ] `min` / `max` / `step` 生效，越界与非步进值被正确夹取/对齐。
- [ ] `disabled` 态不可交互且视觉可区分。
- [ ] 具备原生 slider role、`aria-valuemin/max/now` 与可访问名称，可通过键盘操作。
- [ ] 组件、样式、导出、playground、文档和规范同步完成。
- [ ] 类型检查与构建通过。

## Out Of Scope

- 双 thumb 区间选择。
- 垂直方向、刻度、浮动 tooltip、内置业务标签或格式化展示。
- 与路由、网络请求或状态管理库绑定。
