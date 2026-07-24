# HProgress 实施计划

## 实现步骤

- [x] 新建 `src/components/HProgress.vue`：定义 props、有限数归一化、百分比计算、BEM classes 与 progressbar ARIA。
- [x] 在 `src/styles/tokens.css` 增加 HProgress 高度、轨道、填充和动画时长 token。
- [x] 新建 `src/styles/components/progress.css`：实现确定进度、indeterminate、尺寸、variant、rounded 与 reduced-motion。
- [x] 在 `src/styles/components.css` 引入 progress CSS，在 `src/index.ts` 导出 `HProgress`。
- [x] 在 `playground/src/App.vue` 增加确定进度、动态 value、indeterminate、size、variant 和 rounded 演示。
- [x] 新建 `docs/components/progress.md`，覆盖基础、不确定进度、尺寸、语义色、API、边界行为和无障碍。
- [x] 在 `docs/.vitepress/config.ts` 增加 Progress 导航项。
- [x] 同步 `.trellis/spec/frontend/component-guidelines.md`、`tokens.md`、`quality-guidelines.md` 的组件/API/token/a11y 契约。

## 验证

按顺序执行：

```bash
npm run build:playground
npm run docs:build
npm run build:lib
npm pack --dry-run
```

检查点：

- 构建无 Vue/TypeScript/CSS 错误。
- `dist/index.d.ts` 包含 `HProgress` 导出；`dist/styles.css` 包含 `.h-progress`。
- npm tarball 不包含 `src`、`playground`、`docs`、`.trellis`。
- 目视确认三种尺寸稳定、四种语义色正确、确定进度宽度正确、不确定动画可见、`rounded=false` 无圆角。
- 检查确定/不确定模式的 `aria-valuenow` 输出差异和非法数值归一化。

## 风险与回滚点

- 数值归一化是主要逻辑风险：先完成组件与 playground，确认边界值后再同步文档。
- indeterminate 动画是主要视觉风险：确保仅 transform 动画，并单独验证 reduced-motion 静态回退。
- 若验证失败，按独立文件边界移除 HProgress 相关增量；不修改或回退其他组件。
