# Badge

小型状态徽章。支持颜色变体与纯圆点（dot）模式，用于状态标识等紧凑场景。

## 基础

<script setup>
import { HBadge } from 'happier-ui'
</script>

<div class="h-demo">
  <div class="smoke__row smoke__row--wrap">
    <h-badge>default</h-badge>
    <h-badge variant="success">success</h-badge>
    <h-badge variant="warning">warning</h-badge>
    <h-badge variant="danger">danger</h-badge>
    <h-badge variant="info">info</h-badge>
  </div>
</div>

```vue
<h-badge>default</h-badge>
<h-badge variant="success">success</h-badge>
<h-badge variant="warning">warning</h-badge>
<h-badge variant="danger">danger</h-badge>
<h-badge variant="info">info</h-badge>
```

## 尺寸

<div class="h-demo">
  <div class="smoke__row smoke__row--wrap">
    <h-badge size="sm">sm</h-badge>
    <h-badge size="md">md</h-badge>
  </div>
</div>

```vue
<h-badge size="sm">小号</h-badge>
<h-badge size="md">中号</h-badge>
```

## Dot 模式

<div class="h-demo">
  <div class="smoke__row smoke__row--wrap">
    <h-badge dot variant="success" aria-label="运行中" />
    <h-badge dot variant="warning" aria-label="警告" />
    <h-badge dot variant="danger" aria-label="错误" />
    <h-badge dot variant="info" aria-label="信息" />
  </div>
</div>

```vue
<h-badge dot variant="success" aria-label="运行中" />
<h-badge dot variant="warning" aria-label="警告" />
<h-badge dot variant="danger" aria-label="错误" />
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 颜色变体 |
| `size` | `'sm' \| 'md'` | `'md'` | 尺寸 |
| `dot` | `boolean` | `false` | 仅显示圆点（无文字） |
| `ariaLabel` | `string` | — | dot 模式或无可见文字时的可访问名称 |

### Slots

| 名称 | 说明 |
|------|------|
| default | 徽章文字内容（dot 模式时可用作 aria-labelledby 后备） |
