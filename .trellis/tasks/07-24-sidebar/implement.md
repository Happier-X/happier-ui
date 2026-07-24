# HSidebar 执行计划

## 实现顺序

1. **tokens**（`src/styles/tokens.css`）
   - 「布局」或新增「侧边栏（HSidebar）」分组：`--h-sidebar-collapsed-width`、`--h-sidebar-bg`、`--h-sidebar-border`、`--h-sidebar-item-radius`、`--h-sidebar-item-gap`、`--h-sidebar-transition`。
   - 复用现有 `--h-sidebar-width`（240px），不重复定义。
   - 按现有惯例可补 `--muses-sidebar-collapsed-width` 别名。

2. **样式**（`src/styles/components/sidebar.css`，新文件，`@layer components`）
   - `.h-sidebar` / `--collapsed` / `__header` / `__nav` / `__item-wrap` / `__item`（`--active`/`--disabled`）/ `__icon` / `__label` / `__footer` / `__toggle`。
   - `:focus-visible` 焦点环，hover/active/disabled 态，reduced-motion 关过渡。
   - `src/styles/components.css` 追加 `@import "./components/sidebar.css";`。

3. **组件**（`src/components/HSidebar.vue`，新文件）
   - `<template>` → `<script setup lang="ts">`。
   - `export type HSidebarItem`；props（`items` 必填、`modelValue?`、`collapsed?` 默认 false、`showCollapseToggle?` 默认 true、`ariaLabel?` 默认「侧边导航」）。
   - emits：`update:modelValue`、`update:collapsed`。
   - 内部 `HIcon`（item 图标）、`HIconButton`（折叠切换，Lucide `PanelLeftClose`/`PanelLeftOpen`）。
   - `onSelect`（disabled 拦截）、`onToggle`。
   - 折叠态 button `aria-label` 兜底。

4. **导出**（`src/index.ts`）
   - `export { default as HSidebar } from './components/HSidebar.vue'`
   - `export type { HSidebarItem } from './components/HSidebar.vue'`

5. **playground**（`playground/src/App.vue`）
   - 演示段：默认导航 + 选中态、禁用项、header/footer slot、`v-model:collapsed` 折叠切换。
   - state：`sidebarActive`、`sidebarCollapsed`；items 数组。

6. **文档**（`docs/components/sidebar.md` + `docs/.vitepress/config.ts`）
   - 基础、折叠、header/footer、API（Types/Props/Emits/Slots）、无障碍章节。
   - 侧边栏 config 增加 `{ text: 'Sidebar', link: '/components/sidebar' }`。

7. **spec 同步**
   - `.trellis/spec/frontend/component-guidelines.md`：命名表、参考实现、API 约定表、当前导出表、SFC 导出示例增加 HSidebar。
   - `.trellis/spec/frontend/tokens.md`：布局/侧边栏 token 登记。

## 验证命令

```bash
cd C:/code/happier-ui
npm run build:lib          # vite build + vue-tsc dts
npm run build:playground   # vue-tsc --noEmit && vite build
git diff --check
```

## 目视回归清单（playground / docs:dev）

- [ ] 展开态：icon + label 正常，选中项高亮 + `aria-current`。
- [ ] disabled 项不可点、有禁用样式、不 emit。
- [ ] 折叠切换：宽度过渡，label 视觉隐藏，图标仍在，可访问名保留。
- [ ] header/footer slot 内容正确落位。
- [ ] 键盘 Tab 可达每个 item 与折叠按钮，focus-visible 焦点环可见。
- [ ] reduced-motion 下无过渡。

## 风险 / 回滚点

- Lucide 图标名：确认 `PanelLeftClose` / `PanelLeftOpen` 在 `@lucide/vue` 存在；不存在则改用 `ChevronsLeft` / `ChevronsRight`。
- 折叠态 label 隐藏方式：用 `opacity/width/overflow` 而非 `display:none`，避免过渡跳变；可访问名靠 button aria-label 兜底。
- 回滚：纯新增，删除新文件 + 撤销 tokens/import/export/docs/spec 改动即可。
