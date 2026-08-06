# Loading

加载指示组件。内置两种展示形态：`local`（容器内居中，页面/区块加载态）与 `global`（全屏浮层，toast 式全局 loading）。CSS 圆环 spinner，对齐 wanchun/mini loading toast 观感；纯展示，无 emits。

需要线性进度条时用 `HProgress`；需要轻提示文案时用 `HToast`。

## 局部加载（local）

`mode` 默认 `local`：绝对定位覆盖父容器（父容器需 `position: relative`），spinner + label 垂直居中，**无遮罩、无底色**。

<script setup>
import { ref } from 'vue'
import { HButton, HLoading } from 'happier-ui'

const showGlobal = ref(false)
</script>

<div class="h-demo h-demo--stack">
  <div class="h-demo__row" style="align-items: stretch; flex-wrap: wrap; gap: 12px;">
    <div style="position: relative; width: 120px; height: 96px; border: 1px dashed var(--h-color-border-subtle, #e0e0e0); border-radius: 12px;">
      <h-loading size="sm" label="sm" />
    </div>
    <div style="position: relative; width: 120px; height: 96px; border: 1px dashed var(--h-color-border-subtle, #e0e0e0); border-radius: 12px;">
      <h-loading size="md" label="md" />
    </div>
    <div style="position: relative; width: 120px; height: 96px; border: 1px dashed var(--h-color-border-subtle, #e0e0e0); border-radius: 12px;">
      <h-loading size="lg" label="lg" />
    </div>
  </div>
</div>

```vue
<div style="position: relative; height: 120px;">
  <h-loading label="加载中…" />
</div>
```

> **注意**：`local` 依赖父容器 `position: relative`（或其它定位上下文）。父无定位时，绝对定位会相对更外层祖先，可能脱离预期区域。

## 全局加载（global）

`mode="global"`：Teleport 到 `body`，`fixed` 全屏 + `rgba(0,0,0,0.08)` 微遮罩（阻断交互）+ 深色 HUD 卡片包住 spinner 与白色文字。由宿主 `v-if` 控制显隐；无命令式 API。

<div class="h-demo h-demo--stack">
  <h-button @click="showGlobal = true; setTimeout(() => { showGlobal = false }, 2000)">打开全局 Loading（2s 自动关）</h-button>
  <h-loading v-if="showGlobal" mode="global" label="正在同步…" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HLoading } from 'happier-ui'

const show = ref(false)
</script>

<template>
  <button @click="show = true">加载</button>
  <h-loading v-if="show" mode="global" label="正在同步…" />
</template>
```

## 文案：label 与 default slot

`label` prop 与 default slot 均显示在 spinner 下方（垂直排列）。**default slot 优先于 `label`**。

<div class="h-demo h-demo--stack">
  <div class="h-demo__row" style="align-items: stretch; flex-wrap: wrap; gap: 12px;">
    <div style="position: relative; width: 160px; height: 120px; border: 1px dashed var(--h-color-border-subtle, #e0e0e0); border-radius: 12px;">
      <h-loading label="label prop" />
    </div>
    <div style="position: relative; width: 160px; height: 120px; border: 1px dashed var(--h-color-border-subtle, #e0e0e0); border-radius: 12px;">
      <h-loading>插槽文案</h-loading>
    </div>
  </div>
</div>

```vue
<h-loading label="加载中…" />
<h-loading>自定义插槽</h-loading>
```

## 颜色覆盖

无 `color` prop。默认 primary 同色系（轨道 `rgba(primary, 0.22)` + 顶边 primary）。宿主可在祖先上覆写局部 CSS 变量：

- `--h-loading-track`：轨道色
- `--h-loading-thumb`：顶边（活动段）色

`global` 卡片内已内置白色系覆盖，无需宿主再写。

<div class="h-demo">
  <div style="position: relative; width: 160px; height: 120px; border-radius: 12px; background: #1f1f1f; --h-loading-track: rgba(255,255,255,0.22); --h-loading-thumb: #ffffff;">
    <h-loading label="深色场景" />
  </div>
</div>

```vue
<div style="--h-loading-track: rgba(255,255,255,0.22); --h-loading-thumb: #ffffff;">
  <h-loading label="深色场景" />
</div>
```

## 与 HTable 协作

`HTable` 的 `loading` 态保留自身 `.h-table__overlay` 与 `#loading` slot；默认内容为 `<h-loading mode="local" size="md" />`。自定义 loading 时仍走 `#loading` slot。

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `mode` | `'local' \| 'global'` | `'local'` | 展示形态 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 圆环尺寸（16 / 24 / 32px） |
| `label` | `string` | — | 说明文字；default slot 优先 |
| `ariaLabel` | `string` | — | 覆盖可访问名（默认取 `label`，再回退「加载中」） |

### Emits

无。

### Slots

| 名称 | 说明 |
|------|------|
| `default` | label 内容，优先于 `label` prop |

## 无障碍

- 根节点 `role="status"`（隐式 polite live region）。
- `aria-label` 三级回退：`ariaLabel` → `label` → `"加载中"`（空串视为未提供）。
- spinner 为装饰，`aria-hidden="true"`。
- 不抢占焦点；显隐由宿主 `v-if` 控制。
- 尊重 `prefers-reduced-motion: reduce`：关闭旋转动画。

## Token

| Token | 默认 | 说明 |
|-------|------|------|
| `--h-loading-size-sm` | `16px` | 小号圆环 |
| `--h-loading-size-md` | `24px` | 中号圆环 |
| `--h-loading-size-lg` | `32px` | 大号圆环 |
| `--h-loading-border-sm` | `1.5px` | 小号边框 |
| `--h-loading-border-md` | `2px` | 中号边框 |
| `--h-loading-border-lg` | `3px` | 大号边框 |
| `--h-loading-z` | `var(--h-toast-z)` | global 层级（与 toast 同级） |
| `--h-loading-overlay-bg` | `rgba(0, 0, 0, 0.08)` | global 微遮罩 |
| `--h-loading-card-bg` | `rgba(var(--h-color-surface-dark-rgb), 0.82)` | global HUD 卡片底 |
| `--h-loading-card-radius` | `16px` | global HUD 圆角 |
| `--h-loading-card-shadow` | `0 8px 32px rgba(0, 0, 0, 0.18)` | global HUD 阴影 |
| `--h-loading-card-pad` | `24px 32px` | global HUD 内边距 |
| `--h-loading-track` | 局部变量 | 轨道色（默认 primary 22%） |
| `--h-loading-thumb` | 局部变量 | 顶边色（默认 primary） |
