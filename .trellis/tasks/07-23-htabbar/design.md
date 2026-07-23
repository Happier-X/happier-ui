# 技术设计：HTabBar

## API

```ts
type HTabBarItem = {
  key: string
  label?: string
  icon?: Component
  disabled?: boolean
}

modelValue?: string // 当前 key
items: HTabBarItem[]
ariaLabel?: string // nav 可访问名，默认「主导航」
fixed?: boolean // 默认 true；是否 fixed 到视口底部
safeArea?: boolean // 默认 true；是否启用底部安全区（与 fixed 独立）

// emits
'update:modelValue': [key: string]
```

## 结构

```html
<nav class="h-tab-bar" :aria-label="ariaLabel">
  <button
    v-for="item in items"
    :key="item.key"
    type="button"
    class="h-tab-bar__item"
    :class="{ 'h-tab-bar__item--active': item.key === modelValue }"
    :disabled="item.disabled"
    :aria-current="item.key === modelValue ? 'page' : undefined"
    @click="select(item)"
  >
    <h-icon v-if="item.icon" :icon="item.icon" size="md" />
    <span v-if="item.label" class="h-tab-bar__label">{{ item.label }}</span>
  </button>
</nav>
```

`select`：disabled 则 return；否则 `emit('update:modelValue', item.key)`。

## 样式

- `fixed` 默认 true：加 `h-tab-bar--fixed`，设置 `position: fixed; left:0; right:0; bottom:0; z-index`
- `fixed=false`：根 nav 参与普通文档流
- `min-height: var(--h-tab-bar-height)` 在 `__inner`
- `safeArea` 默认 true：加 `h-tab-bar--safe-area`，在根 nav 加 `padding-bottom: env(safe-area-inset-bottom)`；与 fixed 独立
- 表面 + 顶部分割线（border-subtle）；无 elevation
- 项 `flex:1`；图标+文案纵向；active 色 `--h-color-primary`

## Token（可复用 + 少量扩展）

已有：`--h-tab-bar-height`、`--h-z-tab`  
可选：`--h-tab-bar-bg`、`--h-tab-bar-border`、`--h-tab-bar-label-font`

## 依赖

- 库内 `import HIcon from './HIcon.vue'`（已有组件）
- Lucide 仅 playground 引入具体图标；`HTabBar` 不 peer Lucide（图标由宿主放进 items）

## 文件

`HTabBar.vue`、index、tokens（按需）、playground、README、specs。
