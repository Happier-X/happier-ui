# Card

通用卡片容器。承载分组内容（信息块、列表条目、媒体卡等）；层次靠 border + surface 背景 + 圆角表达，**无 elevation / box-shadow**。纯展示容器，不做整卡可点击。

## 基础

<script setup>
import { HCard, HButton } from 'happier-ui'

const variants = ['outlined', 'filled', 'flat']
const paddings = ['none', 'sm', 'md', 'lg']
const radii = ['sm', 'md']
</script>

<div class="h-demo h-demo--stack">
  <h-card>
    <strong>默认 outlined</strong>
    <p style="margin: 0.5rem 0 0; color: var(--h-color-ink-muted); font-size: 13px;">
      surface 背景 + subtle 边框，无阴影。
    </p>
  </h-card>
</div>

```vue
<script setup lang="ts">
import { HCard } from 'happier-ui'
</script>

<template>
  <h-card>
    卡片正文
  </h-card>
</template>
```

## 变体

<div class="h-demo h-demo--stack">
  <h-card
    v-for="variant in variants"
    :key="variant"
    :variant="variant"
  >
    <strong>variant={{ variant }}</strong>
    <p style="margin: 0.5rem 0 0; color: var(--h-color-ink-muted); font-size: 13px;">
      outlined：白底描边；filled：次级表面无边；flat：透明无边。
    </p>
  </h-card>
</div>

```vue
<h-card variant="outlined">outlined</h-card>
<h-card variant="filled">filled</h-card>
<h-card variant="flat">flat</h-card>
```

## Header / Footer 组合

<div class="h-demo h-demo--stack">
  <h-card>
    <template #header>
      <strong>标题区</strong>
    </template>
    正文内容。outlined / filled 下 header 与 body 之间有分隔线。
    <template #footer>
      <h-button size="sm">操作</h-button>
      <h-button size="sm" variant="ghost">取消</h-button>
    </template>
  </h-card>

  <h-card variant="filled">
    <template #header>
      <strong>filled + header</strong>
    </template>
    仅 header + body。
  </h-card>

  <h-card variant="flat">
    <template #header>
      <strong>flat 无分隔线</strong>
    </template>
    flat 变体只用间距分隔分区，不画线。
    <template #footer>
      页脚
    </template>
  </h-card>
</div>

```vue
<h-card>
  <template #header>标题</template>
  正文
  <template #footer>
    <h-button size="sm">操作</h-button>
  </template>
</h-card>
```

## Padding / Radius

<div class="h-demo h-demo--stack">
  <h-card
    v-for="padding in paddings"
    :key="`pad-${padding}`"
    :padding="padding"
  >
    padding={{ padding }}
  </h-card>
  <h-card
    v-for="radius in radii"
    :key="`radius-${radius}`"
    :radius="radius"
  >
    radius={{ radius }}
  </h-card>
</div>

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `variant` | `'outlined' \| 'filled' \| 'flat'` | `'outlined'` | 视觉变体：描边 / 填充 / 扁平 |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 各分区内边距（映射 `--h-space-*`；`none` 为 0） |
| `radius` | `'sm' \| 'md'` | `'md'` | 圆角（`sm`=`--h-radius-sm`，`md`=`--h-radius-md`） |

### Slots

| 名称 | 说明 |
|------|------|
| `header` | 顶部区；缺省不渲染容器 |
| `default` | 正文（body） |
| `footer` | 底部区；缺省不渲染容器 |

### Emits

无。

## 无障碍

- 根节点为语义 `<article>`（内容分组）
- 纯展示容器：无整卡焦点环、无 `clickable` / `disabled`
- 卡内交互由宿主放置的控件（如 `HButton`）自带 `:focus-visible`
