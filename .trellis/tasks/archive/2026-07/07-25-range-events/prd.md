# HRange 事件契约完善（change / drag 生命周期）

## Goal

为 `HRange` 补齐用户交互的事件契约，使其能够零回归替换 Ionic `ion-range`，特别是媒体进度条这类「拖动预览、松手提交」的高价值场景。

## Background

- 提案来自 Muses 项目任务 `07-24-replace-player-range`：播放器进度条（`PlayerPage.vue`）当前用 `ion-range`，评估结论是 `HRange` 在结构与视觉上已满足，唯独缺一条「释放时提交」的事件语义，导致无法零回归替换。
- `ion-range` 的两级事件语义：
  - `ionInput`：拖动过程中连续 fire（对应 HRange 已有的 `update:modelValue`）。
  - `ionChange`：释放时 fire 一次（HRange **当前缺失**）。
- 现状 `HRange`（`src/components/HRange.vue`）是单根原生 `<input type="range">`，只把 native `input` 映射为 `update:modelValue`，未把 native `change` 收编为组件 emit。
- 宿主目前只能依赖「单根 input + 未设 `inheritAttrs: false`」让 `@change` fallthrough 到底层 input，这是实现细节而非正式契约，任何结构调整都会静默破坏媒体 seek 这条敏感路径。
- 原生 `<input type="range">` 本身区分 `input`（连续）与 `change`（释放/回车），实现只需 forward 一层。

## Requirements

### Required

- `HRange` 新增 `change` emit，payload 为 `number`。
- `change` 触发时机（对应用户完成一次值改变）：
  - 拖动 knob 后松手（native `change`）。
  - 键盘调整后失焦或按下回车（native `change`）。
  - 直接点击轨道跳转。
- `change` 的 payload 与 `update:modelValue` 一致，走同一套 `normalize`（夹取 + step 对齐 + 浮点修约）。
- programmatic 修改 `modelValue` **不**触发 `change`（仅真实用户交互触发，与现有 `update:modelValue` 语义一致）。
- `disabled` 态下不触发 `change`。
- 现有 `update:modelValue` 行为保持不变，无回归。

### Nice-to-have（本次一并实现）

- 新增拖动生命周期事件，payload 均为 `number`：
  - `drag-start(value)`：进入用户交互（pointerdown / touchstart / keydown 开始改值）时的当前值。
  - `drag-end(value)`：结束交互（pointerup / touchend / blur）时的最终值；时序上先于 `change` 或与之一致。
- `disabled` 态下不触发 `drag-start` / `drag-end`。

## Acceptance Criteria

- [ ] `HRange` 的 emits 声明中新增 `change`，`change: (value: number)`。
- [ ] 构建产物 `dist/components/HRange.vue.d.ts` 中 `change` 类型自动生成到位（由 vite-plugin-dts 生成，不手改源类型）。
- [ ] 用户拖动松手后 `@change` 触发一次，payload 为释放时的最终归一化值。
- [ ] 点击轨道跳转触发一次 `@change`。
- [ ] 键盘方向键调整后失焦或回车触发 `@change`。
- [ ] programmatic 修改 `modelValue` **不**触发 `@change`。
- [ ] `disabled` 态下不触发 `@change`。
- [ ] 新增 `drag-start` / `drag-end` emit，交互开始/结束各触发一次，`disabled` 态不触发。
- [ ] 现有 `update:modelValue` 行为无回归。
- [ ] playground 与组件文档（`docs/components/range.md`）同步新增事件说明；前端组件规范同步。
- [ ] 类型检查与 `build:lib` 构建通过。

## Out Of Scope

- 修改现有 props、样式、尺寸或可访问性实现。
- 双 thumb、垂直方向、tooltip 等 range 功能扩展（沿用既有 out-of-scope）。
- Muses 宿主侧的实际替换改造（属 Muses 项目 `07-24-replace-player-range`）。

## Notes

- 版本影响：纯增量 emit，非破坏性。落地后建议发布 `0.0.3`。
