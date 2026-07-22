# P0 打磨已有组件并新增 HButton / HListSection

## Goal

在 **happier-ui** 内完成首批可交付 UI 增量：打磨现有 4 组件 + tokens，新增 `HButton` 与 `HListSection`，playground 可演示；视觉对齐 **HeroUI Native** 移动端。

**范围已确认：仅 happier-ui 仓库**（选项 A）。Muses 页面替换不在本任务。

## 背景

- 路线图已归档：`.trellis/tasks/archive/2026-07/07-22-component-roadmap/`
- 已有：`HEmptyState`、`HIconButton`、`HListRow`、`HSettingRow`、`tokens.css`
- Spec：`.trellis/spec/frontend/*`（含 tokens / component-guidelines）
- 视觉：直接抄 HeroUI Native；不引 RN；token `--h-*`

## 范围（MVP）

### A. P0 打磨（已有组件）

| 组件 | MVP 要补 |
|------|----------|
| `HIconButton` | `variant`: `default` / `ghost` / `subtle` / `danger` / `on-media`；`disabled` 已有；**loading 可选**；CSS 类保持 `h-icon-button` |
| `HListRow` | `selected`（或沿用/扩展 `playing` 语义文档）；`density`: `comfortable` / `compact`（可选）；slot 规范在 playground 展示 |
| `HSettingRow` | 类名收敛到 `h-setting-row`；`lines` 已有；可选 `interactive`（button 形态 + click） |
| `HEmptyState` | 样式改用 `--h-*`；类名 `h-empty-state`；保留 default 操作槽；可选 compact |
| `tokens.css` | 补齐 button / field / focus / success / warning 等本任务用到的 token（按需，不滥加） |

### B. 新增

| 组件 | MVP |
|------|-----|
| `HButton` | 文字按钮；HeroUI Native 变体子集：`primary` / `secondary` / `tertiary` / `outline` / `ghost` / `danger` / `danger-soft`（可先实现 4–5 个核心：primary、secondary、outline、ghost、danger）；`size`: `sm` / `md` / `lg`；`disabled`；default slot 为 label；可选 leading icon slot |
| `HListSection` | 列表分组容器：`title`/`header` 可选、`inset` / `flat` 表面、default 槽放 rows；无 Ionic |

### C. Playground

- `playground/src/App.vue` 展示上述全部能力（variants 矩阵至少核心几种）。
- `npm run build:playground` 通过。

### D. 明确不做（本任务）

- **不接 Muses 页面替换**（已确认选项 A）。
- 不实现 Modal / ActionSheet / 导航栈。
- 不引入 `@heroui/react-native` / `@ionic/vue`。
- 不实现完整 `HTextButton` 独立组件（`HButton variant="ghost"` 覆盖）。
- 不做完整 loading spinner 设计系统（IconButton loading 可用简单 CSS 或 aria-busy）。

## 约束

1. 样式只消费 `--h-*`；新类前缀 `h-*`；迁移债 `m-*` 本任务尽量消掉。
2. 遵循 `.trellis/spec/frontend/component-guidelines.md` 与 `tokens.md`。
3. 导出：`src/index.ts` 增加 `HButton`、`HListSection`；`M*` 兼容别名按需。
4. 文档语言简体中文；标识符英文。

## Acceptance Criteria

- [x] `HIconButton` 支持约定 variants + playground 演示
- [x] `HListRow` 支持 selected（及文档化 density 若做）+ playground
- [x] `HSettingRow` / `HEmptyState` 类名与 token 收敛到 `h-*` / `--h-*`
- [x] 新增 `HButton` 并导出；核心 variants + sizes 可演示
- [x] 新增 `HListSection` 并导出；inset/flat + header 可演示
- [x] `tokens.css` 补齐本任务所需 token
- [x] `npm run build:playground` 通过
- [x] 更新 `.trellis/spec/frontend/component-guidelines.md` 当前导出表

## Notes

- HeroUI Native Button variants 参考：`primary | secondary | tertiary | outline | ghost | danger | danger-soft`，size `sm|md|lg`（https://www.heroui.com/docs/native/components/button）
- 复杂任务：需 `design.md` + `implement.md` 后再 `task.py start`
