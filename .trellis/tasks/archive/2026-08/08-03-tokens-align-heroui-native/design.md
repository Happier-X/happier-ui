# Design — 配色对齐 HeroUI Native + 语义自洽

## 边界与分层

- 只动「颜色」域的 token（颜色值 + 命名理顺），不动间距/圆角/字号/动效/层级 token。
- 三个文件 + 文档：
  1. `src/styles/tokens.css`（权威）——改基础色值、加 `--h-color-accent`、`rgb` 三元组、派生 accent 色阶、去重。
  2. `src/styles/theme.css`——`@theme` 映射保持 utility 名，新增 accent，同步引用。
  3. 组件 CSS 仅当引用被去重合并时微调（如 `bg-muted`→`surface-secondary`），rgba 写法不动。
  4. `docs/guide/tokens.md` + `.trellis/spec/frontend/tokens.md`——口径更新。

## 关键契约

### 1. 颜色模型
- 基础语义色用 **oklch**（与 HeroUI 同模型，值=HeroUI Native 默认）。
- 保留 `--h-color-*-rgb` = 该色的 **sRGB 三元组**（`R, G, B`），供 `rgba(var(--h-color-x-rgb), a)` 半透明（组件零改动）。
- 转换工具：实现前用脚本/在线换算 oklch→sRGB，把三元组写死在 token 上；oklch 基值与 sRGB 三元组需视觉一致。

### 2. 语义别名（规范名 + 兼容别名）
- 新增规范：`--h-color-accent` = `oklch(0.6 0.2 230)`（HeroUI accent）。
- 兼容别名：`--h-color-primary: var(--h-color-accent)`（现有 ×50 引用不动）。
- `--h-color-primary-rgb` = accent 的 sRGB 三元组。
- status：`--h-color-danger/success/warning` = HeroUI 默认 `oklch(...)`（常量），`-rgb` 同步。
- `focus-ring: var(--h-color-primary)`（不变）。

### 3. 中性色（亮暗两态，oklch）
- 亮色（对齐 HeroUI light 230 家族 + 保留现观感）：
  - `ink`（前景）≈ `oklch(0.2 0.01 230)`
  - `ink-muted` ≈ `oklch(0.5 0.03 230)`
  - `surface` = `oklch(1 0 0)`（白）
  - `surface-secondary`（= `bg-muted` 收敛）≈ `oklch(0.94 0.018 230)`
  - `border-subtle`（=`separator`）≈ `oklch(0.91 0.015 230)`
  - `bg-hover` = 介于二/三级的浅灰（现 `#f0f0f0` 语义等价）
- 暗色（方案 C，media 与 class 两组逐字一致）：`surface`≈`oklch(0.2 0.01 230)`、`ink`≈`oklch(0.95 0.005 230)`、`ink-muted`≈`oklch(0.7 0.01 230)`、`border-subtle`≈`oklch(0.35 0.008 230)`、`surface-secondary`≈`oklch(0.25 0.012 230)`、`bg-hover`≈`oklch(0.3 0.01 230)`。
- 具体 oklch 数值实现期换算 align 现 hex 观感，避免跳跃。

### 4. 派生 accent 色阶（非破坏）
- 保留 `--h-primary-50…900`，但改由 accent 派生（`oklch(from var(--h-color-accent) … )` 手动给每档）——若 oklch 派生不好写，则给每档直接写 oklch 转换值（仍为占用色阶，满足 button/docs）。
- hover/active 依旧可用 `--h-primary-400/600`（soft 用 50/100/200）。

### 5. `--muses-*` 别名
- 扩描 accent/success/warning 等需要的别名；现有别名 var() 自动继承新值，不改。

### 6. 兼容 / 回滚
- 全量兼容（同名 token，值变了但 API 未破）。回滚 = revert tokens.css + theme.css + docs 的三文件差异即可。
- 风险：oklch 浏览器兼容（现代已广泛支持；已用 color-mix 说明可接受）。

## 反复用到的数据流
`tokens.css` 单一权威 → `theme.css` `@theme` 映射 utility → 组件 `var(--h-…)` / rgba → docs/spec 描述。
∴ 先改 tokens.css 确定全套值，再同步 theme.css，再微调组件去重，最后 docs/spec。