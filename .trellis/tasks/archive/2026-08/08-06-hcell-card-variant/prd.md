# HCellGroup 增加卡片形态（对齐 riceui cell 卡片风格）

## Goal

给 `HCellGroup` 新增「卡片」形态（对齐 https://riceui.cn/components/cell.html 的卡片示例）：一组 cell 形如一张悬浮卡片（左右留白 + 圆角 + 组内分隔线）。遵守本项目原则：**无 Material elevation / 重阴影**，悬浮感靠留白与背景对比实现。单 cell 独立卡片明确不做（用户决策 A）。

## Background（已确认事实）

- riceui 卡片示例：`<rice-cell-group radius="8px" :custom-style="{margin:'0 16px'}">`——卡片是 cell-group 层面能力：圆角 + 左右外边距 + 组内 border 分隔。
- 现有 `HCellGroup`：`title`（h2 标题，#header 可覆盖）+ `inset?: boolean`（默认 true：body 圆角 `--h-cell-group-radius` + `overflow:hidden` + surface 白底；false：`flat` 无圆角）。
- 现有 `HCell`：`title` / `description` / `clickable` / `showChevron` / `ariaLabel`；`#prefix` / `#suffix` / default slots；组内分隔线 `.h-cell-group__body > .h-cell:not(:last-child)::after` 已存在，不区分形态。
- 现有形态与卡片的差距：**无外边距**（卡片紧贴页面边缘）；surface 白底在白色页面背景上无悬浮区分。
- 项目规范：无 elevation 阴影；样式消费 `--h-*` token；BEM `h-*`；`--h-color-bg-muted`（灰底）与 `--h-color-surface`（白底）已存在。
- 交付面：`docs/components/cell.md` 已有基础/API 示例；`playground/src/App.vue` 已有 inset（默认）与 flat 演示区。

## Requirements

- [R1] `HCellGroup` 新增 `variant?: 'card' | 'inset' | 'flat'` prop，默认 `'inset'`。
- [R2] 现有 `inset?: boolean` prop **保留并兼容映射**：`inset=true` → `inset`，`inset=false` → `flat`；`variant` 显式传入时优先（`variant ?? (inset ? 'inset' : 'flat')`）。类型层面 `inset` 仍在（不破坏旧用法/类型）。
- [R3] `card` 形态视觉：body 左右留白（`--h-cell-group-margin-x`，默认 16px）+ 圆角（共用 `--h-cell-group-radius`）+ 现有组内分隔线；背景沿用 `--h-cell-bg`（默认 surface 白），宿主页面背景用灰底（如 `--h-color-bg-muted`）即可形成对比悬浮感；不引入阴影。
- [R4] 分组标题（header）保持在卡片外（现有位置与样式不变）。
- [R5] 样式走 token：新增 `--h-cell-group-margin-x`（默认 16px）入 `tokens.css`；无其它硬编码尺寸。
- [R6] playground 增加 card 形态演示（与 inset/flat 对比）；`docs/components/cell.md` 增加「卡片」章节（可运行示例 + API 表 + 说明 variant/inset 优先级）。
- [R7] 不改 `HCell` 交互契约（clickable/chevron/slots/键盘行为零改动）；`HCellGroup` 无新增事件。

## Acceptance Criteria

- [ ] `variant="card"` 渲染：左右 16px 留白 + 圆角 + 组内分隔线，与 `inset` 视觉差异明确（可分辨）
- [ ] 默认用法（不传 variant / 不传 inset）渲染与改动前一致（inset 形态）
- [ ] `:inset="false"` 渲染仍为 flat；`variant="flat"` 与 `:inset="false"` 视觉一致
- [ ] `variant` 与 `inset` 同时传时 `variant` 生效（解析优先级正确）
- [ ] `--h-cell-group-margin-x` 覆盖生效（宿主改值后留白跟随）
- [ ] 标题（title/#header）位置与卡片外，不被裁切/错位
- [ ] `vue-tsc --noEmit -p tsconfig.lib.json` 零错误；`build:lib` / `docs:build` / `build:playground` 通过
- [ ] docs 页面有卡片示例与 API 表；tokens.md / component-guidelines.md 同步

## Out of Scope

- 单个 `HCell` 独立卡片形态（未来需要另起任务）
- 引入阴影 / Material elevation；改变 HCell 交互契约
- riceui 的 `icon`（字符串图标）、`url` 跳转等新 prop（本项目用 `#prefix` slot 表达图标）
- 新事件、新 slot

## Technical Notes

- 解析函数：`const resolvedVariant = computed(() => props.variant ?? (props.inset ? 'inset' : 'flat'))`；模板类名 `h-cell-group--${resolvedVariant}`。
- CSS 形态矩阵：`--inset`（现有圆角无 margin）、`--flat`（无圆角无 margin）、`--card`（圆角 + margin-x）。圆角/背景/分隔线复用现有规则，避免样式翻倍。
- 视觉验收对照：card vs inset 并排，页面容器灰底（playground 演示区可临时灰底凸显卡片悬浮感）。

## Open Questions

（无阻塞项；两个产品决策均已定：层级=仅 HCellGroup，prop=variant 三态枚举）
