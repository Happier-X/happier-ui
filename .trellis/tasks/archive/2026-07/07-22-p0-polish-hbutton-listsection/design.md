# 技术设计：P0 打磨 + HButton + HListSection

## 边界

| 在库内 | 不在库内 |
|--------|----------|
| `src/components/H*.vue`、`tokens.css`、`index.ts` | Muses 业务页 |
| `playground` 演示 | Ionic / HeroUI RN 运行时 |
| 更新 frontend spec 导出表 | 路由、Modal 引擎 |

## 视觉与 token

- 观感对齐 HeroUI Native；数值进 `src/tokens.css` 的 `--h-*`。
- 本任务建议新增/补齐（按实现取用）：
  - `--h-color-success` / `--h-color-warning`（若 empty/notice 暂不用可延后）
  - `--h-color-focus-ring`（可与 primary 对齐）
  - `--h-button-height-sm|md|lg`、`--h-button-pad-x-*`、`--h-button-font-*`
  - `--h-surface-secondary` 已有；list inset 背景用 surface / surface-secondary
  - `--h-radius-control` 已有，按钮与 section 复用
- 组件样式：`var(--h-…, fallback)`；禁止新 `m-*` 类。

## 组件契约

### HIconButton（打磨）

```ts
variant?: 'default' | 'ghost' | 'subtle' | 'danger' | 'on-media'  // default: 'default'
size?: 'md' | 'lg'
loading?: boolean   // aria-busy；可选简单旋转或降低透明度 + pointer-events
// 保留：icon?, ariaLabel, disabled, color?, stopPropagation?
```

- `danger`：danger 色（现有 `--danger` class 可并入 variant）。
- `subtle`：浅底 soft fill；`ghost`：透明 + 弱字色。
- 不 import `@ionic/vue`。

### HListRow（打磨）

```ts
selected?: boolean     // 视觉选中态（可与 playing 叠加规则：playing 优先或并列 class）
density?: 'comfortable' | 'compact'  // comfortable = 现 72px 行高
// 保留：title, subtitle, playing, button, showStartWhenEmpty, showPlayingIndicator
// slots: start, end
```

- `selected`：背景用 `--h-color-playing-bg-soft` 或专用 selected token。
- `playing` 语义保留（「正在播放」），不与 selected 合并成一个 prop。

### HSettingRow（打磨）

- 类名：`m-setting-row*` → `h-setting-row*`。
- token：全部 `--h-*`。
- 可选：`interactive?: boolean` + emit `click`；为 true 时 `role="button"` + 键盘。

### HEmptyState（打磨）

- 类名：`m-empty-state*` → `h-empty-state*`。
- 样式变量：`--muses-*` → `--h-*`。
- 可选：`compact?: boolean`（减小 min-height）。
- slots：default 操作区；可选 `icon` 具名槽（有则展示）。

### HButton（新增）

```ts
variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger' | 'danger-soft'
size?: 'sm' | 'md' | 'lg'
disabled?: boolean
type?: 'button' | 'submit' | 'reset'  // default button
// slots: default = label；可选 leading / trailing
// emit: click
```

- 根节点：原生 `<button>`。
- MVP 必须完整实现全部 7 variant 或至少 **primary / secondary / outline / ghost / danger**（其余可用接近映射）；推荐一次做满 7 个，对齐 HeroUI Native。
- 无 elevation；pressed 用 background/opacity（`--h-duration-press`）。
- `focus-visible` 使用 focus ring token。

### HListSection（新增）

```ts
title?: string
inset?: boolean   // true：圆角卡片式分组（默认 true 或 false 需定：推荐 default false=flat 全宽，inset=true 时 margin+radius+surface）
// slots: default（rows）；header（覆盖 title 自定义）
```

- 结构：
  ```html
  <section class="h-list-section" :class="inset && 'h-list-section--inset'">
    <header v-if="title || $slots.header" class="h-list-section__header">…</header>
    <div class="h-list-section__body"><slot /></div>
  </section>
  ```
- 不负责分隔线细节（可由 SettingRow lines 或 row 自带）。
- 不引入 ion-list。

## 导出

`src/index.ts`：

```ts
export { default as HButton } from './components/HButton.vue'
export { default as HListSection } from './components/HListSection.vue'
// 可选 M* 别名：本任务可不加 MButton（无历史名）；仅保留已有 M* 四个
```

## Playground

- 分 section：Empty / ListSection+ListRow / SettingRow / IconButton variants / Button variants×sizes。
- 不依赖 Ionic。

## 兼容与风险

| 风险 | 处理 |
|------|------|
| 改 `HSettingRow`/`HEmptyState` 类名 | 仅 scoped 内部类，无对外 CSS API；Muses 用组件非类名 |
| `color` prop 与 `variant=danger` 重叠 | `variant` 优先；`color` 保留作额外 class 兼容 |
| token 膨胀 | 只加本任务用到的 |

## 回滚

- 单组件文件可独立回退；`index.ts` 去掉新导出即可。
