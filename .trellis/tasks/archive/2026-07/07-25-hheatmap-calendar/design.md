# HHeatmap 技术设计

## 架构总览

单文件组件 `src/components/HHeatmap.vue`，纯计算派生 + 无内部可变状态（loading 只读展示）。数据流单向：`props.data` → 聚合按日 → 推断范围 → 构建周列矩阵 → 每格算档位/颜色 → 渲染。

日期计算全部走 `dayjs`（起止对齐、加减天、格式化、星期几）。

```
props.data ──┐
             ├─► dailyMap (Map<'YYYY-MM-DD', number>)   // 同日 value 求和
firstDayOfWeek┘
             │
             ├─► range { start, end }  // start 向前对齐周首，end 向后补周末
             │
             └─► weeks: DayCell[][]     // 列=周，行=星期(0..6 相对 firstDayOfWeek)
                        │
                        └─ DayCell { date, dateStr, value|null, level, isPad }
```

## 数据契约

```ts
// src/components/HHeatmap.vue 顶部 export（或 src/index.ts 再导出）
export interface HHeatmapItem {
  timestamp: number          // 毫秒时间戳
  value?: number | null
}
export type HHeatmapData = HHeatmapItem[]
```

Props（`withDefaults`）：

| prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `data` | `HHeatmapData` | `[]` | 按日聚合的数值序列 |
| `firstDayOfWeek` | `0\|1\|2\|3\|4\|5\|6` | `0` | 周首（0=周日） |
| `size` | `'small'\|'medium'\|'large'` | `'medium'` | 格子尺寸档 |
| `colors` | `string[]` | `undefined` | 覆盖默认蓝阶梯（不含空日底色，长度=有值档数） |
| `showWeekLabels` | `boolean` | `true` | 左侧星期标签 |
| `showMonthLabels` | `boolean` | `true` | 顶部月份标签 |
| `showColorIndicator` | `boolean` | `true` | 底部 Less→More 图例 |
| `loading` | `boolean` | `false` | 加载占位 |

无 emits（MVP）。无 slots（MVP）。

## 关键算法

### 1. 按日聚合
遍历 `data`，`dayjs(item.timestamp).format('YYYY-MM-DD')` 为 key，value（`?? 0`）累加进 `Map`。记录 `maxValue`（用于分档）。

### 2. 范围推断
- data 为空 → 空网格（`weeks = []`，模板显示空态或空白）。
- 否则：`minTs`/`maxTs` → `start = dayjs(minTs)`、`end = dayjs(maxTs)`。
- `start` 向前退到"最近的 firstDayOfWeek 周首"：`back = (start.day() - firstDayOfWeek + 7) % 7`，`start = start.subtract(back, 'day')`。
- `end` 向后补到该周周末：`fwd = (firstDayOfWeek + 6 - end.day() + 7) % 7`，`end = end.add(fwd, 'day')`。

### 3. 构建矩阵
从 `start` 到 `end` 逐日 `add(1, 'day')`：
- `dateStr = d.format('YYYY-MM-DD')`
- `raw = dailyMap.get(dateStr)`；`isPad`（前导/后补空日，即真实数据区间外）用 `d.isBefore(minDay)||d.isAfter(maxDay)` 判定 → 视觉可略淡或与空日一致。
- `rowIndex = (d.day() - firstDayOfWeek + 7) % 7`。
- 按列推进：每满 7 天进下一列（`colIndex`）。
- `weeks[colIndex][rowIndex] = cell`。

### 4. 分档（level 0..4）
- `level 0`：value 无 / 为 0 → 空底色。
- `maxValue <= 0`：全部 level 0。
- 否则 (0, maxValue] 均分 4 档：`level = Math.min(4, Math.ceil(value / maxValue * 4))`。

### 5. 颜色
- 若 `props.colors` 提供：`colorOf(level)` = `level===0 ? 空底色 : colors[clamp(level-1, 0, colors.length-1)]`。
- 否则用 CSS class `h-heatmap__cell--level-{0..4}`，颜色在 css 里用 `rgba(var(--h-color-primary-rgb), alpha)` 阶梯定义（alpha: 0 档→surface-secondary；1..4 → 0.25 / 0.45 / 0.7 / 1）。
- 有 `colors` 时走内联 `style="background-color"`；否则走 level class（保证纯 CSS 主题化）。

### 6. 月标签
遍历 `weeks`，对每列取该列第一格日期的月份；当月份较上一列变化时，在该列位置渲染月名（`d.format('MMM')` 或本地化短月名）。MVP 用 `dayjs().format('MMM')`（英文短月）或简单映射，避免引 locale 包。

### 7. 星期标签
左列渲染 7 行中 firstDayOfWeek 起的星期名。GitHub 惯例只显示奇数行（Mon/Wed/Fri）以省空间——MVP 显示全部 7 个或隔行显示，取隔行（1,3,5 相对行）更贴 GitHub。

## 样式（src/styles/components/heatmap.css，@layer components）

- 网格用 CSS grid 或 flex 列 + 每列 flex 行。倾向：外层 `display:flex` 横向排周列，每列 `display:grid; grid-template-rows: repeat(7, 1fr)`。
- 格子边长/间距/圆角由 `--h-heatmap-cell-{sm,md,lg}` + `--h-heatmap-gap-*` token 控制，size 类切换。
- level 颜色 class（见上）。
- 月/周标签字号走 `--h-heatmap-label-*`，色 `--h-color-ink-muted`。
- 图例：一排小方块（level 1..4）+ Less/More 文案。
- loading：格子用 `--h-color-surface-secondary` + 可选 pulse 动画（复用现有动画约定，若无则静态占位）。

## Token（src/styles/tokens.css 追加）

```css
--h-heatmap-cell-sm: 10px;
--h-heatmap-cell-md: 12px;
--h-heatmap-cell-lg: 15px;
--h-heatmap-gap: 3px;
--h-heatmap-radius: 2px;
--h-heatmap-empty: var(--h-color-surface-secondary);
--h-heatmap-level-1: rgba(var(--h-color-primary-rgb), 0.25);
--h-heatmap-level-2: rgba(var(--h-color-primary-rgb), 0.45);
--h-heatmap-level-3: rgba(var(--h-color-primary-rgb), 0.7);
--h-heatmap-level-4: rgba(var(--h-color-primary-rgb), 1);
```

## 兼容 / 取舍

- **dayjs 是新 runtime 依赖**：加进 `package.json` `dependencies`（非 peer，宿主无需额外装）。`vite.config` 现有 `rollupOptions.external: ['vue', '@lucide/vue']`——须追加 `'dayjs'`（及用到的 `'dayjs/plugin/*'`，MVP 不用插件则仅 `'dayjs'`），保证 dayjs 不被打进库 bundle、由宿主 node_modules 解析（对齐库最佳实践，避免重复打包）。
- **本地时区聚合**：`dayjs(ts)` 用本地时区，按本地日历日分组，符合"贡献图按当地日"直觉。不做 UTC 归一。
- **月份本地化**：MVP 用 dayjs 默认英文短月，避免引 locale；后续可加 `locale` prop。
- **可访问性**：网格外层 `role="img"` + `aria-label` 概述（如"YYYY-MM-DD 到 YYYY-MM-DD 的活跃度热力图"）；每格 `title` 提供逐日信息。MVP 不做键盘导航。

## 无法自动验证项

- 视觉正确性（颜色梯度、对齐、标签位置）需 playground / docs 人工核对。
- 跨时区/DST 边界仅靠本地日聚合规避，不额外测试。
