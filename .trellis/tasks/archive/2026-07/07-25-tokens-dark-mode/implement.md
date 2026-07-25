# Implement — tokens 去 Ionic 依赖 + 独立暗色态（#11）

## 执行清单

1. **去 Ionic**（`src/styles/tokens.css` `:root` 内 L31-L39 附近）
   - `--h-color-ink: var(--ion-text-color, #000000)` → `#000000`
   - `--h-color-ink-muted: var(--ion-color-medium, #92949c)` → `#92949c`
   - `--h-color-border-subtle: var(--ion-color-step-150, #e0e0e0)` → `#e0e0e0`
   - `--h-color-cover-placeholder: rgba(var(--ion-color-medium-rgb, 146, 148, 156), 0.16)` → `rgba(146, 148, 156, 0.16)`
   - `--h-color-danger: var(--ion-color-danger, #eb445a)` → `#eb445a`

2. **新增暗色覆盖块**（放 `:root { ... }` 闭合之后、`@theme`/其它前，或文件语义色区块附近的独立块）
   - `@media (prefers-color-scheme: dark) { :root:not(.light) { ...6 个中性色暗值... } }`
   - `:root.dark, .dark { ...同一组 6 个暗值... }`
   - 6 个 token：surface `#1c1c1e`、surface-secondary `#2c2c2e`、ink `#ffffff`、ink-muted `#a1a1aa`、border-subtle `#38383a`、cover-placeholder `rgba(255,255,255,.14)`

3. **验证去 ion**：`grep -n "\-\-ion" src/styles/tokens.css` 应为空。

4. **构建三连**
   - `npm run build:lib`（HSidebar ImportMeta.env 预存在报错除外）
   - `npm run build:playground`
   - `npm run docs:build`
   - 核验 `dist/styles.css` / `dist/tokens.css` 含暗色块且无 `--ion-`。

5. **目视核验**（playground dev 或 docs）：切系统暗色 / 给 `<html>` 加 `.dark`，确认 surface 变暗、ink 变亮、按钮/卡片/输入框/表格/heatmap 可读。

6. **spec 更新**（`.trellis/spec/frontend/tokens.md`）
   - 「已知债」里移除/更新「反向依赖 Ionic」条目（若有）。
   - 新增约定：语义中性色为库内自洽基色，不依赖宿主；暗色态经 `@media prefers-color-scheme` + `.dark`/`:root.dark` class 双触发（class 覆盖 media），`.light` 可强制回浅。

## 验证命令

```bash
npm run build:lib
npm run build:playground
npm run docs:build
grep -n "\-\-ion" src/styles/tokens.css   # 期望空
grep -n "prefers-color-scheme" dist/styles.css  # 期望命中
```

## 风险 / 回滚点

- 单文件改动（tokens.css）+ spec，回滚 = `git checkout src/styles/tokens.css`。
- 暗色色值可后续微调，不影响 API。
- 不动 theme.css / 组件 CSS / SFC，回归面小。

## 已知无关报错

- `src/components/HSidebar.vue:119 TS2339 ImportMeta.env` —— 预存在，不在本任务范围，不修。
