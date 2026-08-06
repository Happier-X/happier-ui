# 新增 HLoading 加载指示组件（对齐 wanchun/mini spinner）

## Goal

新增独立的 `HLoading` 加载指示组件，内置**两种展示形态**：全局 loading（像 toast 一样全屏居中浮层）与局部 loading（容器内居中），对齐 wanchun/mini `w-toast.vue` 的 spinner 观感（同色系轨道 + 顶边的圆环旋转动画）。服务加载中的占位/反馈场景。本任务是上一任务（08-06-toast-hud-style）记录的用户明确后续事项。

## 已确认事实（仓库证据）

- 目标参考（wanchun/mini `w-toast.vue`）：普通 toast 深色 HUD 卡片居中；loading 态 `.w-toast-overlay--solid`（`rgba(0,0,0,0.08)` 微遮罩、阻断）+ `.w-toast-spinner`（32rpx ≈16px 圆环、`rgba(white,0.22)` 轨道 + 白顶边、0.7s linear 旋转）+ 白色文字。
- 现有内部 spinner：`src/styles/components/table.css` `.h-table__spinner`（24px、2px 边框、border-subtle + primary 顶边、0.6s 旋转、`@keyframes h-spin`），仅 HTable loading 态私有使用（`#loading` slot 默认内容 + `.h-table__overlay` 容器：flex 居中、min-height 120px）。
- 组件规范：`src/components/HXxx.vue` + `src/styles/components/xxx.css`（`@layer components`）+ `src/index.ts` 导出 + playground 演示 + docs + spec「当前导出」表；docs sidebar 在 `docs/.vitepress/config.ts`。
- token 可用：`--h-color-primary` / `--h-color-primary-rgb: 0, 111, 238`、`--h-color-ink-muted`、`--h-space-sm`、`--h-font-body-sm`、`--h-color-surface-dark-rgb`（上一任务新增，供 HUD 卡片底引用）；无 loading 专用 token 段。
- HToast 深色 HUD 样式（上一任务）：`--h-toast-bg`（surface-dark-rgb 82%）、`--h-toast-ink`、`--h-toast-radius: 16px`、`--h-toast-shadow` 可参考/复用。
- HProgress 已有 indeterminate（进度条不定态），与 spinner 形态不同。

## Requirements

- [R1·D0] 形态：**HLoading 内置两种展示形态**——`global`（全局/全屏，像 toast 一样居中浮层，对应 wanchun loading toast）与 `local`（局部/容器内居中，对应 HTable、页面区块加载态）。原"纯 spinner 单形态 + 各组件自包 overlay"方案作废；spinner + label/slot 为两种形态内部的公共能力。
- [R1b·D5] global 形态观感：`fixed` 全屏居中 + 极淡遮罩（`rgba(0,0,0,0.08)` 微暗背景、阻断交互）+ **深色 HUD 卡片**（与 HToast 同源：深色半透明底、圆角、柔和阴影）包住 spinner + 白色文字。
- [R1c·D6] local 形态布局：`position: absolute; inset: 0` 覆盖父容器（父容器需 `position: relative`）整体居中；spinner + label **垂直排列**（spinner 上、文字下居中）；默认**无半透明底**（纯居中指示，不遮挡内容）。
- [R1d·D7] 形态 prop：`mode?: 'local' | 'global'`，**默认 `'local'`**（局部加载是更普遍的用法；全局显式传 `mode="global"`）。
- [R2·D2] 尺寸：`size` prop 分 **sm / md / lg**（sm 16px / md 24px / lg 32px），对应 `--h-loading-size-*` 与 `--h-loading-border-*` token（边框 1.5/2/3px 随比例）。
- [R3·D3] 颜色：**无 `color` prop**，默认单色 primary（轨道 `rgba(var(--h-color-primary-rgb), 0.22)` + 顶边 primary）；暴露 `--h-loading-track` / `--h-loading-thumb` 局部 CSS 变量供宿主覆盖（深色场景如 wanchun 白色 spinner）。
- [R4·D4/D8] HTable 复用：HTable **保留自己的 `.h-table__overlay` 容器与 `#loading` slot 语义**，默认内容替换为 `<h-loading mode="local" size="md">`；`table.css` 删除私有 `.h-table__spinner` 与 `h-spin` keyframes。
- [R5] 无障碍：容器 `role="status"` + aria-label（默认"加载中"，`label` 自动采用，`ariaLabel` 显式覆盖）；spinner `aria-hidden` 装饰性；不抢占焦点。
- [R6] 动画：0.7s linear infinite 旋转（对齐 wanchun）；`prefers-reduced-motion: reduce` 下关闭。
- [R7] 纯展示组件，无 emits；`src/index.ts` 导出。

## Acceptance Criteria

- [ ] `npm run dev:playground`：HLoading 演示段覆盖两种形态——`local`（容器内垂直居中，覆盖父容器）与 `global`（全屏 + 微遮罩 + 深色 HUD 卡片 + 白字）
- [ ] 三档尺寸 sm/md/lg（16/24/32px 圆环、边框随比例）；默认观感为 primary 单色圆环（同色系轨道 + 顶边）
- [ ] `mode` 默认 `local`；`global` 显式指定；`size` 默认 `md`
- [ ] `label` prop 与 default slot 均可用，显示在 spinner 下方（垂直排列）；default slot 优先于 `label`
- [ ] global 形态：全屏居中、`rgba(0,0,0,0.08)` 遮罩阻断交互、深色 HUD 卡片（深底/圆角/阴影）、spinner + 白色文字；深色卡片内 spinner 为白色系（覆盖 track/thumb 变量）
- [ ] local 形态：无遮罩无底，绝对定位覆盖父容器（父容器 relative 时生效），spinner + label 垂直居中
- [ ] `role="status"` + aria-label：无 label/ariaLabel 时读"加载中"；有 label 时读 label；ariaLabel 覆盖前两者；spinner `aria-hidden`
- [ ] `prefers-reduced-motion: reduce` 下 spinner 无旋转动画
- [ ] HTable loading 态：overlay 与 `#loading` slot 行为不变，默认渲染 `<h-loading mode="local" size="md">`；`table.css` 无残留 `.h-table__spinner` / `h-spin`
- [ ] `npm run build:lib` 通过；`npm run docs:build` 通过
- [ ] `docs/components/loading.md` 已建且 sidebar 有入口；playground 演示已加
- [ ] `.trellis/spec/frontend/component-guidelines.md`（命名/参考/API 约定/当前导出/无障碍）与 `tokens.md`（加载指示 token 行）已更新

## Out of Scope

- `color` prop / 语义色变体（已确认单色）
- 全局命令式 loading API（声明式组件，宿主 v-if 控制）
- 骨架屏（skeleton）形态
- HHeatmap / HImage 等其他组件的加载态改造（仅 HTable 复用，用户确认）
- HToast 增加 loading 变体（HToast 已按上一任务确认不做；HLoading global 形态承接该需求）

## Notes

- 用户澄清：HLoading 是**两种变体**——全局 loading（像 toast 一样）与局部 loading（页面内居中）；不是单形态 spinner + 各组件自包 overlay。
- HTable 的 loading 与全局 HLoading 是不同层次：HTable 保留自己的 overlay 业务结构，仅复用 HLoading 的 spinner 视觉（mode="local"）。
- global 形态观感与 HToast 深色 HUD 同源（可复用 `--h-toast-*` 观感变量或定义 `--h-loading-*` 对等 token）。
