# PRD：HBottomSheet 宽屏全宽 / 可配置 maxWidth API（issue #14）

## 背景

- GitHub issue #14：`happier-ui@0.0.8` 中 `.h-popup--position-bottom .h-popup__panel`（及 top 形态）硬限
  `max-width: var(--h-bottom-sheet-max-width, 640px)` 并居中；`HBottomSheet` 无 per-instance 覆盖入口。
- 视口 > 640px（平板横屏、桌面预览）时底栏只占 ~640px，两侧露出大块遮罩，不像常见移动端 bottom sheet 贴底通栏。
- 消费方（Muses，Capacitor Android + 桌面宽屏预览）为默认用法，不愿做全局 `:root` token hack。

## 目标

1. **默认通栏**：bottom/top 形态默认 `max-width: 100%`（edge-to-edge，移动端 idiom）；
   宽屏预览不再「底栏很窄」，手机竖屏行为不变（原 `width:100%` 即近似全宽）。
2. **per-instance 覆盖能力**：`HPopup` 新增 `maxWidth?: string | number` prop（写入 inline
   CSS 变量 `--h-bottom-sheet-max-width`），`HBottomSheet` 透传。想保留桌面居中卡片感时
   传 `max-width="640px"`（或任意值 / `'none'` / 数字 px），无需全局改 token。
3. **文档化**：`docs/components/bottom-sheet.md`、`docs/components/popup.md` 写明
   默认行为（edge-to-edge）与 `--h-bottom-sheet-max-width` token 的用途（宽屏限宽 / 桌面居中卡片）；
   tokens 组说明同步更新。
4. **playground 演示**：补「默认全宽 / maxWidth 限宽」对比演示，供目视回归。

## 约束

- 向后兼容：不传新 prop 时，除「默认上限 640px → 100%」这一 issue 明确要求的行为变化外，其余不变；
  消费方已自行覆盖 `--h-bottom-sheet-max-width` 的仍然生效（变量覆盖优先于 CSS fallback）。
- 只写 `--h-*` token；样式走 `@layer components`；无 scoped 视觉 CSS。
- `maxWidth` 数字类型按 px 处理（与库内其它尺寸 prop 约定一致）。
- 不改动 left/right/center 形态的既有宽度 token（`--h-popup-max-width-side` / `--h-popup-max-width-center`）。

## 验收标准

1. 视口 ≥ 800px 打开 `HBottomSheet`（默认用法），面板贴底通栏，两侧无遮罩露出。
2. `HBottomSheet :max-width="640"` 或 `max-width="640px"` 时，宽屏面板居中最宽 640px（卡片感）；
   `max-width="none"` / 不传 时通栏。
3. `HPopup position="bottom" / "top"` 同样支持 `maxWidth` prop。
4. 全局覆盖 `:root { --h-bottom-sheet-max-width: 640px }` 仍生效（不传 prop 时）。
5. 文档（bottom-sheet.md / popup.md / tokens 组）已写明默认行为与 token 意图。
6. playground 有全宽 / 限宽两个演示段。
7. `npm run build`（lib）与 playground 无报错；type-check 通过。
