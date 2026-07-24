# HCell / HCellGroup 实施计划

## 实现步骤

- [x] 新建 `src/components/HCell.vue`：定义 title / description / clickable / showChevron / ariaLabel，prefix / suffix slots，chevron 计算，click 与 Enter/Space 激活，BEM classes 与 ARIA。
- [x] 新建 `src/components/HCellGroup.vue`：定义 title / inset，default / header slots，使用 `useId()` 关联默认标题与 section。
- [x] 在 `src/styles/tokens.css` 增加最小 Cell / CellGroup 高度、内边距、间距、Surface、pressed、chevron 与圆角 token。
- [x] 新建 `src/styles/components/cell.css`：实现 Surface 分组、标题、Cell 布局、prefix/content/suffix/chevron、直接子 Cell 分隔线、clickable pressed/focus-visible 与 reduced-motion。
- [x] 在 `src/styles/components.css` 引入 cell CSS，在 `src/index.ts` 导出 `HCell` / `HCellGroup`；不增加旧组件名或 `M*` 别名。
- [x] 在 `playground/src/App.vue` 增加典型设置页演示：导航行（prefix + suffix value + chevron）、description、控件后缀非 clickable 行、纯展示行、inset=false 分组，并保留现有组件演示。
- [x] 新建 `docs/components/cell.md`：基础示例、导航行、控件后缀、flat 分组、Props / Emits / Slots、直接子元素与嵌套交互约束、无障碍。
- [x] 在 `docs/.vitepress/config.ts` 增加 Cell 导航项。
- [x] 同步 `.trellis/spec/frontend/component-guidelines.md`、`tokens.md`、`quality-guidelines.md` 的导出/API/token/a11y 契约，并继续将旧列表组件标记为已移除且勿恢复。

## 验证

按顺序执行：

```bash
npm run build:playground
npm run docs:build
npm run build:lib
npm pack --dry-run
```

检查点：

- 构建无 Vue / TypeScript / CSS 错误。
- `dist/index.d.ts` 包含 `HCell` 与 `HCellGroup` 导出；`dist/styles.css` 包含 `.h-cell` 与 `.h-cell-group`。
- npm tarball 不包含 `src`、`playground`、`docs`、`.trellis`。
- 目视确认 inset / flat 分组、圆角裁切、行对齐、长 title / description 换行、prefix/suffix 与 chevron 不挤压正文。
- 目视确认只在相邻直接子 Cell 间显示分隔线，最后一行无分隔线。
- 检查 clickable 行的 click、Enter、Space 各触发一次；非 clickable 行不触发且无 role/tabindex。
- 检查 clickable 默认显示 chevron、显式 `showChevron=false` 隐藏、纯展示行显式开启可显示。
- 检查默认 group title 的 `aria-labelledby` 关联；自定义 header 不输出错误引用。
- 检查控件 suffix 示例中 Cell 为非 clickable，开关/复选框自身可聚焦与操作。

## 风险与回滚点

- 嵌套交互是主要语义风险：先实现并验证 clickable 守卫，再加入控件 suffix 示例，禁止 clickable 行包裹交互控件。
- 分隔线是主要组合风险：限定为 group body 的直接子 `.h-cell`，先验证最后一行和有无 prefix 的视觉，再同步文档。
- 长文本和窄屏是主要布局风险：正文 `min-width: 0`，suffix / chevron `flex-shrink: 0`；在 playground 移动宽度检查换行与无重叠。
- 若验证失败，按独立文件边界移除 HCell / HCellGroup 增量；不修改或恢复旧列表组件。