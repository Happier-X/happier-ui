# implement — popup bottom 拖拽关闭

## 前置

- 读 spec：`component-guidelines.md` / `quality-guidelines.md`（已完成，见本任务上下文）。
- 分支：master（工作区 clean）。

## Checklist

### 1. `src/components/HPopup.vue`

- [ ] 1.1 `swipeClose` prop 注释与文件头注释更新：语义覆盖 bottom + fullscreen。
- [ ] 1.2 `rootClasses`：`h-popup--swipe-disabled` 条件 → `!props.swipeClose && (position === 'fullscreen' || position === 'bottom')`。
- [ ] 1.3 `gesturePanelStyle` / `gestureOverlayStyle`：条件放宽为 fullscreen | bottom；抽出 `getViewportHeight()` 共用（overlay 渐隐 + 滑出目标）。
- [ ] 1.4 `onTouchStart`：position 判断放宽；新增 `panel.contains(event.target)` 守卫；新增 snapping 期间忽略新 touch。
- [ ] 1.5 `onTouchEnd`：shouldClose 分流——fullscreen 保持原逻辑；bottom 走「snapping 滑到 viewportHeight + `swipeCloseTimer`(250ms) → requestClose」。
- [ ] 1.6 新增 `swipeCloseTimer` 局部计时器；`resetSwipe()` / `clearSwipeResetTimer()` 清理逻辑覆盖新计时器（可将清理收敛为统一函数）。

### 2. `src/styles/components/popup.css`

- [ ] 2.1 bottom panel 基础规则追加 `touch-action: pan-y; overscroll-behavior-y: contain;`
- [ ] 2.2 新增 `.h-popup--position-bottom` 的 `--dragging` / `--snapping`(panel + overlay) / `--swipe-disabled` 三态规则（镜像 fullscreen，见 design.md）。

### 3. 文档 `docs/components/popup.md`

- [ ] 3.1 bottom 段：补充拖拽关闭说明；演示内容加可滚动列表（`max-height` 内容触发滚动），验证「滚动 vs 拖拽」对照。
- [ ] 3.2 `swipeClose` API 行：说明改为「bottom / fullscreen 下滑关闭手势开关」。
- [ ] 3.3 「行为说明」：新增 bottom 拖拽手势条目（阈值、回弹、scrollTop 守卫、swipeClose=false 语义）。

### 4. Playground `playground/src/App.vue`

- [ ] 4.1 bottom 演示：内容改为可滚动（如 20+ 行列表），文字注明「滚动到顶部后向下拖关闭」。
- [ ] 4.2 （可选）新增 bottom + `swipe-close="false"` 对照演示。

### 5. 验证

- [ ] 5.1 `npx vue-tsc --noEmit -p tsconfig.lib.json` 零错误。
- [ ] 5.2 `npm run build:lib`、`npm run build:playground`、`npm run docs:build` 全通过。
- [ ] 5.3 dist 产物核验：`styles.css` 含 bottom 三态规则；`HPopup.d.ts` props 不变。
- [ ] 5.4 trellis-check 子代理：AC1–AC10 核验。

### 6. 收尾

- [ ] 6.1 spec 同步（如有值得沉淀的手势/拖拽约定 → `trellis-update-spec`）。
- [ ] 6.2 journal 记录 + commit（引用 issue #16）。

## Rollback

- 手势全部收敛在 `HPopup.vue` + `popup.css`，无跨文件依赖；回滚 = revert 单 commit。
- 不改 HBottomSheet / HDialog / 公共导出，API 零破坏。

## Review Gates

- Gate 1（实现后）：vue-tsc + 三构建全绿。
- Gate 2（提交前）：trellis-check 全 PASS；git diff 范围仅 4 个文件（HPopup.vue / popup.css / popup.md / App.vue）。
