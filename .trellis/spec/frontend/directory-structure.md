# Directory Structure（happier-ui）

## 仓库布局

```text
happier-ui/
  src/
    index.ts                 # 公共导出源（H*）
    tokens.css               # --h-* 权威 token；--muses-* 别名
    components/H*.vue        # 语义 UI 组件（唯一组件目录）
  dist/                      # npm 发布产物（gitignore；build:lib 生成）
  playground/                # Vite 冒烟宿主（workspace 包）
    src/App.vue              # 组件演示
    src/main.ts
  vite.config.ts             # library mode（ESM + style.css + dts + copy tokens）
  tsconfig.lib.json          # vite-plugin-dts / 声明生成
  package.json               # 公共包 metadata；exports 指向 dist
  LICENSE                    # MIT © Happier
  .trellis/                  # 任务 / spec / workflow
  AGENTS.md
  README.md
```

## 放哪里

| 类型 | 路径 | 说明 |
|------|------|------|
| 新组件 | `src/components/HXxx.vue` | 文件名与导出名一致，`H` 前缀 |
| 公共导出 | `src/index.ts` | 先 `H*`；npm 消费走 `dist` |
| 设计 token | `src/tokens.css` | 只改这里的视觉数值；构建复制到 `dist/tokens.css` |
| 库构建配置 | `vite.config.ts` / `tsconfig.lib.json` | 不把 playground 配置当库配置 |
| 演示 / 冒烟 | `playground/src/App.vue` | 新组件必须先能在此看见 |
| 任务与规范 | `.trellis/` | 不放业务代码；**不进** npm tarball |

## npm 包边界

- **包名**：`happier-ui`（unscoped）；`publishConfig.access: public`。
- **发布内容**（`files`）：仅 `dist/`、`LICENSE`、`README.md`（外加根 `package.json`）。
- **不发布**：`src/`、`playground/`、`.trellis/`、token/secret、本地 `*.tgz`。
- **exports**：
  - `.` → `dist/index.js` + `dist/index.d.ts`
  - `./style.css` → `dist/style.css`（组件样式，不自动注入）
  - `./tokens.css` → `dist/tokens.css`
- **构建**：`npm run build:lib`（Vite lib + `vite-plugin-dts`）；`vue` 与 `@lucide/vue` external。
- **宿主安装**：`npm install happier-ui vue @lucide/vue`，并显式 `import 'happier-ui/style.css'` 与 `import 'happier-ui/tokens.css'`。
- **本地联调**：仍可用 `file:../happier-ui`；改组件后刷新 playground/宿主。
- **发布路径**：
  - 本地首次/紧急：`npm run build:lib` 后 `npm publish --access public`（需登录账号确认）。
  - 常规：推送 **`v*` tag** → `.github/workflows/release.yml` 自动 `build:lib` + `npm publish`（需 Secret **`NPM_TOKEN`**）；tag 去掉 `v` 后须与 `package.json` version 一致。
  - `npm pack` 不等于授权发布。

## 不做的目录

- 无 `pages/`、`router/`、`stores/`：本库不是应用壳。
- 无 `services/`、`api/`：无网络与业务层。
- 无 `composables/`（当前）：尚无共享 hook；出现 ≥2 处复用再抽 `src/composables/`。

## 依赖边界

- **peer**：`vue` ^3.5、`@lucide/vue` ^1.25（见根 `package.json`）；不打进 dist。
- **不 peer** `@ionic/vue`：组件用原生 `<button>` / 布局 div。
- **playground**：workspace 包，独立 Vite；开发期可 alias 到 `src`，发布验证以 dist/tarball 为准。

## 参考

- `src/index.ts`
- `vite.config.ts` / `tsconfig.lib.json`
- `playground/src/main.ts`（`import 'happier-ui/tokens.css'`）
- `README.md`
