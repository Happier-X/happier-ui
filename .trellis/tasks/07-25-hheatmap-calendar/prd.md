# HHeatmap（日历热力图组件）

## Goal

新增 `HHeatmap` 组件：GitHub 贡献日历风格的热力图，把「按日期的数值序列」渲染成 7 行 × N 列的方格网格，用颜色深浅表达数值大小。视觉对齐 HeroUI Native + `--h-*` token，API 形态参考 NaiveUI `n-heatmap`。

面向的用户价值：宿主传入一段 `{ timestamp, value }` 数据，零配置即可得到一张贡献图风格的日历热力图，直观展示"某天活跃度/数量"的时间分布。

## Background

- **参考对象**：NaiveUI `n-heatmap`（Data Display 类目，GitHub 贡献图风格）。已核对其源码模型：
  - `data: { timestamp: number, value?: number | null }[]`（timestamp 为毫秒数）。
  - **范围由 data 的 min/max timestamp 推断**，不设 `startDate`/`endDate` props；`fillCalendarLeading` 补齐首列前导空日以对齐周首。
  - `DayRect`：`color` + `dayOfWeek`(0=周日) + `rowIndex` + `colIndex`。
  - `firstDayOfWeek: 0-6`；slots：footer / indicator / tooltip 等。
  - 其它 props：`colorTheme`/`activeColors`（色阶）、`size`、`xGap`/`yGap`、`showWeekLabels`/`showMonthLabels`/`showColorIndicator`、`loading`、`unit`。
- **依赖决策**：引入 `dayjs`，作为 `happier-ui` 的**首个 runtime `dependencies`**（非 peer，宿主无需额外安装）。这打破了仓库此前「零运行时依赖」的惯例——需在 spec 记录「日期相关组件可用 dayjs」的新约定。NaiveUI 用 date-fns + lodash-es，本组件仅用 dayjs 做日期解析/加减/格式化。
- **仓库无 HTooltip 组件**（grep 确认）。故 tooltip 用原生 `title` 属性，不自建浮层。
- **Token 现状**：主色 `--h-color-primary: #006FEE`（蓝）、`--h-color-primary-rgb: 0, 111, 238`；`--h-color-surface-secondary: #f4f4f5`（空日底色候选）。
- **组件规范**（`.trellis/spec/frontend/component-guidelines.md`）：`H*.vue` + `withDefaults` + 对象式 `defineEmits` + 具名 slot；`h-*` BEM class；视觉规则写 `src/styles/components/*.css` 的 `@layer components`，数值走 `var(--h-*)`；公共 API 从 `src/index.ts` 导出；`docs/components/` 建文档页；playground 加 demo。
- **验证方式**（无测试框架）：`npm run build:lib`（vue-tsc dts）+ playground `vue-tsc --noEmit`（`npm run build:playground`）+ `npm run docs:build`。

## Requirements

### 数据与范围
- R1. Props `data: HHeatmapData`（= `HHeatmapItem[]`，`HHeatmapItem = { timestamp: number, value?: number | null }`）。同一天多条记录按 value 求和聚合到该日历日。
- R2. 时间范围由 `data` 的 min/max timestamp 推断：起点向前对齐到 `firstDayOfWeek` 的周首，终点向后补齐到周末，中间缺失日渲染为空日（最浅底色）。data 为空时渲染空（不报错）。
- R3. Prop `firstDayOfWeek?: 0-6`（默认 0=周日），决定网格首行是星期几及周首对齐。

### 颜色
- R4. 默认色阶为**基于主色 `--h-color-primary` 的 5 档蓝阶梯**（含空日底色，实际 4 个有值档 + 1 个空/0 档，共 5 级视觉）。用 `--h-color-primary-rgb` + 递增 alpha 实现，随主题走。
- R5. 空日 / `value` 为 0 或 null/undefined 用最浅底色档（`--h-heatmap-empty`，回退 `--h-color-surface-secondary`）。
- R6. Prop `colors?: string[]` 覆盖默认色阶（长度任意，按档均分映射）。传入时优先于默认蓝阶梯。
- R7. value → 档位映射：按数据中的 max value 线性分档（0 独占最浅档，(0, max] 均分到其余档）。

### 布局与标签
- R8. Prop `size?: 'small' | 'medium' | 'large'`（默认 medium），控制格子边长与间距（走 token）。
- R9. Prop `showWeekLabels?: boolean`（默认 true）左侧星期标签、`showMonthLabels?: boolean`（默认 true）顶部月份标签、`showColorIndicator?: boolean`（默认 true）底部 Less→More 图例。
- R10. hover 每格显示原生 `title="YYYY-MM-DD · <value>"`（无值日显示 0 或"无数据"）。

### 状态
- R11. Prop `loading?: boolean`（默认 false）：加载态展示骨架/占位网格（不显数据）。

### 交付物
- R12. `HHeatmap` 从 `src/index.ts` 导出；类型 `HHeatmapData` / `HHeatmapItem` 一并导出。
- R13. 样式写 `src/styles/components/heatmap.css`（`@layer components`），token 补进 `src/styles/tokens.css`（`--h-heatmap-*`）。
- R14. `docs/components/heatmap.md` 有 live demo + API 表；playground 加 demo；组件规范表补一行。
- R15. `dayjs` 加入 `package.json` 的 `dependencies`。

## Acceptance Criteria

- [ ] `HHeatmap` 从 `src/index.ts` 导出，class 前缀 `h-heatmap-*`，数值走 `--h-*` token。
- [ ] 给定一段跨月的日期数值数据，渲染出正确的「周列 × 星期行」网格：起点对齐周首、缺失日为空底色、颜色随 value 深浅分 5 档。
- [ ] `firstDayOfWeek` 改变时首行星期与周首对齐正确。
- [ ] `size` / `showWeekLabels` / `showMonthLabels` / `showColorIndicator` / `loading` / `colors` 各 prop 行为符合上述定义。
- [ ] 每格 `title` 显示「日期 · 数值」。
- [ ] `dayjs` 在 `dependencies` 中；`npm run build:lib` 通过且 dts 含 `HHeatmap` 泛型/类型；`npm run build:playground`（vue-tsc）通过；`npm run docs:build` 通过。
- [ ] `docs/components/heatmap.md` 有 live demo + API 表；playground 有可交互 demo；`component-guidelines.md` 补一行。

## Out of Scope

- 通用矩阵热力图（任意 x/y 类目，非日历）——本次只做日历风格。
- 自建 tooltip 浮层 / 抽取 HTooltip 组件（用原生 `title`）。
- hover 相关的 slot / emit 扩展（`#cell` 自定义单元格、`mouseenter/leave` 事件）——MVP 不做。
- `xGap`/`yGap` 精细间距 prop、`colorTheme` 预设主题名、`unit` 单位后缀、footer/indicator slot——MVP 用 `size` 统一控制间距，图例文案固定 Less/More。

## Resolved Decisions

1. **tooltip** → 原生 `title` 属性，不自建浮层、不加 hover slot/emit。
2. **时间范围** → 按 NaiveUI 模型由 `data` min/max timestamp 推断，不设 startDate/endDate；补齐首列前导空日对齐周首。
3. **日期处理** → 引入 `dayjs`（首个 runtime `dependencies`，打破零依赖惯例，需记 spec）。
4. **色阶** → 基于 `--h-color-primary` 的 5 档蓝阶梯，暴露 `colors` prop 覆盖。
