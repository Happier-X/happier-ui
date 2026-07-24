# HProgress 技术设计

## 组件边界

`HProgress` 是只读的线形进度指示器，不处理用户输入，不持有内部状态，也不发出事件。组件仅根据 props 计算展示百分比与 ARIA 属性。

交付文件：

- `src/components/HProgress.vue`：props、数值归一化、DOM 与 ARIA。
- `src/styles/components/progress.css`：轨道、填充、尺寸、语义色、不确定动画与 reduced-motion。
- `src/styles/tokens.css`：HProgress 尺寸、轨道、填充与动画时长 token。
- `src/styles/components.css`、`src/index.ts`：样式汇总与公共导出。
- `playground/src/App.vue`、`docs/components/progress.md`、`docs/.vitepress/config.ts`：演示和文档入口。
- `.trellis/spec/frontend/component-guidelines.md`、`.trellis/spec/frontend/tokens.md`、`.trellis/spec/frontend/quality-guidelines.md`：公共组件、token 与无障碍契约同步。

## 公共 API

```ts
type HProgressProps = {
  value?: number
  max?: number
  indeterminate?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  rounded?: boolean
  ariaLabel?: string
}
```

默认值：`value=0`、`max=100`、`indeterminate=false`、`size='md'`、`variant='primary'`、`rounded=true`、`ariaLabel=undefined`。

无 emits、无 slots。进度内嵌文字与业务标签由宿主在组件外布局，避免组件承担格式化和标签语义。

## 数值契约

- 有效上限 `normalizedMax = max > 0 && Number.isFinite(max) ? max : 100`。
- 有效值：有限数夹取到 `[0, normalizedMax]`；非有限数按 `0` 处理。
- 百分比：`normalizedValue / normalizedMax * 100`，通过内联 CSS 自定义属性 `--h-progress-value` 传给填充层。
- `indeterminate=true` 时视觉不使用百分比，但仍保持同一 DOM，避免切换时结构变化。

## DOM 与无障碍

```html
<div
  class="h-progress h-progress--md h-progress--primary h-progress--rounded"
  role="progressbar"
  aria-label="..."
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="40"
>
  <div class="h-progress__indicator"></div>
</div>
```

- 确定进度输出 `aria-valuemin="0"`、归一化后的 `aria-valuemax` 和 `aria-valuenow`。
- 不确定进度省略 `aria-valuenow`，保留 min/max 与可访问名称。
- 组件不聚焦、不响应键盘，因为它是状态指示而非交互控件。

## 视觉与动画

- 轨道为 full-width pill，`sm/md/lg` 仅改变高度。
- variant 将局部 `--h-progress-fill` 映射到现有语义色 token。
- 确定进度以 indicator 的 `width: var(--h-progress-value)` 展示。
- 不确定进度 indicator 采用固定比例宽度和水平循环位移动画，不引入脚本计时器。
- `rounded=false` 时轨道与 indicator 圆角为 0。
- `prefers-reduced-motion: reduce` 下禁用动画，并静态显示居中的 indicator，确保状态仍可见。

新增 token：

- `--h-progress-height-sm/md/lg`
- `--h-progress-track-bg`
- `--h-progress-fill`
- `--h-progress-transition-duration`
- `--h-progress-indeterminate-duration`

variant 直接使用已有 `--h-color-*`，不为每种语义色新增重复 token。

## 兼容性与风险

- 仅使用 Vue computed、CSS 自定义属性和标准 ARIA，无新增依赖。
- `max <= 0` 或非有限数回退为 100，避免除零、负百分比和无效 ARIA 上限。
- `value` 非有限数回退为 0，避免输出 `NaN%`/`Infinity%`。
- 动画使用 transform，减少布局开销；构建与文档站作为回归门槛。

## 回滚

实现为独立新增组件。若需回滚，移除组件、CSS、token、导出、playground 段、文档页/导航和对应规范增量即可，不涉及数据迁移或宿主状态变更。
