# Tooltip 工具提示

悬浮提示。hover / focus / tap 触发，支持多方向自动翻转定位，并遵循 HeroUI 视觉。

## 基础

<script setup>
import { ref } from 'vue'
import { HTooltip } from 'happier-ui'
</script>

<div class="h-demo h-demo--stack">
  <div class="flex gap-h-md flex-wrap">
    <HTooltip content="默认 top 方向提示">
      <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">top</button>
    </HTooltip>
    <HTooltip content="bottom 方向提示" placement="bottom">
      <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">bottom</button>
    </HTooltip>
    <HTooltip content="左侧弹出提示" placement="left">
      <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">left</button>
    </HTooltip>
    <HTooltip content="右侧弹出提示" placement="right">
      <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">right</button>
    </HTooltip>
  </div>
</div>

```vue
<HTooltip content="简单提示文字" placement="top">
  <button>悬浮即可看到</button>
</HTooltip>
```

## 方向（placement）

`top`（默认）/ `bottom` / `left` / `right`。接近视口边缘时自动翻转。

<div class="h-demo h-demo--stack">
  <HTooltip content="top" placement="top">
    <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">top</button>
  </HTooltip>
  <HTooltip content="bottom" placement="bottom">
    <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">bottom</button>
  </HTooltip>
  <HTooltip content="left" placement="left">
    <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">left</button>
  </HTooltip>
  <HTooltip content="right" placement="right">
    <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">right</button>
  </HTooltip>
</div>

```vue
<HTooltip content="提示" placement="top">。。。</HTooltip>
<HTooltip content="提示" placement="bottom">。。。</HTooltip>
<HTooltip content="提示" placement="left">。。。</HTooltip>
<HTooltip content="提示" placement="right">。。。</HTooltip>
```

## 主题色（color）

`default`（浅色底 + 细边框）/ `primary` / `success` / `warning` / `danger`。

<div class="h-demo h-demo--stack">
  <div class="flex gap-h-md flex-wrap">
    <HTooltip content="default 浅色底" placement="top">
      <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">default</button>
    </HTooltip>
    <HTooltip content="primary 主色" color="primary" placement="top">
      <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">primary</button>
    </HTooltip>
    <HTooltip content="success 成功" color="success" placement="top">
      <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">success</button>
    </HTooltip>
    <HTooltip content="warning 警告" color="warning" placement="top">
      <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">warning</button>
    </HTooltip>
    <HTooltip content="danger 危险" color="danger" placement="top">
      <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">danger</button>
    </HTooltip>
  </div>
</div>

```vue
<HTooltip content="提示" color="primary">按钮</HTooltip>
<HTooltip content="提示" color="success">按钮</HTooltip>
<HTooltip content="提示" color="warning">按钮</HTooltip>
<HTooltip content="提示" color="danger">按钮</HTooltip>
```

## 箭头（showArrow）

<div class="h-demo h-demo--stack">
  <HTooltip content="带箭头提示" placement="top" show-arrow>
    <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">showArrow</button>
  </HTooltip>
</div>

```vue
<HTooltip content="带箭头" placement="top" show-arrow>按钮</HTooltip>
```

## 延迟（delay）

默认 `200`ms。

<div class="h-demo h-demo--stack">
  <HTooltip content="延迟 500ms 显示" :delay="500" placement="top">
    <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">delay=500</button>
  </HTooltip>
</div>

```vue
<HTooltip content="延迟提示" :delay="500">按钮</HTooltip>
```

## 禁用

<div class="h-demo h-demo--stack">
  <HTooltip content="不会弹出" disabled>
    <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">disabled</button>
  </HTooltip>
</div>

```vue
<HTooltip content="不会弹出" disabled>按钮</HTooltip>
```

## 自定义内容（slot）

<div class="h-demo h-demo--stack">
  <HTooltip placement="top" show-arrow>
    <button class="px-h-sm py-h-xs rounded-h-control border border-h-border-subtle text-h-ink">富文本</button>
    <template #content>
      <strong>标题</strong>
      <br />
      <span style="color: var(--h-color-ink-muted)">副文本说明</span>
    </template>
  </HTooltip>
</div>

```vue
<HTooltip placement="top" show-arrow>
  <button>富文本</button>
  <template #content>
    <strong>标题</strong>
    <p>副文本说明</p>
  </template>
</HTooltip>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `content` | `string` | `''` | 提示文字（被 `#content` slot 覆盖） |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 弹出方向，边缘自动翻转 |
| `color` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 背景色 |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | 圆角 |
| `delay` | `number` | `200` | 进入延迟（ms） |
| `showArrow` | `boolean` | `false` | 是否显示箭头指示 |
| `disabled` | `boolean` | `false` | 禁用，不弹出 |
| `teleport` | `string \| HTMLElement \| false` | `'body'` | 挂载目标 |

### Slots

| 名称 | 作用域 | 说明 |
|------|--------|------|
| `default` | — | 触发器内容 |
| `content` | — | 自定义提示内容（覆盖 `content` prop） |

## 行为说明

- 默认 `teleport="body"`，逃离带 `transform` / `contain` 祖先的定位干扰。
- 接近视口边缘时自动翻转方向（如 `top` 空间不足翻为 `bottom`）。
- 窗口尺寸变化或滚动时自动关闭。
- 移动端 click/tap 触发显示，再次点击关闭。

## 无障碍

- `role="tooltip"`，打开时触发器设置 `aria-describedby` 关联 tooltip 元素。