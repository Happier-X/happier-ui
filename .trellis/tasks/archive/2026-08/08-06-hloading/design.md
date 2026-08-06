# Design — HLoading 加载指示组件（两形态）

## 1. 目标与边界

新增独立 `HLoading` 组件：CSS 圆环 spinner，**内置两种展示形态**——`local`（容器内居中，页面/区块加载态）与 `global`（全屏浮层，toast 式全局 loading）。对齐 wanchun/mini `w-toast.vue` loading toast 观感。纯展示组件，无 emits；服务加载占位/反馈场景。

## 2. API

| 项 | 定义 |
|----|------|
| props | `mode?: 'local' \| 'global'`（默认 `'local'`）；`size?: 'sm' \| 'md' \| 'lg'`（默认 `'md'`）；`label?: string`（可选文字）；`ariaLabel?: string`（覆盖默认可访问名） |
| slots | default（label 内容，**优先于 `label` prop**，对齐 HToast `#icon` 插槽优先惯例） |
| emits | 无（纯展示） |

尺寸映射：sm 16px（对齐 wanchun 32rpx）/ md 24px（对齐原 table spinner）/ lg 32px（页面级）。

## 3. 模板结构（HLoading.vue）

```vue
<Teleport :to="teleportTo" :disabled="teleportDisabled">
  <div
    class="h-loading"
    :class="[`h-loading--${mode}`, `h-loading--${size}`]"
    role="status"
    :aria-label="ariaLabel ?? label ?? '加载中'"
  >
    <span class="h-loading__spinner" aria-hidden="true" />
    <span v-if="label || $slots.default" class="h-loading__label">
      <slot>{{ label }}</slot>
    </span>
  </div>
</Teleport>
```

- **local 形态**：普通渲染（宿主放在 relative 容器内），`.h-loading--local` 绝对定位覆盖父容器
- **global 形态**：`Teleport` 到 body（复用 `useTeleportTarget`，逃离 transform 祖先），`.h-loading--global` fixed 全屏 + 遮罩 + HUD 卡片
- 容器 `role="status"`（隐式 polite live region），默认可访问名"加载中"（`label` 存在时自动采用，`ariaLabel` 显式覆盖）
- spinner `aria-hidden` 纯装饰；文字走 `<slot>{{ label }}</slot>`（slot 优先）
- 两种形态内容均为**垂直排列**：spinner 上、label 下、居中

## 4. 样式设计（loading.css）

```css
@layer components {
  .h-loading {
    --h-loading-track: rgba(var(--h-color-primary-rgb), 0.22);
    --h-loading-thumb: var(--h-color-primary);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--h-space-sm, 8px);
    color: var(--h-color-ink-muted, #92949c);
    font-size: var(--h-font-body-sm, 13px);
    line-height: 1.4;
  }

  .h-loading__spinner {
    flex: none;
    width: var(--h-loading-size-md, 24px);
    height: var(--h-loading-size-md, 24px);
    border: var(--h-loading-border-md, 2px) solid var(--h-loading-track);
    border-top-color: var(--h-loading-thumb);
    border-radius: 50%;
    animation: h-loading-spin 0.7s linear infinite;
  }

  /* —— local：覆盖父容器居中（父容器需 position: relative）—— */
  .h-loading--local {
    position: absolute;
    inset: 0;
    z-index: var(--h-loading-z-local, 1);
  }

  /* —— global：全屏遮罩 + HUD 卡片（对齐 HToast 观感）—— */
  .h-loading--global {
    position: fixed;
    inset: 0;
    z-index: var(--h-loading-z, var(--h-z-toast, 1220));
    background: rgba(0, 0, 0, 0.08); /* 微遮罩，阻断交互 */
  }

  .h-loading--global .h-loading__card {
    --h-loading-track: rgba(255, 255, 255, 0.22);
    --h-loading-thumb: #ffffff;
    --h-loading-ink: #ffffff;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--h-space-sm, 8px);
    padding: 24px 32px;
    border-radius: var(--h-loading-card-radius, 16px);
    background: var(--h-loading-card-bg, rgba(var(--h-color-surface-dark-rgb), 0.82));
    box-shadow: var(--h-loading-card-shadow, 0 8px 32px rgba(0, 0, 0, 0.18));
    color: var(--h-loading-ink, #ffffff);
    max-width: 80%;
  }

  .h-loading--sm .h-loading__spinner { width/size/border-width ... }
  .h-loading--lg .h-loading__spinner { ... }

  @keyframes h-loading-spin {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .h-loading__spinner { animation: none; }
  }
}
```

