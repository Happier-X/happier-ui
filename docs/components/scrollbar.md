# Scrollbar 滚动条

CSS-only 细窄主题滚动容器。Web 端自定义 thumb 外观，移动端自动回退浏览器原生滚动。

高度须由宿主控制（`style="height: ..."` 或 CSS class），否则内容不会溢出，滚动条无作用。

## 基础 · thin

<script setup>
import { HScrollbar } from 'happier-ui'
</script>

<div class="h-demo">
  <HScrollbar style="height: 120px">
    <p v-for="i in 14" :key="i" class="h-scroll-demo-item">{{ i }} — 默认 thin 细窄 thumb</p>
  </HScrollbar>
</div>

```vue
<HScrollbar style="height: 120px">
  <div v-for="i in 20" :key="i">行 {{ i }}</div>
</HScrollbar>
```

## mode（滚动条模式）

`thin`（默认）细窄主题 thumb · `default` 浏览器原生 · `none` 隐藏 thumb 仍可滚动。

<div class="h-demo">
  <div class="h-demo--row">
    <div>
      <p class="h-demo__hint">thin</p>
      <HScrollbar mode="thin" style="height: 100px; width: 220px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
    <div>
      <p class="h-demo__hint">default</p>
      <HScrollbar mode="default" style="height: 100px; width: 220px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
    <div>
      <p class="h-demo__hint">none（隐藏仍可滚）</p>
      <HScrollbar mode="none" style="height: 100px; width: 220px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
  </div>
</div>

```vue
<HScrollbar mode="thin" style="height: 100px">内容</HScrollbar>
<HScrollbar mode="default" style="height: 100px">内容</HScrollbar>
<HScrollbar mode="none" style="height: 100px">内容</HScrollbar>
```

## axis（方向）

`y`（默认纵向）· `x`（横向）· `both`（双向）。

<div class="h-demo">
  <div class="h-demo--row">
    <div>
      <p class="h-demo__hint">y（纵向）</p>
      <HScrollbar axis="y" style="height: 100px; width: 220px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
    <div>
      <p class="h-demo__hint">x（横向）</p>
      <HScrollbar axis="x" style="width: 220px; white-space: nowrap">
        <span v-for="i in 20" :key="i" class="h-scroll-demo-item h-scroll-demo-item--inline">列 {{ i }}</span>
      </HScrollbar>
    </div>
    <div>
      <p class="h-demo__hint">both（双向）</p>
      <HScrollbar axis="both" style="height: 100px; width: 220px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item h-scroll-demo-item--wide">{{ i }}</p>
      </HScrollbar>
    </div>
  </div>
</div>

```vue
<HScrollbar axis="y" style="height: 100px">纵向内容</HScrollbar>
<HScrollbar axis="x" style="width: 220px">横向内容（需强制不换行）</HScrollbar>
<HScrollbar axis="both" style="height: 100px; width: 220px">双向溢出内容</HScrollbar>
```

## size（thumb 宽度）

`sm` 4px · `md` 6px（默认）· `lg` 8px。

<div class="h-demo">
  <div class="h-demo--row">
    <div>
      <p class="h-demo__hint">sm · 4px</p>
      <HScrollbar size="sm" style="height: 100px; width: 220px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
    <div>
      <p class="h-demo__hint">md · 6px（默认）</p>
      <HScrollbar size="md" style="height: 100px; width: 220px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
    <div>
      <p class="h-demo__hint">lg · 8px</p>
      <HScrollbar size="lg" style="height: 100px; width: 220px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
  </div>
</div>

```vue
<HScrollbar size="sm" style="height: 100px">sm</HScrollbar>
<HScrollbar size="md" style="height: 100px">md</HScrollbar>
<HScrollbar size="lg" style="height: 100px">lg</HScrollbar>
```

## color（主题色）

`default`（半透明灰）· `primary` · `success` · `warning` · `danger`。

<div class="h-demo">
  <div class="h-demo--row">
    <div>
      <p class="h-demo__hint">default</p>
      <HScrollbar style="height: 100px; width: 200px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
    <div>
      <p class="h-demo__hint">primary</p>
      <HScrollbar color="primary" style="height: 100px; width: 200px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
    <div>
      <p class="h-demo__hint">success</p>
      <HScrollbar color="success" style="height: 100px; width: 200px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
    <div>
      <p class="h-demo__hint">warning</p>
      <HScrollbar color="warning" style="height: 100px; width: 200px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
    <div>
      <p class="h-demo__hint">danger</p>
      <HScrollbar color="danger" style="height: 100px; width: 200px">
        <p v-for="i in 10" :key="i" class="h-scroll-demo-item">{{ i }}</p>
      </HScrollbar>
    </div>
  </div>
</div>

```vue
<HScrollbar color="primary" style="height: 100px">primary</HScrollbar>
<HScrollbar color="success" style="height: 100px">success</HScrollbar>
<HScrollbar color="warning" style="height: 100px">warning</HScrollbar>
<HScrollbar color="danger" style="height: 100px">danger</HScrollbar>
```

## API

### Props

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `mode` | `'thin' \| 'default' \| 'none'` | `'thin'` | 滚动条模式，DOM 写入 `data-scrollbar` |
| `axis` | `'x' \| 'y' \| 'both'` | `'y'` | 溢出方向 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | thumb 宽度：4px / 6px / 8px |
| `color` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | thumb 主题色 |
| `ariaLabel` | `string` | — | 滚动区域无障碍名 |

### Slots

| 名称 | 作用域 | 说明 |
|------|--------|------|
| `default` | — | 滚动内容 |

## 行为说明

- 纯 CSS，无 JS thumb / 拖拽 / 事件 / SSR guard。
- 高度须由宿主控制（`style="height: ..."`、`max-height` 或 CSS class）。
- Chromium / Safari：`::-webkit-scrollbar` 伪元素自定义。Firefox：`scrollbar-width: thin` + `scrollbar-color`（无圆角）。
- 移动端（`hover: none` + `pointer: coarse`）自动回退原生滚动，不强制自定义 thumb。
- `mode="none"` 隐藏 thumb，内容仍可滚（键盘 / wheel / touch）。

<style scoped>
.h-scroll-demo-item {
  margin: 0;
  padding: var(--h-space-xs, 2px) var(--h-space-sm, 8px);
  border-bottom: 1px solid var(--h-color-border-subtle, #e0e0e0);
  font-size: var(--h-font-body-sm, 13px);
  line-height: 1.4;
}
.h-scroll-demo-item--inline {
  display: inline-block;
  padding: 2px 8px;
  border-bottom: none;
  border-right: 1px solid var(--h-color-border-subtle, #e0e0e0);
}
.h-scroll-demo-item--wide {
  width: 220%;
  white-space: nowrap;
}
</style>
