# 发布 v0.0.8（HPopup keepAlive + swipeClose）

## Goal

发布 `happier-ui` 新版本到 npm，包含自 `0.0.7` 以来的变更——HPopup 新增 `keepAlive` / `swipeClose`（issue #13，commit `1401eec`）。沿用 `07-29-publish-v0.0.7` 的 tag-triggered 发布流程：bump → 本地构建验证 → 打 tag 推送 → GitHub Actions 自动构建发布。

## Background（已确认事实）

- 当前 `package.json` version = `0.0.7`。
- 变更：`src/components/HPopup.vue` 新增 `keepAlive` / `swipeClose` 两个可选 prop（默认值保持 0.0.7 行为，向后兼容），+ popup.css / docs / playground / spec。
- 发布机制：`.github/workflows/release.yml` 监听 tag `v*` push，校验 `package.json` 版本 = tag 版本，`npm run build:lib` + `npm pack --dry-run` 后用仓库 secret `NPM_TOKEN` 执行 `npm publish --access public`。**本地不手动 `npm publish`**。
- 依赖：GitHub repo 需已配置 `NPM_TOKEN` secret（上次 0.0.7 发布成功即已配置）。

## Requirements

### R1：版本号（已确认：patch `0.0.8`）

- 用户已确认：patch `0.0.8`（在现有 0.0.x 连续版本线上递增）。
- 更新 `package.json` 的 `version`：`0.0.7` → `0.0.8`。

### R2：本地构建验证（发布前）

- `npm run build:lib` 退出码 0，产物完整。
- `npm pack --dry-run` 验证 tarball 内容（不含 src/playground/docs/.trellis）。

### R3：提交 + tag + 推送

- 提交版本 bump（`chore: bump version to X.Y.Z`）。
- 打 git tag `vX.Y.Z` 并推送（含 tag），触发 Release workflow 自动发布到 npm。

## Acceptance Criteria

- [ ] **AC1**: `package.json` version 已 bump 到目标版本并提交。
- [ ] **AC2**: `npm run build:lib` 退出码 0，无报错。
- [ ] **AC3**: git tag `vX.Y.Z` 已创建并推送至远程。
- [ ] **AC4**: `npm view happier-ui` 能看到目标版本可用的（Release workflow 完成后）。

## Out of Scope

- Changelog 文件生成（项目暂无 CHANGELOG.md）。
- 手动 `npm publish`（由 workflow 自动执行）。
- 任何组件变更或修复。

## Key Decisions（已与用户确认）

| # | 决策 | 选择 | 理由 |
|---|------|------|------|
| D1 | 版本号 | **`0.0.8`（patch）** | 沿用现有 0.0.x 连续版线习惯（0.0.6→0.0.7），非破坏性增量 |