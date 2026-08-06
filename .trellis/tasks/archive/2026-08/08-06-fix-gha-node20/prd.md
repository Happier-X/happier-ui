# 升级 GitHub Actions 版本消除 Node 20 弃用警告

## Goal

消除 GitHub Actions 运行日志中的 Node 20 弃用警告（GitHub 2025-09 起强制在 Node 24 上运行）：将 `actions/checkout@v4` / `actions/setup-node@v4` 升级到 v5（官方 Node 20 弃用修复线），保持 CI 稳定。

## Confirmed Facts

- 警告来源（publish-0.1.1 运行日志）：`actions/checkout@v4`、`actions/setup-node@v4` 被强制跑 Node 24。
- 受影响位置：`docs.yml` L31（checkout）/ L34（setup-node）；`release.yml` L24（checkout）/ L27（setup-node）。
- `upload-pages-artifact@v3` / `deploy-pages@v4` 初始未报警告 → **实施时 docs.yml 真实运行暴露**：`upload-pages-artifact@v3` 内部引用 `upload-artifact@v4`（Node 20）触发警告；其 v4（2025-08）仍处弃用线，**v5.0.0（2026-04）修复**。`deploy-pages@v4` 运行无警告，保持不动。
- 最新版本：checkout v7.0.1 / setup-node v7.0.0；**采用 v5**（Node 20 弃用官方修复线，行为变化最小，社区标准迁移路径）。
- 两个 workflow 的 `node-version: '22'` 不变。
- `docs.yml` 由 push master（paths 含 `.github/workflows/docs.yml`）自动触发 → 可真实验证。
- `release.yml` 由 `v*` tag 或 `workflow_dispatch` 触发；`workflow_dispatch` 会**真实发布 npm** → 本次不触发，仅结构校验。

## Requirements

- [R1] `docs.yml`：`actions/checkout@v4 → v5`、`actions/setup-node@v4 → v5`
- [R2] `release.yml`：`actions/checkout@v4 → v5`、`actions/setup-node@v4 → v5`
- [R3] `node-version`、`deploy-pages@v4`、其余步骤零改动
- [R4] 推送后 `docs.yml` 运行成功且无 Node 20 弃用警告
- [R5] `release.yml` 结构校验通过（yaml 合法、与 docs.yml 新版本一致）；不触发真实发布

## Acceptance Criteria

- [ ] push 后 docs workflow 成功（gh run list 显示 success）
- [ ] docs workflow 日志无 "deprecated ... Node.js 20" 警告
- [ ] release.yml yaml 解析合法；git diff 仅 actions 版本行
- [ ] 工作区干净；任务归档

## Out of Scope

- 升级到 checkout v7 / setup-node v7（大版本跳跃，无需求不升）
- 触发 release.yml（会真实发布 npm）
- 其它 workflow 逻辑变更

## Open Questions

（无）
