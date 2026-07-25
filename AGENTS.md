<!-- TRELLIS:START -->
# Trellis Instructions

These instructions are for AI assistants working in this project.

This project is managed by Trellis. The working knowledge you need lives under `.trellis/`:

- `.trellis/workflow.md` — development phases, when to create tasks, skill routing
- `.trellis/spec/` — package- and layer-scoped coding guidelines (read before writing code in a given layer)
- `.trellis/workspace/` — per-developer journals and session traces
- `.trellis/tasks/` — active and archived tasks (PRDs, research, jsonl context)

If a Trellis command is available on your platform (e.g. `/trellis:finish-work`, `/trellis:continue`), prefer it over manual steps. Not every platform exposes every command.

If you're using Codex or another agent-capable tool, additional project-scoped helpers may live in:
- `.agents/skills/` — reusable Trellis skills
- `.codex/agents/` — optional custom subagents

Managed by Trellis. Edits outside this block are preserved; edits inside may be overwritten by a future `trellis update`.

<!-- TRELLIS:END -->

## 项目要点

- **Web 端与移动端通用** 的 Vue **语义 UI 库**；主色与 token 为 **`--h-*`**。
- 视觉 **参考 HeroUI Native**（Vue 自实现，不引 RN）；**非 Material**；不复刻 Ionic 全家桶。
- 组件在本仓库 **逐个实现**；Muses 通过 npm 消费。
- 开发：`npm run dev:playground`；实现前读 `.trellis/spec/` 与当前任务 `prd.md`。
- 回答与任务文档默认使用 **简体中文**（除非用户另有要求）。
