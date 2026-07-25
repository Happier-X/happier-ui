# HTable 泛型化 — 执行计划

## 顺序清单

1. **改 `src/components/HTable.vue`**
   - `<script setup>` 加 `generic="T extends Record<string, unknown> = Record<string, unknown>"`。
   - `HTableColumn` 加类型参数 `<T extends Record<string, unknown> = Record<string, unknown>>`，`key: keyof T & string`，`render?: (row: T, index) => ...`。
   - `HTableSort` 不变。
   - props：`columns: HTableColumn<T>[]`、`data: T[]`、`rowKey?: (keyof T & string) | ((row: T) => string)`；默认值不变。
   - 加 `defineSlots<{ cell(...): unknown; empty(): unknown; loading(): unknown }>()`。
   - 内部函数形参类型跟随泛型；逻辑不动。

2. **构建 + dts 核验**
   - `npm run build:lib`。
   - grep `dist/` 下 `.d.ts`，确认 `HTableColumn` 带类型参数、组件泛型是否保留（记录实际产物）。
   - 若 `rowKey: 'id'` 默认值触发类型错误 → 按 design §3 放宽 `rowKey` 为 `string | ((row: T) => string)`，重建。

3. **playground 泛型用法验证**
   - `playground/src/App.vue`：为 `tableData` / `tableColumns` 引入一个具体 `interface`（如 `DemoRow`），去掉 `Record<string, unknown>` 断言，`#cell` slot 里 `row` 无需断言直接取字段。
   - `npm run build:playground`（含 `vue-tsc`）验证类型推断成立、无断言。

4. **docs**
   - `docs/components/table.md`：`HTableColumn[]` → 说明泛型用法示例（`HTableColumn<Row>` / `data: Row[]`），Props 表 `data` 类型标注更新，接口块加类型参数与 `key: keyof T & string`、`render(row: T)`。

5. **spec**
   - `component-guidelines.md`：HTable 参考实现描述、API 约定表、导出表补「泛型行类型（`HTableColumn<T>` / `data: T[]`，`cell` slot `row` 推断为 `T`）」。

## 验证门槛

- `npm run build:lib` 通过，dts 产物已核验并记录。
- `npm run build:playground` 通过，playground 用具体 interface 且无 `as` 断言。
- 旧裸用法（`HTableColumn` 无尖括号 + `Record` 数据）仍编译通过（兼容）。

## 回滚点

- 主改动集中在 `HTable.vue`；如 dts 或类型推断不达预期，`git checkout` 单文件回退，其余文档改动独立。
