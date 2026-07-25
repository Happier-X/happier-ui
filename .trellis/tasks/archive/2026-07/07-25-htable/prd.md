# HTable 数据表格

## Goal

实现 `HTable` 数据表格组件，用于 model-hub 等项目的日志列表、供应商列表等数据展示场景。

## Background

- model-hub 项目有 2 处手写原生 `<table>`（日志列表、供应商列表），需要统一的数据表格组件。
- 组件聚焦数据展示与基础交互（列排序），不承担复杂编辑、虚拟滚动、树形数据等职责。

## Requirements

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `columns` | `HTableColumn[]` | `[]` | 列定义 |
| `data` | `Record<string, unknown>[]` | `[]` | 数据行 |
| `rowKey` | `string \| ((row) => string)` | `'id'` | 行唯一标识 |
| `bordered` | `boolean` | `false` | 是否显示边框 |
| `striped` | `boolean` | `false` | 是否斑马纹 |
| `stickyHeader` | `boolean` | `false` | 表头是否固定 |
| `emptyText` | `string` | `'暂无数据'` | 空数据文案 |
| `loading` | `boolean` | `false` | 加载中态 |

```ts
interface HTableColumn {
  key: string
  title: string
  width?: string | number   // 列宽，如 '120px' 或 120
  align?: 'left' | 'center' | 'right'
  sortable?: boolean        // 是否可排序
  render?: (row: Record<string, unknown>, index: number) => string | number
}

interface HTableSort {
  key: string
  order: 'asc' | 'desc'
}
```

### Events

| 事件 | 载荷 | 说明 |
|------|------|------|
| `sort` | `HTableSort \| null` | 排序列变化时触发；null 表示取消排序 |

### Slots

| 名称 | 作用域 | 说明 |
|------|--------|------|
| `cell` | `{ column, row, index }` | 自定义单元格内容（优先级高于 column.render） |
| `empty` | — | 自定义空状态（默认显示 emptyText） |
| `loading` | — | 自定义加载中状态 |

## Design

### 结构

```html
<div class="h-table-wrapper">
  <table class="h-table" :class="[...]">
    <thead>
      <tr>
        <th v-for="col in columns" ...>
          {{ col.title }}
          <span v-if="col.sortable" class="h-table__sort-icon" />
        </th>
      </tr>
    </thead>
    <tbody v-if="showBody">
      <tr v-for="(row, i) in data" :key="rowKey(row)">
        <td v-for="col in columns" ...>
          <slot name="cell" :column="col" :row="row" :index="i">
            {{ col.render ? col.render(row, i) : row[col.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="loading" class="h-table__loading">...</div>
  <div v-else-if="!data.length" class="h-table__empty">...</div>
</div>
```

### 样式

- `src/styles/components/table.css`：`@layer components`
- 表头深色背景、font-weight 600、`position: sticky`（stickyHeader）
- 斑马纹通过 `nth-child(even)` 实现
- 排序箭头用 CSS 伪元素或内联 SVG
- 无 elevation，配色与 HCard / HCell 一致

## Acceptance Criteria

- [ ] `src/components/HTable.vue` 实现组件逻辑与 BEM 类。
- [ ] `src/styles/components/table.css` 写 `@layer components` 视觉规则；`components.css` 增加 `@import`。
- [ ] `src/index.ts` 导出 `HTable` + `HTableColumn` + `HTableSort` 类型。
- [ ] playground 展示：基础、bordered、striped、stickyHeader、sortable、loading、empty、自定义 cell slot。
- [ ] `docs/components/table.md` 文档页。
- [ ] `.trellis/spec/frontend/component-guidelines.md` 同步。
- [ ] 列排序点击后触发 `sort` emit，排序图标切换升/降序。
- [ ] loading 态不遮挡表头，内容区显示 loading 指示。
- [ ] 空数据时显示 `emptyText` 或 `#empty` slot。
- [ ] `npm run build:lib`、`build:playground`、`docs:build` 通过。

## Out Of Scope

- 列宽拖拽调整、固定列、横向滚动。
- 行展开/选择/编辑/删除。
- 分页、筛选输入、远程数据加载。
- 虚拟滚动、树形数据、合并单元格。
