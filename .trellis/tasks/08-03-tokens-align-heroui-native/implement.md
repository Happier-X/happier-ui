# Implement — 配色对齐 HeroUI Native + 语义自洽

## 前置验证命令
- 构建：`npm run build`（产出 dist/tokens.css、dist/styles.css）
- Playground：`npm run dev:playground`
- 参考：`.trellis/spec/frontend/tokens.md`（本任务同时要更新它）

## 实施顺序（依赖从 targets 到 consumers）

1. **换算并锁定颜色值**
   - 用 oklch→sRGB 换算（如 https://oklch.com）把以下确定下来：accent `oklch(0.6 0.2 230)`、success `0.72 0.14 165`、warning `0.78 0.12 85`、danger `0.68 0.18 15`、以及中性亮/暗各档的 oklch 与对应 sRGB 三元组。

2. **改 `src/styles/tokens.css`（权威）**
   - 加 `--h-color-accent: oklch(0.6 0.2 230)`；`--h-color-primary: var(--h-color-accent)`。
   - 更新 `--h-color-success/warning/danger` 为 oklch；同步其 `-rgb` 三元组。
   - 中性色改 oklch（亮 base :root + 暗 media + 暗 class 两组一致）。
   - 派生 `--h-primary-50…900` 基于 accent 赋值。
   - 去重：`bg-muted = surface-secondary`、`separator = border-subtle`（值收敛，保留双别名以不破引用）。
   - `--muses-*` 补 accent/success/warning 别名。

3. **改 `src/styles/theme.css`**
   - `@theme` 增加 `--color-h-accent`；`--color-h-primary`/`primary-*`、`surface/ink/border-subtle/…` 引用不变（值自动跟随）。
   - 若引入 accent utility，补进 docs。

4. **组件 CSS 去重微调**
   - 搜 `--h-color-bg-muted`，若观感需与 `surface-secondary` 区分则保留各自 oklch；否则收敛。避免无关改动。
   - 核对 rgb 相关组件（badge/button/input/select/tag/scrollbar）仍走 `rgba(var(--h-color-x-rgb))` 正常。

5. **文档 + spec**
   - `docs/guide/tokens.md`：把 `HeroUI blue primary`/`#006fee` 口径改为 `HeroUI Native oklch`，更新语义表 + 派生色阶说明。
   - `.trellis/spec/frontend/tokens.md`：同步 oklch + HeroUI Native 默认值口径，改「视觉源」段。

6. **验证**
   - `npm run build` 通过；确认 `dist/tokens.css` 含 oklch accent、`-rgb` 三元组正确。
   - `npm run dev:playground` 手测：button variant hover/active/soft 亮暗两态、badge/select focus ring、scrollbar danger overlay 半透明观感。
   - 校验 media/class 暗色两组逐字一致。

## 回滚点
- 本次为纯 token 值变更，rollback = revert 上述三至四文件 diff（tokens.css/theme.css/组件微调/docs）。无数据迁移。
- 风险文件：`tokens.css`（最大单一改动源）、`theme.css`。

## 评审门
- 提交前跑一遍组件渲染（playground 亮暗切换），确认无「换色源后观感失控」。