# HCell / HCellGroup 技术设计

## 组件边界

`HCell` 是设置页与菜单列表中的稳定横向行结构，负责标题、描述、前缀、后缀、可选导航指示和整行激活语义。`HCellGroup` 负责分组标题、Surface 外观、圆角裁切与相邻 Cell 分隔线。

交付文件：

- `src/components/HCell.vue`：props、slots、整行交互与 ARIA。
- `src/components/HCellGroup.vue`：分组结构、标题 id 与 ARIA 关联。
- `src/styles/components/cell.css`：Cell / CellGroup 共用视觉规则。
- `src/styles/tokens.css`：Cell 高度、内边距、间距、Surface、pressed 与 chevron token。
- `src/styles/components.css`、`src/index.ts`：样式汇总与公共导出。
- `playground/src/App.vue`、`docs/components/cell.md`、`docs/.vitepress/config.ts`：演示、文档与入口。
- `.trellis/spec/frontend/component-guidelines.md`、`tokens.md`、`quality-guidelines.md`：公共契约同步。

不恢复 `HListRow`、`HSettingRow`、`HListSection` 或任何 `M*` 别名；不实现选择模型、路由、侧滑、拖拽和虚拟列表。

## 公共 API

```ts
type HCellProps = {
  title: string
  description?: string
  clickable?: boolean
  showChevron?: boolean
  ariaLabel?: string
}

type HCellEmits = {
  click: [event: MouseEvent | KeyboardEvent]
}

type HCellGroupProps = {
  title?: string
  inset?: boolean
}
```

默认值：

- `HCell`：`description=undefined`、`clickable=false`、`showChevron=undefined`、`ariaLabel=undefined`。
- `HCellGroup`：`title=undefined`、`inset=true`。

`showChevron` 的有效值为 `props.showChevron ?? props.clickable`，因此导航行默认有 chevron，宿主可显式关闭；纯展示行可显式开启。

Slots：

- `HCell`：`#prefix`、`#suffix`。不提供 default 内容槽，标题与描述由 props 建立稳定文本结构。
- `HCellGroup`：default、`#header`。`#header` 覆盖默认 title 输出。

## DOM 与交互

`HCell` 使用一个统一根节点，避免 clickable 切换导致 DOM 类型变化：

```html
<div
  class="h-cell h-cell--clickable"
  role="button"
  tabindex="0"
  aria-label="..."
>
  <div class="h-cell__prefix">...</div>
  <div class="h-cell__content">
    <div class="h-cell__title">语言</div>
    <div class="h-cell__description">简体中文</div>
  </div>
  <div class="h-cell__suffix">...</div>
  <span class="h-cell__chevron" aria-hidden="true">...</span>
</div>
```

- `clickable=false` 时省略 `role`、`tabindex` 和交互 class，click / keydown handler 不 emit。
- `clickable=true` 时 click emit 原始 `MouseEvent`；Enter / Space 阻止默认行为并 emit 原始 `KeyboardEvent`。
- chevron 使用 `@lucide/vue` 的 `ChevronRight`，通过现有 `HIcon` 渲染，装饰语义隐藏。
- `ariaLabel` 仅在传入时覆盖根节点可访问名称；默认由可见 title / description 提供名称。
- prefix / suffix 容器只在对应 slot 存在时渲染，避免空白占位。

交互后缀约束：导航行可用 `clickable=true` 搭配静态 suffix（值、Chip、文字）；放置 `HSwitch` / `HCheckbox` / button 等控件时必须保持 `clickable=false`，由 suffix 控件自身处理焦点与激活，避免嵌套交互和事件重复。该约束写入文档与 playground。

`HCellGroup`：

```html
<section class="h-cell-group h-cell-group--inset" aria-labelledby="...">
  <header class="h-cell-group__header">
    <h2 id="..." class="h-cell-group__title">通用</h2>
  </header>
  <div class="h-cell-group__body">...</div>
</section>
```

- Vue `useId()` 为默认 title 生成稳定 id，并由 section 的 `aria-labelledby` 引用。
- 使用自定义 `#header` 时不猜测其内部 id，因此不自动设置 `aria-labelledby`；宿主可在自定义内容中提供自身语义。
- 无 title / header 时不渲染 header。

## 分隔线与组合规则

- 分隔线由 `.h-cell-group__body > .h-cell:not(:last-child)::after` 绘制，只有作为 `HCellGroup` 直接子元素的 Cell 获得分隔线。
- 伪元素从 Cell 内容起始位置延伸到右侧；有无 prefix 时保持一致的主体内缩，不增加运行时组件计数。
- `inset=true`：body 使用 Surface、圆角并 `overflow: hidden`，pressed 背景不会越界。
- `inset=false`：取消外侧圆角与 inset 边距，保留全宽 Surface 和分隔线。
- 分组标题位于 Surface 上方，不嵌进卡片内部，符合移动端设置页 section 结构。

## 视觉与 Token

新增组件 token（最终数值以实现目视结果为准，保持最小集合）：

- `--h-cell-min-height`
- `--h-cell-pad-x` / `--h-cell-pad-y`
- `--h-cell-gap`
- `--h-cell-bg`
- `--h-cell-pressed-bg`
- `--h-cell-chevron-color`
- `--h-cell-group-radius`
- `--h-cell-group-header-gap`

文字、分隔线、字号、焦点环和动效复用现有 `--h-color-ink`、`--h-color-ink-muted`、`--h-color-separator`、`--h-font-title`、`--h-font-body-sm`、`--h-color-focus-ring`、`--h-duration-press`。不新增 elevation / shadow。

交互状态：

- pointer cursor、按压 soft background、短时背景过渡。
- `:focus-visible` 使用向内焦点环，避免在裁切容器中丢失。
- `prefers-reduced-motion: reduce` 下关闭背景 transition。

## 兼容性与风险

- 仅使用 Vue 3.5 `useId`、现有 `HIcon` 与已存在 peer `@lucide/vue`，无新增依赖。
- CSS 直接子选择器要求 `HCell` 直接放在 group default slot 中；文档明确此组合契约。
- `div[role=button]` 可保留 suffix 的布局自由度，但交互控件不得嵌入 clickable 行；文档和示例必须明确。
- 旧列表组件名不恢复，因此不会重新引入被删除公共 API；这是新增 API，不提供迁移别名。

## 回滚

实现均为独立新增。回滚时移除两个 SFC、cell CSS、cell token、导出、playground、文档导航和三份规范增量即可；无数据迁移或宿主状态变更。