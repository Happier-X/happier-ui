# Design — HCellGroup 卡片形态

## 1. 边界

- 仅改 `HCellGroup`（API + 样式）。`HCell` 零改动。
- 形态三态：`card` / `inset` / `flat`，默认 `inset`（与现状一致）。

## 2. API 契约

```ts
// HCellGroup.vue
interface HCellGroupProps {
  title?: string        // 不变
  inset?: boolean       // 保留，兼容映射（默认 true）
  variant?: 'card' | 'inset' | 'flat'  // 新增，优先于 inset
}
```

解析（新增 computed）：

```ts
const resolvedVariant = computed(() => props.variant ?? (props.inset ? 'inset' : 'flat'))
```

模板 class 由「布尔二分」改为三态：

```vue
<section class="h-cell-group" :class="`h-cell-group--${resolvedVariant}`" ...>
```

- `variant` 未传 + `inset` 默认 true → `inset`（现状）
- `variant` 未传 + `inset=false` → `flat`（现状）
- `variant='card'` → `card`（含 inset=false 时也以 card 为准，优先级明确）

## 3. 样式设计（cell.css）

新增 `--card` 形态规则（其余规则不动）：

```css
.h-cell-group--card .h-cell-group__body {
  margin: 0 var(--h-cell-group-margin-x, 16px);
  /* border-radius / background / overflow 沿用现有 .h-cell-group__body 规则 */
}
```

- 圆角：复用现有 `--h-cell-group-radius`（inset 同款），不新增 radius token。
- 背景：复用 `--h-cell-bg`（surface 白）。卡片悬浮感 = 左右留白 + 宿主页面灰底（playground/docs 演示区容器用 `--h-color-bg-muted` 灰底呈现）。**不引入 box-shadow**。
- 分隔线：现有 `.h-cell-group__body > .h-cell:not(:last-child)::after` 不限形态，card 自动继承。
- header：`.h-cell-group__header` 在 body 外，卡片形态不动其位置/样式（标题留在卡片外，与 riceui「分组标题」独立展示一致）。

## 4. Token（tokens.css）

| Token | 默认 | 说明 |
|-------|------|------|
| `--h-cell-group-margin-x` | `16px` | card 形态左右留白 |

（放在现有 Cell 相关 token 组内；`tokens.md` spec 同步一行）

## 5. 兼容与迁移

- `inset` 布尔 prop 保留声明与默认值，旧代码（含 `:inset="false"`）零改动可用。
- 类名 `--inset` / `--flat` 保留；新增 `--card`。
- 无 emit / slot / 事件变化 → 无迁移成本。

## 6. 交付面

1. `src/components/HCellGroup.vue`：props + resolvedVariant + 模板 class
2. `src/styles/components/cell.css`：--card 规则
3. `src/styles/tokens.css`：--h-cell-group-margin-x
4. `playground/src/App.vue`：card 演示（灰底容器 + card/inset/flat 三态并排）
5. `docs/components/cell.md`：卡片章节（示例 + API 表 variant/inset + token 表）
6. `.trellis/spec/frontend/component-guidelines.md` + `tokens.md`：同步

## 7. 风险与回滚

- 低风险：纯增量 prop + 新增 class 规则；回滚 = 删除 --card 规则与 variant 分支即可，不影响 inset/flat。
- 视觉验收依赖目测：三态并排 + 灰底容器。
