# Implement — HCellGroup 卡片形态

## 前置

- [ ] 已读 `.trellis/spec/frontend/`（component-guidelines / tokens / quality-guidelines）
- [ ] 已读 `prd.md` + `design.md`

## 实施清单（有序）

1. **`src/components/HCellGroup.vue`**
   - props 增加 `variant?: 'card' | 'inset' | 'flat'`（默认 undefined）
   - 新增 `resolvedVariant` computed：`props.variant ?? (props.inset ? 'inset' : 'flat')`
   - 模板 class 改为 `` :class="`h-cell-group--${resolvedVariant}`" ``（替换 inset/flat 二分）
   - 更新文件头注释（三态说明）

2. **`src/styles/components/cell.css`**
   - 新增 `.h-cell-group--card .h-cell-group__body { margin: 0 var(--h-cell-group-margin-x, 16px); }`
   - 确认 `--inset` / `--flat` 规则不变；card 继承现有 body 圆角/背景/overflow 与分隔线

3. **`src/styles/tokens.css`**
   - Cell token 组内新增 `--h-cell-group-margin-x: 16px;`

4. **`playground/src/App.vue`**
   - HCell/HCellGroup 演示区：新增 card 形态示例（灰底容器 `background: var(--h-color-bg-muted)` + `variant="card"`，与 inset/flat 并排）

5. **`docs/components/cell.md`**
   - 新增「卡片」章节：可运行示例（灰底容器 + variant="card"）+ API 表补 `variant` 行（注明 inset 兼容映射与优先级）+ token 表补 `--h-cell-group-margin-x`

6. **`.trellis/spec/frontend/`**
   - `component-guidelines.md`：HCellGroup 一行描述补 variant 三态
   - `tokens.md`：cell 组 token 行补 `--h-cell-group-margin-x`

## 验证命令

```bash
npx vue-tsc --noEmit -p tsconfig.lib.json      # 零错误
npm run build:lib                               # 通过
npm run build:playground                        # 通过
npm run docs:build                              # 通过
```

## 手工验收（playground 目测）

- [ ] card 形态：左右 16px 留白 + 圆角 + 组内分隔线，灰底容器上呈悬浮卡片
- [ ] 默认（不传 prop）与改动前一致
- [ ] `:inset="false"` 仍 flat；`variant="flat"` 与之一致
- [ ] `variant` + `inset` 同时传时 variant 优先
- [ ] 覆盖 `--h-cell-group-margin-x` 生效
- [ ] 标题在卡片外、不裁切

## 风险文件 / 回滚点

- `src/components/HCellGroup.vue`（API 改动唯一组件）
- 回滚：移除 variant/resolvedVariant + `--card` 规则 + token + 文档即可，inset/flat 不受影响

## 收尾

- [ ] 全量验收（上面清单全绿）
- [ ] spec 同步确认
- [ ] 提交（feat(cell): HCellGroup 支持卡片形态 variant="card"）
- [ ] 归档任务 + 记录 journal
