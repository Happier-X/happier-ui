# 执行计划：Tailwind v4 迁移 → 0.0.2

## 总原则

1. 先脚手架，再按批次迁组件；**全部完成后再**改 version / 请求 publish。
2. 每批结束后：`playground` 可演示该批组件；不引入 `0.0.1` 兼容 shim。
3. 真正 `npm publish` 必须用户二次确认。

## 检查点

### CP0 — 脚手架

1. 安装 `tailwindcss@^4`、`@tailwindcss/vite`（及 playground 所需）。
2. 新增 `src/styles/`：`tokens.css`（迁自现 `src/tokens.css`）、`theme.css`（`@theme`）、`components.css`、`index.css`。
3. playground：`@import "tailwindcss"` + 库 styles；配置 Vite TW 插件。
4. 调整根 / playground 构建与路径别名。
5. 更新 `package.json` exports 草案与 peer（`tailwindcss` ^4）；**version 可暂留，发版前再改 0.0.2**。
6. 验证：业务侧 class `bg-h-primary` 等生效；旧组件暂可仍带 scoped（尽快进入 CP1）。

**验证**

```bash
npm run dev:playground
# 目视：token utility 示例块有颜色
```

### CP1 — HButton / HIcon / HEmpty / HImage

1. 将各组件视觉迁入 `src/styles/components/*.css`（BEM + layer）。
2. 去掉 SFC 内大块 scoped 视觉样式。
3. playground 对应区块对照。

### CP2 — HInput / HCheckbox / HSwitch

同 CP1 模式。

### CP3 — HNavBar / HTabBar

注意 safe-area、z-index token。

### CP4 — HDialog / HBottomSheet

注意 overlay、motion、focus；保持 a11y 属性不变。

### CP5 — 收尾与发版准备

1. 删除无用 `src/tokens.css` 旧路径或改为 re-export（避免双源）。
2. 清理 lib vite 中「仅 copy tokens + cssFileName style」的 `0.0.1` 假设；对齐 design exports。
3. README：TW4 接入、utility 示例、breaking vs `0.0.1`。
4. 更新 `.trellis/spec/frontend/tokens.md`、`component-guidelines.md`、`index.md` 相关条目。
5. `package.json` **version `0.0.2`**。
6. 验证命令全绿后，**请求用户确认**再 `npm publish --access public`。

**验证命令**

```bash
npm run build:lib
npm run build:playground
npm pack --dry-run
```

发布后（仅确认后）：

```bash
npm view happier-ui version
# 期望 0.0.2
```

## Review gates

- [ ] 无 `@heroui/*`、无 Ionic
- [ ] 无 `0.0.1` 双轨接入文档
- [ ] peer 含 `tailwindcss` ^4
- [ ] 公共 JS API 未改
- [ ] tarball 无 `.trellis` / playground / secrets
- [ ] publish 已经用户确认

## 回滚

- 发版前：git 回滚即可。
- 发版后：不可覆盖 `0.0.2`；修缺陷发 `0.0.3+`。
