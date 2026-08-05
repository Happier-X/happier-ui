# Design：HBottomSheet 宽屏全宽 / maxWidth API

## 决策记录

| # | 决策 | 理由 |
|---|------|------|
| D1 | 默认通栏：bottom/top 面板 `max-width: var(--h-bottom-sheet-max-width, 100%)`；tokens.css 默认 `--h-bottom-sheet-max-width: 100%` | issue 期望 A；移动端 bottom sheet 贴底通栏是 idiom；宽屏预览不再窄条。消费方覆盖变量仍生效（inline var 覆盖 token，token 覆盖 fallback 的优先级链不变） |
| D2 | `HPopup` 新增 `maxWidth?: string \| number` prop；`HBottomSheet` 透传 | issue 期望 C；per-instance 覆盖入口。数字按 px，字符串原样（支持 `'640px'` / `'none'` / `'100%'`） |
| D3 | 实现方式：inline CSS 变量 `--h-bottom-sheet-max-width`（不是直接写 `max-width` style） | 单一覆盖通道；CSS 规则里已有 `margin: 0 auto` 居中逻辑自动复用；不引入新的 BEM 修饰类 |
| D4 | 不引入断点媒体查询（不做「md+ 限宽」） | issue 将此项标为可选；引入断点会改变桌面默认观感且与「默认全宽」冲突。桌面居中走显式 `maxWidth` / token |
| D5 | 不改 left/right/center 形态与 `--h-popup-max-width-side/center` | 超出 issue 范围；避免破坏性变更 |

## 数据流

```
HBottomSheet(maxWidth) ──prop 透传──► HPopup(maxWidth)
                                          │
                                     computed(panelWidthStyle)
                                          │  { '--h-bottom-sheet-max-width': '640px' }
                                          ▼
                              :style="[panelStyle, panelWidthStyle, gesturePanelStyle]"
                                          │
                                          ▼
                     CSS: max-width: var(--h-bottom-sheet-max-width, 100%)
```

优先级链（同一元素上）：
inline var（prop） > `:root` 覆盖（消费方全局 token） > tokens.css 默认 `100%` > CSS fallback `100%`。

## 变更清单

1. `src/styles/tokens.css`：`--h-bottom-sheet-max-width: 640px` → `100%`（底部面板组）。
2. `src/styles/components/popup.css`：
   - bottom 面板 `max-width: var(--h-bottom-sheet-max-width, 640px)` → `…, 100%`；
   - top 面板同样替换 fallback 为 `100%`（共用同一 token，保持一致）；
   - 文件头注释补充「默认全宽、token/prop 可限宽」意图。
3. `src/components/HPopup.vue`：
   - props 增加 `maxWidth?: string | number`（默认 undefined）；
   - 新增 `panelWidthStyle` computed：`maxWidth` 存在时返回
     `{ '--h-bottom-sheet-max-width': toCssLength(maxWidth) }`，否则 `{}`；
   - `toCssLength(v: string | number)`：number → `${v}px`，string 原样；
   - template 的 panel `:style` 数组插入 `panelWidthStyle`。
4. `src/components/HBottomSheet.vue`：
   - props 增加 `maxWidth?: string | number`（默认 undefined）；
   - 透传 `:max-width="maxWidth"`。
5. 文档：
   - `docs/components/bottom-sheet.md`：API 表加 `maxWidth`；「默认全宽（edge-to-edge），宽屏需居中卡片时传 `maxWidth` 或覆盖 token」说明；
   - `docs/components/popup.md`：`maxWidth` 说明（bottom/top 生效，其它 position 无效）；
   - tokens 文档（tokens.md 底部面板组）标注 `--h-bottom-sheet-max-width` 默认 `100%`、用途为「宽屏限宽」。
6. `playground/src/App.vue`：HBottomSheet 段增加「限宽 640px」演示（与默认全宽对照），并加对应 state。

## 不做（非目标）

- 不引入 `fullWidth` boolean（默认已全宽，冗余）。
- 不加断点 / 响应式限宽逻辑。
- 不改 `bottom-sheet.css` 兼容占位文件。
- 不改 `--h-popup-max-width-side` / `--h-popup-max-width-center`。
