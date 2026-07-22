# 移除 Empty / IconButton / ListRow / ListSection / SettingRow

## Goal

按用户决策 **C**：从 **happier-ui** 公共 API 与源码中 **删除** 下列组件，不再导出；**保留** `HButton` 与 `tokens.css`。

## 删除清单

| 组件 | 文件 | 兼容导出 |
|------|------|----------|
| `HEmptyState` | `src/components/HEmptyState.vue` | `MEmptyState` |
| `HIconButton` | `src/components/HIconButton.vue` | `MIconButton` |
| `HListRow` | `src/components/HListRow.vue` | `MListRow` |
| `HListSection` | `src/components/HListSection.vue` | （无 M*） |
| `HSettingRow` | `src/components/HSettingRow.vue` | `MSettingRow` |

## 保留

- `HButton` + `src/components/HButton.vue`
- `src/tokens.css` / `happier-ui/tokens.css`
- playground 仅演示 `HButton`（及必要 chrome）

## 同步更新

- `src/index.ts` — 只导出 `HButton`
- `playground/src/App.vue` — 去掉已删组件演示
- `.trellis/spec/frontend/component-guidelines.md` — 当前导出表
- `README.md` — 去掉以 `HIconButton` 为例的接入描述（改为 `HButton`）

## 不做

- 不改 Muses 仓库（消费方需自行停用这些 import；本任务只动 happier-ui）
- 不删除与按钮无关的 token（列表/空态 token 可留，避免无关大改）

## Acceptance Criteria

- [x] 上述 5 个 `.vue` 文件已删除
- [x] `src/index.ts` 仅导出 `HButton`（无 H/M 上述名）
- [x] playground build 通过且页面不引用已删组件
- [x] spec / README 不再把已删组件列为当前导出
- [x] 仓库内（除 archive 任务文档外）无对已删导出名的运行时引用

## Notes

- 破坏性变更；用户已确认 C。
