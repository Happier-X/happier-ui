# Implement — HLoading 加载指示组件（两形态）

## 实施清单（顺序执行）

1. **`src/styles/tokens.css`** — 新增 Loading 段：`--h-loading-size-{sm,md,lg}`、`--h-loading-border-{sm,md,lg}`、`--h-loading-z`、`--h-loading-card-bg/radius/shadow`
2. **`src/styles/components/loading.css`** — 新建：
   - `.h-loading`（flex column 居中、track/thumb 局部变量、垂直排列）
   - `.h-loading__spinner`（圆环 + `@keyframes h-loading-spin` 0.7s linear）
   - `.h-loading--local`（absolute inset-0 覆盖父容器）
   - `.h-loading--global`（fixed inset-0 + `rgba(0,0,0,0.08)` 遮罩）+ `.h-loading--global .h-loading__card`（HUD 卡片：深底/16px 圆角/阴影/白字，卡片内 track/thumb 覆盖为白色系）
   - `.h-loading--{sm,md,lg}` 尺寸修饰符；reduced-motion 分支
3. **`src/styles/components.css`** — `@import "./components/loading.css";`
4. **`src/components/HLoading.vue`** — 新建：
   - props：`mode`（默认 'local'）、`size`（默认 'md'）、`label`、`ariaLabel`
   - 模板：`<Teleport>`（仅 global 形态启用，复用 `useTeleportTarget`）包裹 `.h-loading`（`role="status"` + aria-label 三级回退）；spinner aria-hidden；global 形态包 `.h-loading__card`；`<slot>{{ label }}</slot>` 优先
   - 组件头注释（两形态/API/无障碍说明）
5. **`src/index.ts`** — 导出 `HLoading` + `HLoadingProps` 类型
6. **`src/components/HTable.vue`** — 私有 spinner 替换为 `<h-loading mode="local" size="md" />`（import HLoading；overlay 与 `#loading` slot 保留）
7. **`src/styles/components/table.css`** — 删除 `.h-table__spinner` 与 `@keyframes h-spin`（保留 `.h-table__overlay`）
8. **`playground/src/App.vue`** — HLoading 演示段：
   - local：relative 容器内三档尺寸、label、default slot
   - global：按钮触发/关闭（v-if）、深色 HUD 卡片观感
   - 深色变量覆盖示例（`--h-loading-track/thumb`）
   - HTable loading 态回归（如已有演示）
9. **`docs/components/loading.md`** — 新建文档页（两形态示例 + API 表 + local 需 relative 容器说明）
10. **`docs/.vitepress/config.ts`** — sidebar 组件列表加 `{ text: 'Loading 加载', link: '/components/loading' }`
11. **`.trellis/spec/frontend/component-guidelines.md`** — 命名表 / 参考实现 / API 约定 / 当前导出 / 无障碍行加 HLoading
12. **`.trellis/spec/frontend/tokens.md`** — 分组表加「加载指示」行

## 验证命令

| 检查 | 命令 |
|------|------|
| 目视回归 | `npm run dev:playground` — local 容器内居中（三档/label/slot）、global 全屏浮层（遮罩/HUD 卡片/关闭）、HTable loading 态、深色变量覆盖 |
| 库构建 | `npm run build:lib` |
| 文档构建 | `npm run docs:build` |

## 风险点 / 回滚

- **风险**：HTable 轨道色微调（border-subtle → primary 22%）为预期统一化；HTable `#loading` slot 与 overlay 结构保持不变。
- **回滚点**：新增文件（HLoading.vue / loading.css / loading.md）可直接删；HTable 两处小改可 revert。
- **依赖**：`--h-color-primary-rgb`、`--h-color-surface-dark-rgb` 已存在（上一任务新增 surface-dark-rgb）。
