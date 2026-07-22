# Bootstrap Task: Fill Project Development Guidelines

**Status**: 已按 happier-ui 真实代码填满 frontend spec；backend 层标记为不适用。

## Status

- [x] Fill backend guidelines — **N/A**：删除空模板，仅保留 `backend/index.md` 说明无服务端
- [x] Fill frontend guidelines — directory / component / tokens / hook / state / type / quality
- [x] Add code examples — 引用 `HIconButton`、`HListRow`、`playground/App.vue`、`src/index.ts` 等真实路径

## 完成说明

1. **Frontend** 全部可执行约定来自当前 `src/` + `playground/` + 已归档组件路线图。
2. **Backend** 模板文件已移除，避免后续实现任务误加载空后端规范。
3. 新增 `frontend/tokens.md`（本库核心，原模板没有）。
4. 根 `spec/index.md` 与 `AGENTS.md` 视觉策略已对齐「直接抄 HeroUI Native」。

## 归档前

确认无 placeholder 后：

```bash
python ./.trellis/scripts/task.py archive 00-bootstrap-guidelines
```
