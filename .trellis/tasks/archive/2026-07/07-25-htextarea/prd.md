# HTextarea 多行文本输入

## Goal

实现 `HTextarea` 多行文本输入组件，补齐输入控件族（HInput / HCheckbox / HSelect），用于 JSON/文本粘贴等场景。

## Background

- model-hub 有 1 处原生 `<textarea>`（供应商批量粘贴区域）。API 模式对标 `HInput`：`label` / `size` / `disabled` / `error`。
- 基于原生 `<textarea>`，支持 `rows` / `resize` / `maxLength` / `showCount`。

## Requirements

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | `string` | `''` | 当前值（v-model） |
| `label` | `string` | — | 标签（同 HInput） |
| `description` | `string` | — | 描述文字 |
| `error` | `string` | — | 错误消息 |
| `invalid` | `boolean` | — | 显式无效态 |
| `placeholder` | `string` | — | 占位提示 |
| `rows` | `number` | `3` | 初始行数 |
| `disabled` | `boolean` | `false` | 禁用 |
| `readonly` | `boolean` | `false` | 只读 |
| `spellcheck` | `boolean` | `true` | 拼写检查 |
| `resize` | `'none' \| 'vertical' \| 'both' \| 'auto'` | `'vertical'` | 缩放控制（auto=撑高） |
| `maxLength` | `number` | — | 最大字符数 |
| `showCount` | `boolean` | `false` | 显示字数统计 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸（对齐 HInput） |
| `name` | `string` | — | 原生 name |

### Events

| 事件 | 载荷 | 说明 |
|------|------|------|
| `update:modelValue` | `string` | 输入值改变 |
| `focus` | `FocusEvent` | 聚焦 |
| `blur` | `FocusEvent` | 失焦 |

## Design

- 结构与 HInput 一致：wrapper > label + textarea + description/error
- CSS 复用 `--h-input-*` token（border/radius/bg/font/padding/height）
- `resize="auto"` 时通过 input 事件动态重置 height → scrollHeight
- `showCount` 在 textarea 右下角显示 `当前字数 / maxLength`

## Acceptance Criteria

- [ ] `src/components/HTextarea.vue` + `src/styles/components/textarea.css`
- [ ] `components.css` import + `index.ts` 导出
- [ ] playground 演示：基础、label+error、sizes、resize auto、maxLength+showCount、disabled
- [ ] `docs/components/textarea.md` 文档
- [ ] `.trellis/spec` 同步
- [ ] 构建通过
