# tokens 去 Ionic 依赖 + 独立暗色态（修 #11）

## Goal

让 `happier-ui` 的 token 系统自洽、不依赖宿主框架：把语义颜色 token 里对 Ionic CSS 变量的反向依赖（`var(--ion-*)`）换成库内自定义基色，并新增完整的库自带暗色态，保证在**不引入 Ionic** 的项目里明/暗两态开箱即用。

面向的用户价值：muses 正在移除 Ionic，移除后暗色模式当前整体失效（黑底黑字 / 白底白字）。本任务是「暗色模式不退化」验收项的库级前置。

## Background

- GitHub issue #11。
- **暗色翻转此前完全由 Ionic 承担**：`dark.system.css` 在 `@media (prefers-color-scheme: dark)` 下把 `--ion-text-color` 等翻成暗色值，happier-ui 的 `--h-color-ink` 只是「借」了这些变量。移除 Ionic 后 `--ion-*` 变 undefined → 回退到硬编码浅色 → 暗色失效。
- **确认事实（源码核对）**：
  - `src/styles/tokens.css` 有 **5 处** `var(--ion-*)` 反向依赖：
    - `--h-color-ink: var(--ion-text-color, #000000)`（L31）
    - `--h-color-ink-muted: var(--ion-color-medium, #92949c)`（L32）
    - `--h-color-border-subtle: var(--ion-color-step-150, #e0e0e0)`（L33）
    - `--h-color-cover-placeholder: rgba(var(--ion-color-medium-rgb, 146, 148, 156), 0.16)`（L35）
    - `--h-color-danger: var(--ion-color-danger, #eb445a)`（L39）
  - 库源码 **完全没有** `prefers-color-scheme` 或 `.dark`——0.0.4 无任何库自带暗色态。
  - `--h-color-surface: #ffffff`、`--h-color-surface-secondary: #f4f4f5` 为硬编码浅色，无暗色覆盖。
  - `--h-color-surface-dark: #1f1f1f` 已存在，但仅沉浸播放/Muses 存量用途，不构成完整暗色主题。
  - `--h-color-success: #17c964`、`--h-color-warning: #f5a524` 为库内自定义（不依赖 Ionic）。
  - `theme.css` 把上述语义色桥接为 `@theme` 的 `--color-h-*` utility（`--color-h-ink` 等）；token 值变化会自动透传，无需改 theme.css。
  - **VitePress docs 自身用 `.dark` 类**（挂 `<html>`）做 appearance 切换：若库暗色态支持 `.dark` 类选择器，docs live demo 会自动跟随 VitePress 明暗切换。
- **依赖边界**：本任务不引入任何新依赖，纯 CSS token 重构（`src/styles/tokens.css` + 可能 `theme.css`）。

## Requirements

### 去 Ionic 依赖
- R1. 5 处 `var(--ion-*)` 全部替换为库内自定义基色（保留原 fallback 的视觉观感为浅色态默认值）。替换后 `src/styles/tokens.css` 不再出现 `--ion-` 字样。
- R2. `--h-color-danger` 用库内基色（延续 `#eb445a` 观感或对齐 HeroUI danger）；`--h-color-danger-rgb` 同步。

### 暗色态
- R3. 新增库自带暗色态：`--h-color-surface`/`surface-secondary`/`ink`/`ink-muted`/`border-subtle`/`separator`/`cover-placeholder` 等在暗色下取可读的暗色值（暗底亮字）。
- R4. 暗色触发策略 = **方案 C（media + class）**：`@media (prefers-color-scheme: dark)` 跟系统偏好做默认翻转；同时提供 `:root.dark` / `.dark` 类选择器允许消费方手动覆盖（应用内主题开关）。为支持「手动切回浅色」，media 块内的暗色覆盖需能被 `.light` 类还原——实现细节见 design.md。
- R5. 明/暗两态在不引入 Ionic 的项目里开箱即用，对比度可读（surface 与 ink 有足够对比）。

### 兼容
- R6. 不改 `--h-*` token 名、`h-*` class 名、组件结构；仅改 token 取值与新增暗色覆盖块。
- R7. `--muses-*` 别名继续指向对应 `--h-*`，Muses 存量样式不破。
- R8. 三个 build 通过（`build:lib` / `build:playground` / `docs:build`；HSidebar `ImportMeta.env` 预存在报错除外）。

## Acceptance Criteria

- [ ] `src/styles/tokens.css` 全文无 `--ion-` 引用。
- [ ] 明色态视觉与 0.0.4 一致（surface 白、ink 黑、danger 红观感不变）。
- [ ] 存在库自带暗色态：切到暗色时 surface 变暗、ink 变亮，组件（button/card/cell/input/table/heatmap 等）在暗色下可读。
- [ ] 暗色触发按最终选定策略生效（media / class / 两者）。
- [ ] playground 可切换或系统偏好下目视验证明/暗两态。
- [ ] 三个 build 通过。
- [ ] spec（tokens.md）记录：token 不依赖 Ionic + 暗色态触发约定。

## Out of Scope

- issue #10（layer 顺序，已独立完成）。
- 组件级逐个暗色微调超出「token 层翻转即可读」的范围（如某组件暗色下特殊处理，另开任务）。
- 移除 `--muses-*` 别名（保留兼容）。
- 主题定制 API（多主题、自定义主色运行时切换）——本次只做明/暗两态。

## Key Decisions

1. **暗色触发策略 = 方案 C**（已确认）：`@media (prefers-color-scheme: dark)` + `.dark`/`.light` 类覆盖。理由：muses 需应用内主题开关（A 不够用）；C 对只想跟系统的消费方仍零配置，对要手动切的留 class 覆盖口子；docs 的 VitePress `.dark` 亦可直接联动 live demo。代价：暗色取值需写两处触发（media 块 + class 选择器）。
