# 组件库改用 Tailwind CSS

## Goal

将 **happier-ui** 的组件样式体系从「scoped CSS + BEM + `--h-*` 变量」迁移到 **Tailwind CSS v4** 驱动的实现，**分发与主题形态对齐最新 HeroUI（v3）**：组件在 Tailwind 设计系统上构建；消费方接入我们的 token/theme 后，**既能用组件，也能在业务代码里用同一套 token 对应的 utility**。完成后以破坏性 **`0.0.2`** 发布。

## 背景（仓库已确认）

- 11 个公共组件：`HButton` / `HSwitch` / `HBottomSheet` / `HDialog` / `HInput` / `HCheckbox` / `HEmpty` / `HImage` / `HIcon` / `HTabBar` / `HNavBar`，均为 **scoped CSS + BEM**。
- 设计 token 权威源：`src/tokens.css` 的 **`--h-*`**（含 `--muses-*` 兼容别名）。
- 当前库构建：Vite library mode；`0.0.1` 已发布为预编译 `style.css` + `tokens.css`。
- **当前无 Tailwind** 依赖或配置。
- 并行任务：`07-23-npm-publish`（in_progress）——`0.0.1` 已在 registry；本任务定义 `0.0.2` 新形态。
- 视觉仍参考 **HeroUI Native**；实现 Vue 自研，不引 `@heroui/*`。

## 已确认决策

- 任务类型：**复杂**（`design.md` + `implement.md` 评审后再 `task.py start`）
- **不改** props/emits/slots 语义 API；样式接入可破坏
- **分发：HeroUI v3 式 / Tailwind v4 CSS-first**
  - 消费方：`@import "tailwindcss"` + `@import "happier-ui/styles"`（入口以 design 为准）
  - token：CSS 变量权威 + `@theme` → utility
  - 消费方需 **Tailwind CSS ^4**
  - MVP **无** TW v3 plugin
- **Utility 命名：`h-` 命名空间**（`bg-h-primary`、`text-h-ink`、`rounded-h-control`…）
- **组件类名：HeroUI v3 式 BEM**（`.h-button` / `.h-button--primary`）+ `@layer components`
- **发版：破坏性 `0.0.2`**
  - 不 unpublish `0.0.1`；不兼容旧接入；无双轨 shim
  - 真正 `npm publish` 需用户二次确认
- **迁移节奏：B — 先脚手架，再分批组件**
  - 中途不发半成品；全部组件迁完 + 验收后再发 `0.0.2`

## 开放决策

（无。产品决策已收敛；实现细节见 `design.md`。）

## MVP 需求

| 能力 | 约定 |
|------|------|
| 脚手架 | TW v4、styles 入口、`--h-*` + `@theme`、playground 接入 |
| 组件 | 全部 11 个 `H*` 去掉 scoped 长 CSS，改为 BEM + layer components |
| Token 复用 | 消费方可用 `var(--h-*)` 与 `h-` utility |
| 构建 / 文档 | exports、README breaking 说明、spec 更新 |
| 发版 | version `0.0.2`；用户确认后 publish |

## 明确不做

- 不重做组件 JS API / 不引入 Ionic / 不引 `@heroui/*`
- 不强制同步改造 Muses（另任务）
- 不做 TW v3 / `0.0.1` 兼容层
- 不复制 HeroUI 全量组件或 React Aria

## Acceptance Criteria

- [ ] Tailwind v4 脚手架与 styles/token 导出可用；playground 按新方式接入
- [ ] 全部公共 `H*` 样式迁移完成且 playground 可演示
- [ ] `--h-*` 权威 + `@theme` / `h-` utility 契约文档化
- [ ] README 含 TW4 接入、token utility 示例、相对 `0.0.1` 的 breaking 说明
- [ ] `package.json` version `0.0.2`；exports 与构建验证通过
- [ ] frontend spec（tokens / component guidelines 等）已更新
- [ ] props/emits/slots 公共 API 未破坏
- [ ] `0.0.2` 的 `npm publish` 仅在用户明确确认后执行

## Notes

- 检查点顺序见 `implement.md`；设计边界见 `design.md`。
