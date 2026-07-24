# 技术设计：VitePress 文档站 + GitHub Pages

## 目标

```text
docs:dev  → 本地浏览指南 + 11 组件页（含 Vue 演示）
docs:build → 静态站点
push master → Actions → GitHub Pages
```

## 目录结构（拟定）

```text
docs/                          # VitePress 源（仓库根）
  .vitepress/
    config.ts                  # title、nav、sidebar、base、themeConfig
    theme/
      index.ts                 # 扩展默认主题
      custom.css               # @import tailwindcss + happier-ui/styles + 文档微调
  index.md                     # 首页
  guide/
    getting-started.md
    installation.md            # TW4 + peers
    tokens.md
    theming.md                 # CSS 变量覆盖 / BEM layer 覆盖
    migration-0.0.2.md         # vs 0.0.1 breaking
  components/
    button.md
    switch.md
    …
    nav-bar.md
  public/                      # 可选 favicon 等
```

- **不**把 docs 打进 npm 包（`files` 仍仅 dist/LICENSE/README）。
- playground 不动职责；文档示例可参考其交互，代码宜精简可复制。

## 依赖与脚本

根 `package.json`（或 docs workspace，优先 **根 devDependency** 简单）：

- `vitepress`（与当前 Vite 8 兼容的版本）
- 文档构建复用已有 `tailwindcss` / `@tailwindcss/vite`、`vue`、`@lucide/vue`

脚本：

```json
{
  "docs:dev": "vitepress dev docs",
  "docs:build": "vitepress build docs",
  "docs:preview": "vitepress preview docs"
}
```

## VitePress + 库组件

1. **alias**：`happier-ui` → `src/index.ts`；`happier-ui/styles` → `src/styles/index.css`（与 playground 一致）。
2. **CSS**：theme `custom.css`：
   ```css
   @import "tailwindcss";
   @import "happier-ui/styles";
   ```
3. **Vue 演示**：在 `.md` 中写 Vue SFC 块或抽 `docs/.vitepress/components/Demo*.vue` 再注册；优先 **页面内 script setup + 组件**，保持可读。
4. **@lucide/vue**：文档演示 `HIcon` / TabBar 时从 peer 导入图标组件。
5. **注意**：Tailwind v4 扫描 content 需包含 `docs/**/*.{md,vue}`；若 utility 在 MD 中使用，确保 TW 插件配置扫描 docs（VitePress Vite config 扩展）。

## base 与 Pages

- 仓库：`Happier-X/happier-ui` → Pages 默认  
  `https://happier-x.github.io/happier-ui/`
- VitePress `base: '/happier-ui/'`（生产）；本地 dev 可用 `/` 或同样 base（VitePress 支持 env 区分）。

```ts
// 示意
const isProd = process.env.NODE_ENV === 'production'
export default defineConfig({
  base: isProd ? '/happier-ui/' : '/',
  // …
})
```

## 导航信息架构

| 分区 | 页面 |
|------|------|
| 指南 | 快速开始、安装、Token、主题与覆盖、从 0.0.1 升级 |
| 组件 | Button、Icon、Empty、Image、Input、Checkbox、Switch、NavBar、TabBar、Dialog、BottomSheet |

组件页模板：

1. 简介（一句话 + 使用场景）
2. 基础示例（可交互）
3. 变体/尺寸（若有）
4. API 表：props / emits / slots
5. 无障碍要点（摘自 quality-guidelines）

API 表以 **源码 `defineProps` / `defineEmits` / slots** 为准，不臆造。

## GitHub Actions

新文件 `.github/workflows/docs.yml`：

- **trigger**：`push` to `master`（路径过滤 `docs/**`、`src/**`、workflow 自身可选）+ `workflow_dispatch`
- **steps**：checkout → setup Node 22 → `npm ci` → `npm run docs:build` → `actions/upload-pages-artifact` → `actions/deploy-pages`
- **permissions**：`pages: write`、`id-token: write`、`contents: read`
- **concurrency**：取消进行中的 docs 部署

不与 npm `release.yml` 耦合。

## README / package.json

- README 顶部或「文档」节：本地 `npm run docs:dev` + 线上 Pages 链接。
- 可选更新 `homepage` 为 Pages URL（推荐，便于 npm 页跳转）。

## Spec 更新

- `directory-structure.md`：增加 `docs/` 布局
- `frontend/index.md` 或 quality：新组件需同步文档页（完成定义可选一条）
- 不把 `.trellis` 写进站点

## 风险

| 风险 | 缓解 |
|------|------|
| TW4 不扫 docs → utility 丢失 | Vite 配置 source/content 包含 docs |
| base 路径错导致资源 404 | 生产 base `/happier-ui/`；预览用 `docs:preview` |
| 文档与 API 漂移 | API 表从源码抄；实现后 check 对照 |
| Pages 未开 Actions 源 | README 注明仓库 Settings 一步 |
| 体积/依赖 | docs 依赖为 dev；不进 npm tarball |
