# Implement — HToast 深色 HUD 风格重构

## 实施清单（顺序执行）

1. **`src/styles/tokens.css`**
   - 语义色区（`--h-color-surface-dark` 旁）新增 `--h-color-surface-dark-rgb: 31, 31, 31;`
   - Toast 段更新：`--h-toast-radius: 16px`、`--h-toast-pad-x: 20px`、`--h-toast-pad-y: 12px`；新增 `--h-toast-bg`、`--h-toast-ink`、`--h-toast-shadow`、`--h-toast-icon-size`、`--h-toast-icon-default/success/warning/danger`
2. **`src/styles/components/toast.css`** — 整体重写：
   - 深色 HUD 卡片（bg/ink/radius/shadow/padding/max-width 80vw/flex 布局）
   - `--h-toast--center/top/bottom` 三位置；移除左侧竖条 `--h-toast-accent`
   - 三个入场 keyframes（scale 0.92 + 方向位移淡入，0.22s ease-out）；reduced-motion 分支保留
   - variant 图标色（`--h-toast-icon-*`）
3. **`src/components/HToast.vue`**
   - `position` 类型加 `'center'`，默认值改 `'center'`
   - 新增 `icon?: boolean` prop（默认 `true`）
   - computed `builtinIcon`（success ✓ / warning ! / danger ✕）；模板增加内置图标渲染（`#icon` 插槽优先）
   - 更新文件头注释（观感/API 说明）
4. **`playground/src/App.vue`** HToast 演示段
   - 按钮文案改"成功（居中）"等；新增纯文字 `icon=false` 示例与 `#icon` 插槽覆盖示例；同步 smoke 提示文案
5. **`docs/components/toast.md`** — 同步观感描述、`position` 增加 center、`icon` prop、API 表
6. **`.trellis/spec/frontend/component-guidelines.md`** — 更新「当前导出」HToast 行与「API 约定·轻提示」行（position center / icon）

## 验证命令

| 检查 | 命令 |
|------|------|
| 目视回归 | `npm run dev:playground` — 居中默认、top/bottom、四种 variant、icon=false、`#icon` 插槽、teleport=false |
| 库构建 | `npm run build:lib` |
| 文档构建 | `npm run docs:build` |

## 风险点 / 回滚

- **风险**：`position` 默认值变更影响现有使用方（预期，已确认）；`--h-toast-accent` 对外失效（既定破坏）。
- **回滚点**：改动集中在 3 个源文件 + playground + docs + spec；git 干净基线可直接 revert 本次 commit。
- **遗留**：不实现 loading 变体；后续独立任务开发 HLoading 组件（参考 w-toast spinner）。
