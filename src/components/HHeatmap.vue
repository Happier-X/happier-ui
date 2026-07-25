<template>
  <div
    class="h-heatmap"
    :class="`h-heatmap--${size}`"
    role="img"
    :aria-label="ariaLabel"
  >
    <!-- Loading 占位 -->
    <div v-if="loading" class="h-heatmap__loading" aria-hidden="true">
      <div class="h-heatmap__body">
        <div v-if="showWeekLabels" class="h-heatmap__week-labels">
          <span
            v-for="(label, i) in weekLabels"
            :key="`wl-${i}`"
            class="h-heatmap__week-label"
          >{{ label }}</span>
        </div>
        <div class="h-heatmap__grid">
          <div
            v-for="col in loadingCols"
            :key="`lc-${col}`"
            class="h-heatmap__col"
          >
            <span
              v-for="row in 7"
              :key="`lr-${col}-${row}`"
              class="h-heatmap__cell h-heatmap__cell--loading"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 主体 -->
    <template v-else>
      <div class="h-heatmap__body">
        <!-- 左侧星期标签列 -->
        <div v-if="showWeekLabels" class="h-heatmap__week-labels">
          <span
            v-for="(label, i) in weekLabels"
            :key="`wl-${i}`"
            class="h-heatmap__week-label"
          >{{ label }}</span>
        </div>

        <!-- 右侧：月标签行 + 周列网格 -->
        <div class="h-heatmap__main">
          <div v-if="showMonthLabels" class="h-heatmap__month-labels">
            <span
              v-for="(label, colIndex) in monthLabels"
              :key="`ml-${colIndex}`"
              class="h-heatmap__month-label"
            >{{ label }}</span>
          </div>

          <div class="h-heatmap__grid">
            <div
              v-for="(week, colIndex) in weeks"
              :key="`col-${colIndex}`"
              class="h-heatmap__col"
            >
              <span
                v-for="(cell, rowIndex) in week"
                :key="`cell-${colIndex}-${rowIndex}`"
                class="h-heatmap__cell"
                :class="cell ? `h-heatmap__cell--level-${cell.level}` : 'h-heatmap__cell--blank'"
                :style="cell ? cellStyle(cell) : undefined"
                :title="cell ? cellTitle(cell) : undefined"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 图例 -->
      <div v-if="showColorIndicator" class="h-heatmap__indicator">
        <span class="h-heatmap__indicator-text">Less</span>
        <span
          v-for="level in indicatorLevels"
          :key="`ind-${level}`"
          class="h-heatmap__cell"
          :class="`h-heatmap__cell--level-${level}`"
          :style="colors ? colorStyleForLevel(level) : undefined"
          aria-hidden="true"
        />
        <span class="h-heatmap__indicator-text">More</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * happier-ui：GitHub 贡献图风格的日历热力图。
 * - data: { timestamp, value }[]，同一天多条记录按 value 求和聚合到该日历日。
 * - 时间范围由 data 的 min/max timestamp 推断：起点向前对齐周首、终点向后补齐周末。
 * - 颜色深浅表数值大小；默认基于主色的 5 档蓝阶梯（level 0..4），colors prop 可覆盖。
 * - 纯派生只读组件；无 emits、无 slots（MVP）；tooltip 用原生 title 属性。
 */
import { computed } from 'vue'
import dayjs from 'dayjs'

export interface HHeatmapItem {
  /** 毫秒时间戳 */
  timestamp: number
  value?: number | null
}
export type HHeatmapData = HHeatmapItem[]

interface DayCell {
  dateStr: string
  value: number | null
  level: number
  /** 前导/后补空日：真实数据区间之外用于对齐周首/周末 */
  isPad: boolean
}

const props = withDefaults(defineProps<{
  data?: HHeatmapData
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  size?: 'small' | 'medium' | 'large'
  colors?: string[]
  showWeekLabels?: boolean
  showMonthLabels?: boolean
  showColorIndicator?: boolean
  loading?: boolean
}>(), {
  data: () => [],
  firstDayOfWeek: 0,
  size: 'medium',
  colors: undefined,
  showWeekLabels: true,
  showMonthLabels: true,
  showColorIndicator: true,
  loading: false,
})

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** 按日聚合 + 记录 max value 与真实数据区间 */
const aggregated = computed(() => {
  const map = new Map<string, number>()
  let minTs: number | null = null
  let maxTs: number | null = null
  for (const item of props.data) {
    if (!Number.isFinite(item.timestamp)) continue
    const d = dayjs(item.timestamp)
    const key = d.format('YYYY-MM-DD')
    const v = item.value ?? 0
    map.set(key, (map.get(key) ?? 0) + v)
    if (minTs == null || item.timestamp < minTs) minTs = item.timestamp
    if (maxTs == null || item.timestamp > maxTs) maxTs = item.timestamp
  }
  // 从最终聚合值求 max（避免用累加中间值，兼容负值）
  let maxValue = 0
  for (const v of map.values()) {
    if (v > maxValue) maxValue = v
  }
  return { map, maxValue, minTs, maxTs }
})

