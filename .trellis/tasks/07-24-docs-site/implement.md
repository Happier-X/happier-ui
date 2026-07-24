# 执行计划：VitePress 文档站

## 检查点

### CP0 — 脚手架

1. 安装 `vitepress`（及文档构建所需依赖）。
2. 初始化 `docs/` + `.vitepress/config.ts` + theme CSS（TW4 + styles alias）。
3. 根 `package.json` 增加 `docs:dev` / `docs:build` / `docs:preview`。
4. 验证：`npm run docs:dev` 能开首页；演示区 `bg-h-primary` 或 `HButton` 有样式。

### CP1 — 指南页

1. 首页、快速开始、安装（TW4）、tokens、theming、migration-0.0.2。
2. 内容与 README 0.0.2 一致，可更细。

### CP2 — 组件页（11）

顺序建议：Button → Icon → Empty → Image → Input → Checkbox → Switch → NavBar → TabBar → Dialog → BottomSheet。

每页：示例 + API 表 + a11y；对照 `src/components/H*.vue` 与 playground。

### CP3 — 部署与文档入口

1. `.github/workflows/docs.yml`（Pages）。
2. README 链本地/线上；可选改 `homepage`。
3. 更新 frontend directory/quality/index 相关条目。

### CP4 — 验收

```bash
npm run docs:build
npm run build:playground   # 回归：docs 改动不破坏冒烟
npm run build:lib          # 回归：tarball 仍无 docs
npm pack --dry-run
```

## Review gates

- [ ] 无 `@heroui/*` / Ionic
- [ ] 文档主路径是 TW4 + styles，非 0.0.1 style.css
- [ ] 11 组件页齐全
- [ ] npm `files` 不含 docs
- [ ] Pages workflow 不触发 npm publish

## 回滚

- 删除 `docs/` 与 workflow 即可；不影响库 runtime。
