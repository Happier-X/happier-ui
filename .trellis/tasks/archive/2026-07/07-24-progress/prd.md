# 新增 HProgress 进度条组件

## Goal

为 Web 与移动端 Vue 宿主提供进度指示控件（线形进度条），用于展示任务完成度、加载进度等场景，视觉与 happier-ui 现有 HeroUI Native 风格保持一致。

## Background

- 公共组件使用 `H*` 命名、`h-*` BEM 类，并从 `src/index.ts` 导出。
- 视觉样式集中在 `src/styles/components/*.css`，所有新增数值使用 `--h-*` token；模板不写大块 scoped 视觉 CSS。
- 新组件必须提供 playground 演示，并同步组件文档 `docs/components/progress.md` 与前端组件规范 `component-guidelines.md`。
- 现有轨道类组件 `HRange` 用 `input[type=range]` 处理「可交互取值」；HProgress 是纯展示的进度指示，不接受用户拖动，语义为 `role="progressbar"`。
- 语义色 token 已就位：`--h-color-primary` / `--h-color-success` / `--h-color-warning` / `--h-color-danger`；圆角 `--h-radius-pill`；轨道背景可复用 `--h-color-surface-secondary`。

## Requirements

- 提供 `HProgress` 线形进度条组件，通过 `value` 控制进度（0–`max`，默认 `max=100`）。
- 支持确定进度（determinate）与不确定进度（indeterminate）两种模式；`indeterminate` 时忽略 `value`，展示循环动画。
- 越界 `value` 夹取到 `[0, max]`；对应百分比驱动填充宽度。
- 支持 `size`：`sm | md | lg`，默认 `md`（仅影响轨道高度）。
- 支持 `variant` 语义色：`primary | success | warning | danger`，默认 `primary`。
- 支持 `rounded`（pill 圆角）开关，默认圆角。
- 具备 `role="progressbar"` 与 `aria-valuenow / aria-valuemin / aria-valuemax`（indeterminate 时省略 `aria-valuenow`）；支持 `ariaLabel` 为无可见标签场景提供名称。
- 视觉均走 `--h-*` token，尊重 `prefers-reduced-motion`（关闭 indeterminate 动画）。
- 在 playground 展示确定/不确定、尺寸、语义色，并新增公共组件文档与规范同步。

## Acceptance Criteria

- [x] 宿主可通过 `value` + `max` 展示进度，填充宽度与百分比一致；越界值被夹取。
- [x] `indeterminate` 模式展示循环动画且不依赖 `value`。
- [x] `size` 影响轨道高度；`variant` 切换语义色；`rounded` 控制圆角。
- [x] 具备 `role="progressbar"` 与 `aria-value*` 语义及可访问名称。
- [x] `prefers-reduced-motion` 下关闭 indeterminate 动画。
- [x] 组件、样式、导出、playground、文档和规范同步完成。
- [x] 类型检查与构建（`npm run build:playground`）通过。

## Out Of Scope

- 环形/圆形进度（circular progress）。
- 进度内嵌文字标签、分段（segmented/steps）、缓冲区（buffer）双层进度。
- 与路由、网络请求或状态管理库绑定。
