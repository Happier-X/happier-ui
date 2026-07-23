# 发布 happier-ui 到 npm

## Goal

将 **happier-ui** 配置为可被公众安装的 npm 包，完成首次公开发布，使任意 Vue 项目可通过 `npm install happier-ui` 使用组件与 tokens。

## 背景（已确认）

- 当前 `package.json`：`name: happier-ui`、`version: 0.1.0`、**`private: true`**。
- `exports` 直接指向源码：`./src/index.ts`、`./src/tokens.css`；`files: ["src"]`。
- 仅有 playground 构建脚本，**无**库本体 build（无 dist、无 d.ts、无 vite-lib 配置）。
- peer：`vue ^3.5`、`@lucide/vue >=0.400`。
- `npm whoami`：**未登录**（ENEEDAUTH）。
- `npm view happier-ui`：404，提示该名曾在 **2021-08-13** 被 unpublish（名称是否可立即占用需验证）。
- README 仍写「本地 `file:` 依赖接入」。
- 仓库无 LICENSE 字段/文件（待确认）。

## 已确认决策

- 包名：**`happier-ui`**（非 scoped）；若 publish 因名称策略失败再改 scoped
- 分发形态：**构建 dist**（ESM + CSS）+ **TypeScript 类型声明**；不直接以源码 `.vue` 作为唯一公共入口
- 首次公开版本：**`0.0.1`**（从当前内部 `0.1.0` 调整为更早期版本）
- 许可证：**MIT**；版权名称使用 **`Happier`**（`Copyright (c) 2026 Happier`）
- npm 登录账号：**`happierx`**（已登录 registry.npmjs.org）
- CSS 发布：**组件样式与 tokens 分开**；分别提供 `happier-ui/style.css` 与 `happier-ui/tokens.css`

## 已确认决策（构建）

- 使用 **Vite Library Mode + `vite-plugin-dts`**
- `vue` 与 `@lucide/vue` external，不打包进库
- 分发 `dist/index.js`、`dist/style.css`、`dist/tokens.css`、`dist/index.d.ts`

## 开放决策

## MVP 需求（草案）

| 能力 | 约定（草案） |
|------|----------------|
| 可安装 | 去掉 `private`；配置 `files` / `exports` / 入口 |
| 产物 | 构建 dist：ESM JS + 组件 `style.css` + `tokens.css` + `.d.ts`；`exports` 指向 dist |
| 文档 | README 安装与用法改为 npm 安装 |
| 发布 | `npm publish` 成功；registry 上可 `npm view` / 安装 |
| 安全 | 发布前 `npm pack` 检视产物；不泄露 token / 私有配置 |

## 明确不做（草案）

- 不自动发布到 GitHub Packages（除非另选）
- 不做 monorepo 拆分 / 多包
- 不改组件 API
- 不强制 CI 自动发布（可作为后续）

## Acceptance Criteria

- [ ] 包可从 npm 公开安装（非 private）
- [ ] `npm view happier-ui version` 返回 `0.0.1`
- [ ] 安装后可 import 组件与 `happier-ui/tokens.css`
- [ ] README 含公开安装说明
- [ ] `npm pack` / publish 前检查通过；真正 publish 经用户确认
- [ ] 记录发布版本与 registry 结果

## Notes

- 复杂任务：已补 `design.md`、`implement.md`、`implement.jsonl`、`check.jsonl`。
- **真正 `npm publish` 必须用户二次确认**，构建和 tarball 检查不等于发布授权。
- 对外定位订正：库适用于 **Web 端与移动端**；不强调 Capacitor；HeroUI Native 仅作视觉参考。
