# Implement：HBottomSheet 宽屏全宽 / maxWidth API

## 顺序清单

1. **tokens**：`src/styles/tokens.css` — `--h-bottom-sheet-max-width` 默认 `640px` → `100%`。
2. **CSS**：`src/styles/components/popup.css` — bottom/top 面板 `max-width` fallback `640px` → `100%`；注释说明默认全宽。
3. **HPopup.vue**：props + `toCssLength` + `panelWidthStyle` computed + template `:style` 数组插入。
4. **HBottomSheet.vue**：props + 透传。
5. **文档**：bottom-sheet.md（API 表 + 默认行为）、popup.md（maxWidth 说明）、tokens.md（底部面板组标注）。
6. **playground**：HBottomSheet 段补「限宽 640px」对照演示 + state。
7. **验证**：
   - `npx vue-tsc --noEmit`（或项目 type-check 命令）通过；
   - `npm run build`（lib）通过；
   - `npm run dev:playground` 目视：默认全宽通栏 / `:max-width="640"` 居中卡片 / 全局 token 覆盖仍生效。
8. **spec 更新**：component-guidelines.md「底部面板」行补 `maxWidth`；tokens.md 底部面板组默认值说明（若未在步骤 5 完成）。
9. **提交**：commit（feat: HBottomSheet/HPopup maxWidth + 默认全宽）+ 关闭 issue #14（gh issue close 14 或 commit 内 close）。

## 验证命令

```bash
npx vue-tsc --noEmit -p tsconfig.lib.json   # 类型检查
npm run build:lib                            # lib 构建（vite build）
```

## 回滚点

- 步骤 3 前：仅 tokens/CSS 变更（可独立回退）。
- 每步一个小 commit 时以「tokens/CSS → 组件 → 文档/playground」三组提交为单位。
