# HBadge / HTag 状态标签与徽章

## Goal

实现 `HBadge`（小型状态徽章）和 `HTag`（可关闭标签）两个组件，用于 model-hub 等项目的运行状态标识与 HTTP 状态码分类场景。

## Background

- model-hub：代理运行状态（running/stopped/error）用 `rounded-full` 手写标签，HTTP 状态码（2xx/4xx/5xx）也有重复的 Tailwind 样式。
- 两个组件共用同一套 variant 彩色体系，实现与 tokens 一致的心智模型。

## Requirements

### HBadge Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 颜色变体 |
| `size` | `'sm' \| 'md'` | `'md'` | 尺寸 |
| `dot` | `boolean` | `false` | 仅显示圆点（无文字） |
| `ariaLabel` | `string` | — | dot 模式或无可见文字时的可访问名称 |

### HTag Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 颜色变体 |
| `size` | `'sm' \| 'md'` | `'md'` | 尺寸 |
| `closable` | `boolean` | `false` | 是否显示关闭按钮 |
| `disabled` | `boolean` | `false` | 禁用态（closable 时不显示关闭按钮） |

### Emits

| 组件 | 事件 | 载荷 | 说明 |
|------|------|------|------|
| `HTag` | `close` | — | 点击关闭按钮时触发 |

### Slots

| 组件 | 名称 | 说明 |
|------|------|------|
| `HBadge` | default | 徽章文字/内容（dot 模式仍可使用，用于 aria-labelledby） |
| `HTag` | default | 标签文字/内容 |

## Design

### 结构

```html
<!-- HBadge: dot=false -->
<span class="h-badge" :class="`h-badge--${variant} h-badge--${size}`">
  <slot />
</span>

<!-- HBadge: dot=true -->
<span class="h-badge h-badge--dot" :class="`h-badge--${variant}`" role="status" :aria-label="ariaLabel" />

<!-- HTag -->
<span class="h-tag" :class="`h-tag--${variant} h-tag--${size}`">
  <slot />
  <button v-if="closable" class="h-tag__close" @click="$emit('close')">×</button>
</span>
```

### 样式

- `src/styles/components/badge.css` + `src/styles/components/tag.css`
- variant 使用 `--h-*` token 背景色 + 文字色（参考 HProgress variant 模式）
- 圆角 `--h-radius` / `--h-radius-full`
- 尺寸 sm/md：不同 padding、font-size
- disabled 态 opacity

## Acceptance Criteria

- [ ] `src/components/HBadge.vue` + `src/components/HTag.vue` 实现。
- [ ] `src/styles/components/badge.css` + `tag.css` + `components.css` import。
- [ ] `src/index.ts` 导出 `HBadge` / `HTag`。
- [ ] playground 展示各 variant + sizes + dot + closable + disabled。
- [ ] `docs/components/badge.md` + `docs/components/tag.md` 文档页。
- [ ] `.trellis/spec/frontend/component-guidelines.md` 同步。
- [ ] `npm run build:lib` / `build:playground` / `docs:build` 通过。

## Out Of Scope

- 数字徽章（notification badge with count）。
- 标签分组、选中态（纯展示标签，不承担 multi-select 职责）。
- 图标内置（由 slot 自行嵌入）。
