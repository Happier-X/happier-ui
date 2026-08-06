# Design — HToast 深色 HUD 风格重构

## 1. 目标与边界

把 `HToast` 从"浅色卡片 + 左侧语义色竖条、停靠 top/bottom"重构为 wanchun/mini `w-toast.vue` 的 iOS HUD / 微信原生风格：深色半透明圆角卡片、默认屏幕居中、内置语义图标、缩放入场动画。保持 `--h-*` token 体系、无障碍语义、teleport 契约与其余 API 不变。

## 2. API 变更

| Prop | 变更 |
|------|------|
| `position` | 类型 `'center' \| 'top' \| 'bottom'`；**默认值由 `bottom` 改为 `center`**（已确认 D1） |
| `icon` | **新增** `boolean`，默认 `true`；`false` 时隐藏整个图标区（含 `#icon` 插槽），用于纯文字 toast（已确认 D2） |
| `variant` | 不变：`default \| success \| warning \| danger` |
| `modelValue` / `duration` / `teleport` | 不变 |
| emits | 不变：`update:modelValue` / `close` |
| `#icon` 插槽 | 保留；**优先级高于内置图标**（传插槽则渲染插槽，否则渲染内置） |

内置图标映射（仅 `variant !== 'default'` 时存在）：

| variant | 字符 | 色 token |
|---------|------|----------|
| success | `✓` (\u2713) | `--h-toast-icon-success` |
| warning | `!` (\u0021) | `--h-toast-icon-warning` |
| danger | `✕` (\u2715) | `--h-toast-icon-danger` |
| default | （无内置图标） | — |

## 3. 模板结构（HToast.vue）

```vue
<Teleport :to="teleportTo" :disabled="teleportDisabled">
  <div v-if="modelValue" class="h-toast" :class="[`h-toast--${variant}`, `h-toast--${position}`]"
       :role="liveRole" :aria-live="livePoliteness" aria-atomic="true">
    <span v-if="showIcon && ($slots.icon || builtinIcon)" class="h-toast__icon" aria-hidden="true">
      <slot name="icon">
        <span v-if="builtinIcon" class="h-toast__icon--builtin">{{ builtinIcon }}</span>
      </slot>
    </span>
    <div class="h-toast__body"><slot /></div>
  </div>
</Teleport>
```

- `showIcon = props.icon !== false`
- `builtinIcon = { success: '\u2713', warning: '\u0021', danger: '\u2715', default: '' }[props.variant]`（computed）
- 内置图标 `aria-hidden="true"`，纯装饰
- role / aria-live 逻辑不变（default/success → status+polite；warning/danger → alert+assertive）

## 4. 样式设计（toast.css 重写）

### 4.1 卡片基础（对齐 w-toast）

| 属性 | 值 | token |
|------|-----|-------|
| 背景 | `rgba(31,31,31,0.82)` | `--h-toast-bg: rgba(var(--h-color-surface-dark-rgb), 0.82)` |
| 文字色 | `#FFFFFF` | `--h-toast-ink` |
| 圆角 | `16px` | `--h-toast-radius`（原 12px，改为 16px 更贴近 w-toast 的 32rpx） |
| 阴影 | `0 8px 32px rgba(0,0,0,0.18)` | `--h-toast-shadow` |
| 内边距 | `12px 20px` | `--h-toast-pad-y: 12px` / `--h-toast-pad-x: 20px` |
| 最大宽度 | `min(480px, 80vw)` | `--h-toast-max-width` 保留 480px，max-width 表达式改为 80vw |
| 布局 | `display:flex; align-items:center; gap:8px` | `--h-space-sm` |
| 图标字号 | `20px`、weight 600 | `--h-toast-icon-size` |
| 文字字号 | `15px`、weight 500、line-height 1.4 | `var(--h-font-title)` |
| 图标色 | success `#A3E4BC` / warning `#F0D48A` / danger `#F0A5A5` / default `#AEAEB2` | `--h-toast-icon-*` |

**删除**：左侧 3px 语义色竖条（`--h-toast-accent` 相关规则整体移除）。

### 4.2 位置

```css
.h-toast--center { left: 50%; top: 50%; transform: translate(-50%, -50%); }
.h-toast--top    { top: offset + safe-area; transform: translateX(-50%); }
.h-toast--bottom { bottom: offset + safe-area; transform: translateX(-50%); }
```

`--h-toast-offset` / safe-area 逻辑沿用。居中纯 CSS，**不引入遮罩层**（已确认 D4）。

### 4.3 入场动画

三种位置统一缩放淡入，`0.22s ease-out`：

```css
@keyframes h-toast-in-center {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.92) translateY(8px); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1) translateY(0); }
}
```

top/bottom 对应 keyframes 保持各自基准 transform（`translateX(-50%)`）再叠加 `scale(0.92)` + 方向位移。`prefers-reduced-motion` 下关闭动画（沿用现有媒体查询）。

## 5. Token 变更（tokens.css）

- 语义色区新增：`--h-color-surface-dark-rgb: 31, 31, 31;`（对齐 `--h-color-primary-rgb` 的 rgb 拆分模式，供半透明引用）
- Toast 段：更新 `--h-toast-radius`（16px）、`--h-toast-pad-x/y`、新增 `--h-toast-bg` / `--h-toast-ink` / `--h-toast-shadow` / `--h-toast-icon-size` / `--h-toast-icon-{default,success,warning,danger}`；保留 `--h-toast-z` / `--h-toast-max-width` / `--h-toast-offset` / `--h-toast-duration`

## 6. 兼容性与风险

| 项 | 说明 |
|----|------|
| `position` 默认值变更 | `bottom → center` 是行为变化，用户已确认；文档与 playground 同步说明 |
| 视觉大变 | 预期内（任务即视觉重构）；不涉及组件逻辑重写 |
| 内置图标 | Unicode 文本（✓/!/✕），字体回退风险低；装饰性 + aria-hidden，不进入无障碍树 |
| teleport | 不变；center 定位在 body 下不受 transform 祖先影响，`teleport=false` 仍会就地渲染（同现状） |
| 旧 token 引用 | 外部若引用 `--h-toast-accent` 将失效——属本次视觉重构的既定破坏，文档注明 |

## 7. 文档与演示同步

- `docs/components/toast.md`：更新观感描述（深色 HUD / 居中默认 / 内置图标 / `icon` prop / `position` 增加 center）
- `playground/src/App.vue` HToast 段：按钮文案更新（"成功（居中）"等）、新增 `icon=false` 纯文字示例、`#icon` 插槽覆盖示例
- `component-guidelines.md`「当前导出」与「API 约定」的 HToast 行同步

## 8. 后续任务（用户已指示）

本任务**不**做 loading 变体。完成后另立任务开发独立 **HLoading 组件**（参考 w-toast spinner：16px 圆环、浅色、0.7s 线性旋转、`prefers-reduced-motion` 关闭）。
