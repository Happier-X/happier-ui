# HTable 泛型行类型（消除 Record 断言）

对应 GitHub issue #9。

## Goal

把 `HTable` 改造为泛型组件，按行类型 `T` 参数化 `columns` / `data` / `cell` slot / `rowKey` / `render`，让消费方直接传具体 `interface[]`（如 `RequestLog[]`），slot 里的 `row` 推断为 `T`，`column.key` 约束为 `keyof T`，彻底消除 `as unknown as Record<string, unknown>[]` 与 slot 内的 `row as XXX` 双重断言。

## Background

当前 `HTable` 的 `data: Record<string, unknown>[]`、`HTableColumn.key: string`、`cell` slot 的 `row: Record<string, unknown>`。TS 严格模式下不带索引签名的 `interface` 不能赋给 `Record<string, unknown>`，消费方被迫双重断言，既啰嗦又丢类型安全。

Vue 3.3+ 支持 `<script setup lang="ts" generic="T">` 泛型 SFC；`vite-plugin-dts` 可为其生成 `.d.ts`。本仓库已用该工具链构建。

## Requirements

- `HTable` 用 `<script setup lang="ts" generic="T extends Record<string, unknown> = Record<string, unknown>">` 泛型化。
  - 默认类型参数 `= Record<string, unknown>`，保证旧用法（裸 `HTableColumn[]` / `data` 传 `Record[]`）零破坏。
- `HTableColumn<T>` 泛型化：
  - `key: keyof T & string`（既约束到行字段，又保证是 string 以支持 `row[col.key]` 与 `:key`）。
  - `render?: (row: T, index: number) => string | number`。
- `data: T[]`；`rowKey?: keyof T & string | ((row: T) => string)`。
- `cell` slot 类型：`{ column: HTableColumn<T>, row: T, index: number }`，用 `defineSlots` 声明，使消费方 slot 内 `row` 推断为 `T`。
- 类型导出：`HTableColumn`（泛型，默认参数保证裸用法可用）、`HTableSort` 继续从 `src/index.ts` 导出；消费方可写 `HTableColumn<RequestLog>`。
- 组件运行时行为、DOM、类名、排序 / loading / empty 逻辑、`sort` emit 契约完全不变。
- 更新 docs（`docs/components/table.md`）：加泛型用法示例与 API 说明；更新 spec（`component-guidelines.md`）HTable 行；playground 增补一个「具体 interface 行类型、slot 无断言」的演示验证泛型推断。

## Constraints

- 不引入新依赖；仅用 Vue 内置泛型 SFC 能力。
- 不改 `h-*` 类名与 token；样式文件无需改动。
- 向后兼容：默认类型参数使现有裸 `HTableColumn[]` / `Record[]` 用法继续编译通过。
- `vite-plugin-dts` 必须能为泛型组件生成正确 `.d.ts`（构建产物需验证 `HTableColumn<T>` 与组件泛型签名存在）。

## Acceptance Criteria

- [ ] 消费方传 `data: RequestLog[]` 无需 `as unknown as`，`cell` slot 的 `row` 推断为 `RequestLog`，`column.key` 约束为 `keyof RequestLog`。
- [ ] 裸用法 `HTableColumn[]` / `data: Record<string, unknown>[]` 仍编译通过（默认参数兜底）。
- [ ] 运行时行为 / DOM / 排序 / loading / empty / `sort` emit 无回归。
- [ ] `npm run build:lib` 通过，且 `dist/*.d.ts` 含泛型签名；playground `vue-tsc` 通过。
- [ ] docs / spec / playground 更新到位。

## Notes

- 参考：Vue 3.3+ 泛型 SFC（`<script setup generic>`）；`defineSlots` 类型化 slot。
- 消费方案例：`RequestLog[]` / `Provider[]`（见 issue #9）。
