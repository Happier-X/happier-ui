# HSidebar 无障碍收尾（空名校验 + quality 表登记）

## Goal

补齐 HSidebar 上一轮交付时留下的两个非阻塞项，闭合无障碍契约与规范登记：

1. item 既无 `label` 也无 `ariaLabel` 时缺可访问名——加开发期运行时告警。
2. `quality-guidelines.md` 无障碍最低线表未单列 `HSidebar`——补一行。

## Confirmed Facts（已确认）

- 属 HSidebar 后续迭代，纯增量、无破坏性 API 改动。
- 组件、样式、导出、文档、playground 均已存在且构建通过（上一任务归档：`57127e5`）。
- 现状：`HSidebar.vue` 的 `itemAriaLabel` 在「无 label 且无 ariaLabel」时返回 `undefined`，button 无可访问名，但组件未提示宿主。
- 参照现有惯例：库内无独立 lint/test，验证以 `build:lib` + `build:playground`（含 vue-tsc）+ 目视为准；提交组件里禁止残留 `console.log`（告警用 `console.warn` 且限开发期）。

## Requirements

- **R1 开发期空名告警**：当某 item 同时缺少 `label` 与 `ariaLabel` 时，在开发环境（`import.meta.env.DEV`）输出一次性 `console.warn`，指明缺失的 item key 并提示补 `label` 或 `ariaLabel`；生产构建不输出。
  - 不抛错、不阻塞渲染（保持「契约层约定」的宽松度，仅提醒）。
  - 告警不因每次 render 重复刷屏——按 item key 去重或仅在 items 变化时校验。
- **R2 quality 表登记**：在 `.trellis/spec/frontend/quality-guidelines.md` 的「无障碍最低线」表末尾（`HCellGroup` 之后、图标-only 行之前或之后按语义合适位置）加入 `HSidebar` 行，描述：`nav` + `aria-label`；项为原生 button；选中 `aria-current="page"`；disabled 用原生 `disabled`；折叠态 label 视觉隐藏但 button 输出 `aria-label` 兜底可访问名；无可见 label 项需 `ariaLabel`。

## Acceptance Criteria

- [ ] 开发环境下渲染含空名 item（无 label 且无 ariaLabel）的 HSidebar 时，控制台出现一次明确的 `console.warn`（含 item key）；补上 label 或 ariaLabel 后不再告警。
- [ ] 生产构建（`build:lib`）产物中不包含该告警路径的执行（`import.meta.env.DEV` 守卫），且无残留 `console.log`。
- [ ] 告警不随正常重渲染重复刷屏。
- [ ] `quality-guidelines.md` 无障碍表含 `HSidebar` 行，措辞与组件实际行为、component-guidelines 的无障碍约定一致。
- [ ] `build:lib` + `build:playground`（含 vue-tsc）通过；`git diff --check` 干净。

## Out of Scope

- 把 `ariaLabel` 改为运行时强制/抛错（保持宽松告警）。
- 对其它组件补同类校验（本次只针对 HSidebar）。
- 新增 playground 演示或文档页改动（现有已覆盖；如告警措辞需要示例可在 playground 顺带验证，但非交付项）。

## Key Decisions

- **开发期 `console.warn` 而非抛错**：与库「契约层约定」风格一致，不破坏渲染；用 `import.meta.env.DEV` 守卫，生产零开销。
- **按 key 去重告警**：避免重渲染刷屏；用 `watch` items 或计算属性中一次性校验。
