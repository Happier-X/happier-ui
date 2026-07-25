# Tag

可关闭标签。支持颜色变体、可关闭和禁用态，用于状态码分类、筛选标签等场景。

## 基础

<script setup>
import { HTag } from 'happier-ui'
</script>

<div class="h-demo">
  <div class="smoke__row smoke__row--wrap">
    <h-tag>default</h-tag>
    <h-tag variant="primary">primary</h-tag>
    <h-tag variant="success">success</h-tag>
    <h-tag variant="warning">warning</h-tag>
    <h-tag variant="danger">danger</h-tag>
  </div>
</div>

```vue
<h-tag>default</h-tag>
<h-tag variant="primary">primary</h-tag>
<h-tag variant="success">success</h-tag>
<h-tag variant="warning">warning</h-tag>
<h-tag variant="danger">danger</h-tag>
```

## 尺寸

<div class="h-demo">
  <div class="smoke__row smoke__row--wrap">
    <h-tag size="sm">sm</h-tag>
    <h-tag size="md">md</h-tag>
  </div>
</div>

```vue
<h-tag size="sm">小号</h-tag>
<h-tag size="md">中号</h-tag>
```

## 可关闭

<div class="h-demo">
  <div class="smoke__row smoke__row--wrap">
    <h-tag closable variant="primary">标签一</h-tag>
    <h-tag closable variant="success">标签二</h-tag>
    <h-tag closable variant="danger">标签三</h-tag>
  </div>
</div>

```vue
<h-tag closable variant="primary">标签一</h-tag>
```

## 禁用

<div class="h-demo">
  <div class="smoke__row smoke__row--wrap">
    <h-tag disabled>禁用</h-tag>
    <h-tag disabled closable variant="primary">禁用可关闭</h-tag>
  </div>
</div>

```vue
<h-tag disabled>禁用</h-tag>
<h-tag disabled closable variant="primary">禁用可关闭</h-tag>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 颜色变体 |
| `size` | `'sm' \| 'md'` | `'md'` | 尺寸 |
| `closable` | `boolean` | `false` | 是否显示关闭按钮 |
| `disabled` | `boolean` | `false` | 禁用态（不显示关闭按钮） |

### Emits

| 事件 | 说明 |
|------|------|
| `close` | 点击关闭按钮时触发 |

### Slots

| 名称 | 说明 |
|------|------|
| default | 标签文字内容 |
