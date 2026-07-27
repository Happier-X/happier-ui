# Design: HeroUI 风格 HSelect

## Architecture

单文件 SFC `HSelect.vue` + 独立 CSS `select.css`，不拆复合子组件。

```
.h-select
├── label?                          (outside placement)
├── .h-select__trigger              (role=combobox, button-like)
│   ├── .h-select__start            (#start slot)
│   ├── .h-select__value            (#value 或默认 label/placeholder)
│   ├── .h-select__end              (#end slot)
│   ├── .h-select__clear?           (clearable && hasValue)
│   └── .h-select__indicator        (#indicator 或默认 chevron)
└── Teleport(popover)
    ├── .h-select__overlay?         (透明点击层，可选；或用 document 监听)
    └── .h-select__popover          (role=listbox)
        └── .h-select__option*      (role=option)
            ├── content             (#option 或 label + description)
            └── .h-select__check?   (selected)
```

## State

| 状态 | 来源 | 说明 |
|------|------|------|
| `modelValue` | prop | 受控选中值 |
| `open` | 内部 ref | 是否展开；MVP 不暴露受控 open |
| `activeIndex` | 内部 ref | 键盘高亮索引（在可选项中） |
| `triggerEl` / `popoverEl` | template ref | 定位与焦点 |

派生：

- `selectedOption` = options 中 value === modelValue 的项
- `hasValue` = modelValue 非空
- `isInvalid` = invalid \|\| Boolean(error)
- `enabledOptions` = options.filter(!disabled)

## Data flow

1. 用户点 trigger → `open=true` → 定位 popover → 焦点进 listbox（或保持 combobox 并 aria-activedescendant）。
2. 用户点 option → emit `update:modelValue` + `change` → `open=false` → 焦点回 trigger。
3. 用户点 clear → emit `''` + change → 不开关面板。
4. 用户 Esc / 点外部 → `open=false`。

### 焦点与键盘策略（推荐）

- 采用 **combobox + listbox + aria-activedescendant**（焦点留在 trigger）：实现简单，避免 focus trap；与 HeroUI/React Aria 常见模式一致。
- Arrow 键更新 `activeIndex` 并滚动进视口；Enter 选中 active；Esc 关闭。
- 打开时若已有选中，`activeIndex` 定位到选中项；否则 0。

## Positioning

MVP 不用 floating-ui：

1. `getBoundingClientRect()` 取 trigger。
2. popover `position: fixed`：
   - `top = rect.bottom + gap`
   - `left = rect.left`
   - `width = rect.width`（默认匹配 trigger）
   - `max-height` 用 token（如 280px），内部滚动。
3. 空间不足时（`rect.bottom + height > viewport`）翻到上方：`top = rect.top - height - gap`。
4. 窗口 `resize` / `scroll`（capture）时关闭或重算（MVP 推荐 **关闭**，更简单稳定）。

Teleport 默认 body，复用 `useTeleportTarget`。

## Styling

- 全量重写 `select.css`（原生 select 规则作废）。
- BEM：
  - `.h-select--{size|variant|color|radius|disabled|invalid|open|has-value|clearable|label-inside}`
  - 元素：`__trigger` / `__value` / `__indicator` / `__clear` / `__popover` / `__option` / `__check` / `__label` / `__description` / `__error`
- variant 视觉（对齐 HeroUI flat/bordered/faded/underlined）：
  - **flat**：浅底（surface-secondary）+ 无/弱边框
  - **bordered**：surface 底 + 1px border
  - **faded**：浅底 + 边框
  - **underlined**：无圆角底边线
- color 主要影响 focus-visible / open 边框与强调（default 用 focus-ring / primary）。
- radius：none/sm/md/lg/full 映射现有 `--h-radius-*` / 0 / pill。
- size：高度对齐 input token（32/40/48）。
- popover：surface 背景、细边框、圆角 md、z-index 新 token `--h-z-select`（建议 1150，介于 tab 与 bottom-sheet 之间）。
- **无 elevation 阴影**（项目禁 Material elevation）；若需层次用边框 + 背景即可。

## Compatibility

| 点 | 处理 |
|----|------|
| 现有 `options` / `modelValue` / `placeholder` / `label` / `disabled` / `clearable` / `size` / `name` / `ariaLabel` | 保留语义 |
| 原生 `<select>` 行为（表单自动提交、移动端系统 UI） | 破坏：用隐藏 `<input type="hidden" :name :value>` 保 name 提交；无系统 UI |
| `#option` slot | 保留，作用域仍 `{ option }` |
| 新增 props/slots | 向后兼容加法 |

## Trade-offs

| 选择 | 原因 | 代价 |
|------|------|------|
| 数组驱动而非复合子组件 | 与本库惯例一致、升级平滑 | 无法声明式嵌套 Section |
| 简单定位而非 floating-ui | 零依赖、够用 | 复杂碰撞/flip/shift 弱 |
| 内部 open 非受控 | MVP 简单 | 宿主无法强制开合 |
| 焦点留 trigger + activedescendant | 无 trap 依赖 | 屏幕阅读器差异需实测 |

## Rollback

- 若升级后宿主强依赖原生 select：可临时从 git 恢复旧 `HSelect.vue` + `select.css`（任务归档前保留 commit 可 revert）。
- 新 token / docs / playground 一并回退。
