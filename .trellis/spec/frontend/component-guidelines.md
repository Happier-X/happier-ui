# Component Guidelines（happier-ui）

## 原则

- 语义组件，不 1:1 镜像 Ionic 标签。
- 不实现导航栈 / Modal / ActionSheet 引擎。
- 图标优先 **slot**；`icon` path + `ion-icon` 仅宿主可选能力。
- 无 elevation；主色与间距来自 `--h-*`。
- 触控热区默认 ≥ 48px（`--h-touch-target`）。

## 当前导出

| 导出 | 文件 |
|------|------|
| `HEmptyState` | `src/components/HEmptyState.vue` |
| `HIconButton` | `src/components/HIconButton.vue` |
| `HListRow` | `src/components/HListRow.vue` |
| `HSettingRow` | `src/components/HSettingRow.vue` |
| `tokens.css` | `src/tokens.css` |

## 路线图

详见任务 `.trellis/tasks/07-22-component-roadmap/prd.md`（P0 打磨 → HButton → HListSection → Form/Notice）。

## 不进库

音乐封面、播放器、业务表单逻辑、Ionic 页壳与路由。
