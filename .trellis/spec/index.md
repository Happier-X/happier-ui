# happier-ui Spec Index

| Layer | Path | Scope |
|-------|------|--------|
| frontend | [frontend/](./frontend/) | Vue 组件库、token、playground |

## 项目定位

- **包名**：`happier-ui`
- **形态**：跨 Capacitor / Vue 的语义 UI + `--h-*` token
- **实现**：纯 Vue 优先；不 peer 强制 `@ionic/vue`
- **视觉**：直接对齐 HeroUI Native 移动端（抄样式/观感，不引 RN 依赖）；flat，无 Material elevation
- **消费方**：Muses 等应用通过 `file:` / 后续发布版本依赖

## 开发约定

1. 新组件先在 `playground/` 展示，再给消费方接入。
2. 组件命名 `H*`；业务领域（音乐封面、播放器）不进本库。
3. 视觉数值只走 `src/tokens.css` 的 `--h-*`。
4. 任务与实现优先在本仓库 Trellis 管理；Muses 侧只做依赖升级与业务页替换。