- **单色**（D3）：无 color prop；local 默认 primary 系（track primary 22% + thumb primary）；global 卡片内覆盖为白色系（track 白 22% + thumb 白）
- global 遮罩 `rgba(0,0,0,0.08)` 对齐 wanchun `.w-toast-overlay--solid`；HUD 卡片底色/圆角/阴影对齐 HToast（`--h-color-surface-dark-rgb` 82%、16px、0 8px 32px）
- 边框宽度随尺寸比例（16px/1.5px、24px/2px、32px/3px）

## 5. Token 变更（tokens.css Loading 段）

```css
/* Loading（HLoading） */
--h-loading-size-sm: 16px;
--h-loading-size-md: 24px;
--h-loading-size-lg: 32px;
--h-loading-border-sm: 1.5px;
--h-loading-border-md: 2px;
--h-loading-border-lg: 3px;
--h-loading-z: var(--h-toast-z);      /* global 层级与 toast 同级 */
--h-loading-card-bg: rgba(var(--h-color-surface-dark-rgb), 0.82);
--h-loading-card-radius: 16px;
--h-loading-card-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
```

组件级尺寸 token（对齐 `--h-button-height-*` 模式）。track/thumb 不做全局 token（属覆盖变量，放 `.h-loading` 局部）。卡片观感 token 与 HToast 对等（避免直接引用 `--h-toast-*`，保持组件 token 独立）。

## 6. HTable 复用改造（D4/D8）

- `HTable.vue`：`<div class="h-table__spinner" aria-label="加载中" />` → `<h-loading mode="local" size="md" />`（import HLoading；`#loading` slot 与 `.h-table__overlay` 容器**不变**——HTable 的 loading 业务语义保持）
- `table.css`：删除 `.h-table__spinner` 规则与 `@keyframes h-spin`；`.h-table__overlay` 保留
- 观感变化：轨道从 `border-subtle`（浅灰）变为 primary 22% 透明度（同色系），属对齐 wanchun 的统一化微调；顶边保持 primary

## 7. 导出 / 文档 / 演示

- `src/index.ts` 导出 `HLoading`（含 `HLoadingProps` 类型）
- `docs/components/loading.md` 新建；`docs/.vitepress/config.ts` sidebar 组件列表加 `Loading 加载`
- `playground/src/App.vue` 加 HLoading 演示段：local（relative 容器内居中、label/slot）、global（按钮触发全屏浮层、关闭）、三档尺寸、HTable loading 态回归
- `component-guidelines.md`（命名表 / 参考实现 / API 约定 / 当前导出 / 无障碍行）与 `tokens.md`（加载指示 token 行）同步

## 8. 兼容性与风险

| 项 | 说明 |
|----|------|
| 纯新增组件 | 不破坏既有 API；HTable 仅内部视觉替换 |
| HTable 观感微调 | 轨道色 border-subtle → primary 22%（统一化，预期内） |
| local 形态定位 | 要求父容器 `position: relative`（文档注明）；无 relative 时回退为普通流内元素 |
| global 形态 | Teleport 到 body（默认），逃离 transform 祖先；z-index 与 toast 同级 |
| 无障碍 | role="status" + aria-label；spinner aria-hidden；不抢占焦点 |
| reduced-motion | spinner 动画关闭（对齐 wanchun） |
