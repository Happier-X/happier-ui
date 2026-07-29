# 发布 v0.0.7

## Goal

发布 `happier-ui@0.0.7` 到 npm，包含自 `0.0.6` 以来的变更——主要是 HNavBar/HTabBar safe-area Capacitor 8 回退修复（#12）。

## Requirements

### R1：版本号

- 从 `0.0.6` 升到 `0.0.7`（patch bump，仅修复）

### R2：构建

- `npm run build:lib` 通过，产物完整（dist/index.js, dist/styles.css, dist/tokens.css, dist/*.d.ts）
- `npm pack --dry-run` 验证 tarball 内容正确

### R3：发布

- `npm publish` 发布到 npm registry
- 打 git tag `v0.0.7` 并推送（含 tag）

## Acceptance Criteria

- [ ] **AC1**: `npm run build:lib` 退出码 0，无报错
- [ ] **AC2**: `npm publish` 成功后可在 `npm view happier-ui` 看到 `0.0.7`
- [ ] **AC3**: git tag `v0.0.7` 已创建并在远程可见

## Out of Scope

- Changelog 文件生成（项目暂无 CHANGELOG.md）
- GitHub Release（仅 git tag）
- 其他组件的变更或修复
