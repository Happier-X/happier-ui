# HPagination 分页器

## Goal

实现 `HPagination` 分页器组件，用于 model-hub 日志列表的分页场景。

## Background

- model-hub 日志列表手拼「上一页/下一页 + 第 N/M 页」，缺少统一分页器。
- 提供 simple 模式（纯前后翻页）和完整模式（页号按钮 + 省略号）。

## Requirements

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `current` | `number` | `1` | 当前页（1-indexed） |
| `total` | `number` | `0` | 总条目数 |
| `pageSize` | `number` | `20` | 每页条数 |
| `showSizeChanger` | `boolean` | `false` | 是否显示每页条数切换 |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | 可选的每页条数 |
| `showTotal` | `boolean` | `false` | 是否显示"共 N 条" |
| `simple` | `boolean` | `false` | 仅上一页/下一页（紧凑模式） |
| `disabled` | `boolean` | `false` | 禁用 |

### Events

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:current` | `number` | 页码改变 |
| `update:pageSize` | `number` | 每页条数改变 |
| `change` | `{ current, pageSize }` | 页码或 pageSize 变化时触发 |

### 布局

- simple 模式：`< Prev | Page X / N | Next >`
- 完整模式：`< Prev | 1 ... 4 5 6 ... 10 | Next >` + 可选 `共 N 条` + 可选 pageSize 切换

## Acceptance Criteria

- [ ] 完整模式渲染页号按钮、首尾页固定、中间省略号
- [ ] simple 模式仅渲染 Prev/Next + 页码文本
- [ ] showTotal 显示"共 N 条"
- [ ] showSizeChanger 显示 pageSize 下拉
- [ ] change emit 携带 `{ current, pageSize }`
- [ ] disabled 态全部按钮禁用
- [ ] `npm run build:lib` / `build:playground` / `docs:build` 通过
