# 新增底部导航栏组件

## Goal

新增纯 Vue **`HTabBar`**：固定底栏、多项图标+文案、`v-model`（string key）选中态、safe-area、`--h-*`；导出 + playground + spec。  
**不**内置 Vue Router / 导航栈。

## 背景

- 当前导出：`HButton`、`HSwitch`、`HBottomSheet`、`HDialog`、`HInput`、`HCheckbox`、`HEmpty`、`HImage`、`HIcon`、tokens。
- tokens 已有 `--h-tab-bar-height: 64px`、`--h-z-tab`。
- 命名 **`HTabBar`**；`:items` 数组；`modelValue: string`（item `key`）；图标为 **组件**（内部 `HIcon`）。

## MVP 需求

| 能力 | 约定 |
|------|------|
| 命名 | 导出 `HTabBar`；类名 `h-tab-bar` / `h-tab-bar__*` |
| 项 | `items: { key: string; label?: string; icon?: Component; disabled?: boolean }[]` |
| 选中 | `modelValue?: string` + `update:modelValue`（等于 `item.key`） |
| 图标 | 可选 `icon` 为 Vue/Lucide 组件；内部用 `HIcon` 渲染；无 icon 则仅文案 |
| 布局 | `fixed?: boolean` 与 `safeArea?: boolean` **默认都为 `true`**；分别控制固定底部和 `env(safe-area-inset-bottom)`；两者可独立关闭 |
| 视觉 | 未选 muted、选中 primary；`--h-tab-bar-height` / z-index；无 elevation |
| a11y | `<nav aria-label>`；项为 `<button>`；选中 `aria-current="page"` |
| 导出 / 演示 | playground 4 项 + 当前 key 回显（Lucide + HIcon） |
| 文档 / spec | README + component-guidelines / tokens / quality |

## 明确不做

- 不内置 Vue Router / 导航栈
- 不做 `HTabBarItem` 子组件 / 按 key 的 icon slot
- 不做中间凸起大按钮
- 不做 Ionic Tabs 引擎
- 不改 Muses

## Acceptance Criteria

- [x] 存在 `src/components/HTabBar.vue` 并导出 `HTabBar`
- [x] `:items` + `v-model`（string key）切换选中；disabled 项不可选
- [x] playground 可演示；safe-area + `--h-*`
- [x] `npm run build:playground` 通过
- [x] 更新 README / component-guidelines / tokens / quality

## Notes

- 中等任务：见 `design.md` / `implement.md`。