/** value → 档位 0..4 */
const levelOf = (value: number | null): number => {
  const maxValue = aggregated.value.maxValue
  if (value == null || value <= 0) return 0
  if (maxValue <= 0) return 0
  return Math.min(4, Math.ceil((value / maxValue) * 4))
}

/** 构建周列矩阵：列=周，行=星期(0..6 相对 firstDayOfWeek) */
const weeks = computed<DayCell[][]>(() => {
  const { map, minTs, maxTs } = aggregated.value
  if (minTs == null || maxTs == null) return []

  const minDay = dayjs(minTs).startOf('day')
  const maxDay = dayjs(maxTs).startOf('day')

  const back = (minDay.day() - props.firstDayOfWeek + 7) % 7
  const start = minDay.subtract(back, 'day')
  const fwd = (props.firstDayOfWeek + 6 - maxDay.day() + 7) % 7
  const end = maxDay.add(fwd, 'day')

  const cols: DayCell[][] = []
  let cursor = start
  let col: DayCell[] = []
  while (!cursor.isAfter(end)) {
    const dateStr = cursor.format('YYYY-MM-DD')
    const raw = map.get(dateStr)
    const value = raw == null ? null : raw
    const isPad = cursor.isBefore(minDay) || cursor.isAfter(maxDay)
    col.push({ dateStr, value, level: levelOf(value), isPad })
    if (col.length === 7) {
      cols.push(col)
      col = []
    }
    cursor = cursor.add(1, 'day')
  }
  if (col.length > 0) cols.push(col)
  return cols
})

/** 顶部月标签：当某列首格月份变化时在该列显示月名 */
const monthLabels = computed<string[]>(() => {
  const labels: string[] = []
  let prevMonth = -1
  for (const week of weeks.value) {
    const first = week[0]
    if (!first) {
      labels.push('')
      continue
    }
    const m = dayjs(first.dateStr).month()
    if (m !== prevMonth) {
      labels.push(MONTH_NAMES[m])
      prevMonth = m
    } else {
      labels.push('')
    }
  }
  return labels
})

/** 左侧星期标签：7 行，从 firstDayOfWeek 起；GitHub 惯例隔行显示（保留 1,3,5 相对行） */
const weekLabels = computed<string[]>(() => {
  const labels: string[] = []
  for (let i = 0; i < 7; i++) {
    const dow = (props.firstDayOfWeek + i) % 7
    // 隔行显示：相对行 1/3/5 显示，其余留空对齐
    labels.push(i % 2 === 1 ? WEEKDAY_NAMES[dow] : '')
  }
  return labels
})

/** 加载态占位列数 */
const loadingCols = computed(() => Array.from({ length: 20 }, (_, i) => i))

/** 图例档位（1..4） */
const indicatorLevels = [1, 2, 3, 4]

/** 有 colors 时的内联背景色（level 0 用空底色，其余映射 colors） */
const colorStyleForLevel = (level: number): Record<string, string> | undefined => {
  const list = props.colors
  if (!list || list.length === 0) return undefined
  if (level === 0) {
    return { backgroundColor: 'var(--h-heatmap-empty)' }
  }
  const idx = Math.min(Math.max(level - 1, 0), list.length - 1)
  return { backgroundColor: list[idx] }
}

const cellStyle = (cell: DayCell): Record<string, string> | undefined => {
  if (!props.colors) return undefined
  return colorStyleForLevel(cell.level)
}

const cellTitle = (cell: DayCell): string => {
  const valueText = cell.value == null ? '无数据' : String(cell.value)
  return `${cell.dateStr} · ${valueText}`
}

const ariaLabel = computed(() => {
  const { minTs, maxTs } = aggregated.value
  if (minTs == null || maxTs == null) return '活跃度热力图（暂无数据）'
  const from = dayjs(minTs).format('YYYY-MM-DD')
  const to = dayjs(maxTs).format('YYYY-MM-DD')
  return `${from} 到 ${to} 的活跃度热力图`
})
</script>
