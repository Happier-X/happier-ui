# HHeatmap 实现计划

## 前置

- 读 `.trellis/spec/frontend/component-guidelines.md`（SFC 结构、命名、导出、样式约定）。
- 参考实现：`src/components/HProgress.vue`（纯派生只读组件、withDefaults、computed 派生）、`src/components/HTable.vue`（表格网格 + level/slot 派生）。
- 参考样式：`src/styles/components/*.css` 的 `@layer components` 写法、token 引用方式。

## 有序清单

1. **加依赖 dayjs**
   - `npm install dayjs`（进 `dependencies`，pin 精确版本或 `^` 视仓库惯例，检查现有 devDeps 用 `^`）。
   - `vite.config.*`：`rollupOptions.external` 追加 `'dayjs'`。
   - 验证：`npm run build:lib` 后检查 `dist/index.js` 未内联 dayjs（`grep -c "dayjs" dist/index.js` 应为 import 引用而非源码）。

2. **组件 `src/components/HHeatmap.vue`**
   - `<script setup lang="ts">`：`import dayjs from 'dayjs'`。
   - 导出 `HHeatmapItem` / `HHeatmapData` 接口（`export interface`）。
   - `withDefaults(defineProps<{...}>(), {...})`：data `[]`、firstDayOfWeek `0`、size `'medium'`、colors `undefined`、show* `true`、loading `false`。
   - computed：`dailyMap` + `maxValue`；`range`（对齐周首/周末）；`weeks: DayCell[][]`；`monthLabels`（列→月名）；`weekLabels`。
   - `levelOf(value)` / `colorStyleOf(cell)`（有 colors 走内联 style，否则空对象 + level class）。
   - 模板：外层 `.h-heatmap` + size class + `role="img"` + `aria-label`；月标签行；主体 flex（左侧周标签列 + 周列网格）；每格 `.h-heatmap__cell` + `h-heatmap__cell--level-{n}` + `:title`；底部图例（showColorIndicator）；loading 态。

3. **样式 `src/styles/components/heatmap.css`**
   - `@layer components`。
   - `.h-heatmap` 布局；`.h-heatmap--{small,medium,large}` 切 cell 尺寸；`.h-heatmap__cell` 边长/圆角/间距；level 0..4 背景；标签/图例样式。
   - 引用 `var(--h-heatmap-*)` token。

4. **Token `src/styles/tokens.css`**
   - 追加 `--h-heatmap-cell-{sm,md,lg}` / `--h-heatmap-gap` / `--h-heatmap-radius` / `--h-heatmap-empty` / `--h-heatmap-level-{1..4}`（基于 `rgba(var(--h-color-primary-rgb), a)`）。
   - 确认 `--h-color-primary-rgb` 已存在（tokens.css 第 24 行 `0, 111, 238`）。

5. **样式注册**
   - 检查 `src/styles/components/*.css` 如何被聚合导出（`emitHappierUiStyles` 插件 / index.css）。找到 heatmap.css 需被 import 的入口并登记（对齐其他组件 css 的引入方式）。

6. **导出 `src/index.ts`**
   - `export { default as HHeatmap } from './components/HHeatmap.vue'`。
   - 若类型需公开：`export type { HHeatmapItem, HHeatmapData } from './components/HHeatmap.vue'`（对齐 HTable 的类型导出方式，先查 HTable 怎么导出 HTableColumn）。

7. **文档 `docs/components/heatmap.md`**
   - 顶部 `<script setup>`：造一年样例 data（随机/固定），import HHeatmap。
   - live demo：基础、不同 size、firstDayOfWeek、自定义 colors、loading。
   - API 表：Props（data/firstDayOfWeek/size/colors/show*/loading）、类型（HHeatmapItem/HHeatmapData）。
   - 在 docs 导航/侧边栏登记页面（检查 `docs/.vitepress/config.*` 的 sidebar）。

8. **Playground `playground/src/App.vue`**
   - 加 HHeatmap demo（造样例数据 + 展示基础用法）。

## 验证命令

```bash
npm run build:lib          # 库构建 + dts；确认 dist 有 HHeatmap 类型、dayjs 未内联
npm run build:playground   # vue-tsc --noEmit 类型检查 + 构建
npm run docs:build         # VitePress SSR + client 构建
```

- 已知无关报错：`src/components/HSidebar.vue:119` `ImportMeta.env` TS2339——预存在，不阻断，不修。
- 人工核对（playground/docs dev）：网格对齐、颜色梯度、月/周标签位置、title 内容、图例。

## 风险 / 回滚点

- **dayjs external 配置错**：若忘记加 external，dayjs 被打进 bundle，体积虚增且可能与宿主重复。回滚：还原 vite.config。
- **样式聚合入口找错**：heatmap.css 没被引入 → 组件无样式。需先确认现有 css 聚合机制再落 css。
- **月标签错位**：列→月映射边界（月初那列）易差一列，playground 目视校准。
- **范围对齐差一天**：周首/周末对齐的 `% 7` 公式需用真实数据（跨年、firstDayOfWeek=1）核对首末列。

## 提交前

- 三个 build 全绿（除已知 HSidebar 报错）。
- spec 更新：`component-guidelines.md` 加 HHeatmap 行 + API 约定行；记录「dayjs 作为首个 runtime 依赖，日期组件可用」的新约定。
- 文档页已登记进 sidebar。
