# 新增 HEmpty 空状态

## Goal

新增纯 Vue **`HEmpty`**：空列表/空数据占位；`title` / 可选 `description`、可选 `#icon` 与 default 操作槽；`--h-*`；导出 + playground + spec。  
**不**恢复 `HEmptyState` / `MEmptyState`；**不**提供 `compact`。

## 背景

- 当前导出：`HButton`、`HSwitch`、`HBottomSheet`、`HDialog`、`HInput`、`HCheckbox`、tokens。
- 历史 `HEmptyState` 已删除；新名 **`HEmpty`**（`HEmpty.vue`，类前缀 **`h-empty*`**）。
- 收紧高度由宿主外层控制。

## MVP 需求

| 能力 | 约定 |
|------|------|
| 命名 | 导出 `HEmpty`；类名 `h-empty` / `h-empty__*` |
| 标题 | `title: string`（必填） |
| 描述 | 可选 `description?: string` |
| 图标/插图 | 可选 `#icon` slot（不内置插画） |
| 操作 | 可选 default slot（宿主放 `HButton` 等） |
| 布局 | 居中列；单一密度（无 compact prop） |
| 视觉 | `--h-*`（如 min-height / max-width）；无 elevation |
| 导出 / 演示 | `src/index.ts`；playground：纯文案、带 icon、带 action |
| 文档 / spec | README + component-guidelines / tokens / quality；已移除表保留旧 `HEmptyState` 说明且不恢复别名 |

## 明确不做

- 不导出 `HEmptyState` / `MEmptyState` 别名
- **不做 `compact` prop**
- 不内置业务文案 / 路由 / 列表空数据引擎
- 不内置插画资源
- 不引入 Ionic / Material
- 不改 Muses

## Acceptance Criteria

- [x] 存在 `src/components/HEmpty.vue` 并自 `src/index.ts` 导出 `HEmpty`
- [x] playground 可演示 title、description、`#icon`、default 操作槽
- [x] 样式 `h-empty*` + `--h-*`；`npm run build:playground` 通过
- [x] 更新 component-guidelines / tokens / quality / README

## Notes

- **轻量任务：PRD-only**。
- 实现可参考历史 `HEmptyState` 结构，但导出名与类前缀按本 PRD。
