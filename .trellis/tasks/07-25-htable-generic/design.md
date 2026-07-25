# HTable 泛型化 — 技术设计

## 1. 泛型 SFC 声明

```vue
<script setup lang="ts" generic="T extends Record<string, unknown> = Record<string, unknown>">
```

- 约束 `T extends Record<string, unknown>`：保证 `row[col.key]` 索引访问在类型层成立。
- 默认参数 `= Record<string, unknown>`：裸用法 `HTableColumn[]` / `data: Record[]` 继续可用，零破坏。

## 2. 类型定义（导出）

泛型 SFC 内 `export interface` 与顶层 `generic="T"` 的 `T` 不共享作用域，故接口需自带类型参数：

```ts
export interface HTableColumn<T extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof T & string
  title: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: (row: T, index: number) => string | number
}

export interface HTableSort {
  key: string   // 保持 string：sort emit 是运行期契约，跨列聚合，不绑定单一 T 字段
  order: 'asc' | 'desc'
}
```

- `key: keyof T & string`：既约束到 `T` 的字段名，又收窄为 `string`，让 `row[col.key]`、`:key="col.key"`、`String(row[rowKey])` 全部合法。
- 默认参数使 `HTableColumn`（不带尖括号）在旧代码里等价于 `HTableColumn<Record<string, unknown>>`。

## 3. Props / Slots / Emits

```ts
const props = withDefaults(defineProps<{
  columns: HTableColumn<T>[]
  data: T[]
  rowKey?: (keyof T & string) | ((row: T) => string)
  bordered?: boolean
  striped?: boolean
  stickyHeader?: boolean
  emptyText?: string
  loading?: boolean
}>(), { /* 默认值不变；rowKey: 'id' */ })

defineSlots<{
  cell(props: { column: HTableColumn<T>, row: T, index: number }): unknown
  empty(): unknown
  loading(): unknown
}>()

const emit = defineEmits<{ sort: [sort: HTableSort | null] }>()
```

- `rowKey` 默认 `'id'`：当 `T` 无 `id` 字段时，字面量 `'id'` 不满足 `keyof T & string`。为不破坏默认值，`rowKey` 类型保留一层宽松：用 `(keyof T & string) | ((row: T) => string)`，并让默认参数分支下（`Record<string,unknown>`）`'id'` 合法；具体 `T` 若无 `id`，消费方需显式传 `rowKey`。这是可接受的取舍（issue 未要求 rowKey 强约束）。
  - 实测：若 `'id'` 默认值在具体 `T` 无 id 时报错，则将 `rowKey` 放宽为 `string | ((row: T) => string)`，保留运行期 `String()` 兜底。以构建结果为准，优先 `keyof T & string`，退路是 `string`。

## 4. 内部实现调整

- `resolveRowKey(row: T, index)`、`colStyle(col: HTableColumn<T>)`、`onHeaderClick(col: HTableColumn<T>)` 的形参类型跟随泛型；函数体逻辑不变。
- 模板 `row[col.key]`、`col.render?.(row, i)`、`sortState` 逻辑不变。
- `sortState = ref<HTableSort | null>(null)` 不变。

## 5. dts 生成验证

- `vite-plugin-dts` 对泛型 SFC 会产出带 `<T>` 的组件类型与导出接口。
- 验证手段：`build:lib` 后 grep `dist/*.d.ts` 中 `HTableColumn` 是否带类型参数、组件 default export 是否保留泛型。
- 若 dts 丢失泛型（工具链限制），回退方案：保留 `HTableColumn<T>` 接口导出（消费方仍可显式标注），组件本身若无法产出泛型签名则至少不回归（默认参数保证裸用法通过）。以实际产物为准记录。

## 6. 兼容性 / 回滚

- 兼容：默认类型参数 + 运行时零改动 → 旧用法编译与行为均不变。
- 回滚：单文件（HTable.vue）改动为主 + docs/spec/playground，`git revert` 即可。

## 7. 风险

- 泛型 SFC + dts 产出是主要不确定点，构建后必须核验 `.d.ts`。
- `rowKey` 默认 `'id'` 与 `keyof T` 约束的张力（见 §3），以构建结果定最终类型。
