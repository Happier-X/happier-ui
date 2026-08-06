# 发布 happier-ui 0.1.1

## Goal

将本地领先内容（HToast HUD、HLoading、HPopup #15 修复、HSidebar 类型修复、HCellGroup card 形态）以 `0.1.1`（patch）发布到 npm，并打 `v0.1.1` tag 推送。

## Confirmed Facts

- npm 账号 `happierx` 已登录；npm 上已有 0.0.1–0.0.10、0.1.0（今早 08:25 发布）。
- 本地 `package.json` 当前 `0.1.0`，内容领先 npm 0.1.0（用户决策：发 0.1.1 patch，**不 unpublish** 0.1.0）。
- 历史发布方式：`chore: bump version to X.Y.Z` 提交 + `v0.x.y` tag（git tag v0.1.0 存在）。
- `dist/` gitignore；`files: ["dist", "LICENSE", "README.md"]`；发布前需 `npm run build:lib` 保证产物最新。

## Requirements

- [R1] `package.json` version → `0.1.1`（`chore: bump version to 0.1.1` 提交）
- [R2] `npm run build:lib` 后产物齐全（index.js / index.d.ts / styles.css / tokens.css）
- [R3] `npm publish` 成功；`npm view happier-ui@0.1.1` 可查
- [R4] 打 `v0.1.1` tag 并推送（含 bump 提交与 tag）
- [R5] 归档任务 + journal

## Acceptance Criteria

- [ ] `npm view happier-ui versions` 含 `0.1.1`
- [ ] 安装验证：临时目录 `npm i happier-ui@0.1.1` 可解析、dist 四产物在
- [ ] `git tag v0.1.1` 存在并推送远端
- [ ] 工作区干净，无未提交改动

## Out of Scope

- unpublish / republish 0.1.0
- 版本号变更（用户已定 0.1.1）
- 新功能开发

## Open Questions

（无）
