# Directory Structure（happier-ui）

## 仓库布局

```text
happier-ui/
  src/
    index.ts                 # 公共导出源（H*）
    tokens.css               # re-export → styles/tokens.css（避免旧路径双源）
    styles/
      index.css              # 公共 styles 入口（tokens + theme + components）
      tokens.css             # --h-* 权威 token；--muses-* 别名
      theme.css              # Tailwind v4 @theme → h- utility
      components.css         # 汇总 @import 各组件层
      components/*.css       # @layer components 内 h-* BEM
    components/H*.vue        # 语义 UI（逻辑 + BEM 类名；无大块 scoped 视觉）
  dist/                      # npm 发布产物（gitignore；build:lib 生成）
  docs/                      # VitePress 文档站（不进 npm tarball）
    .vitepress/              # config + theme（TW4 + happier-ui/styles alias）
    guide/                   # 快速开始 / 安装 / token / 主题 / migration
    components/              # 11 个 H* 文档页（示例 + API）
    index.md
  playground/                # Vite 冒烟宿主（workspace 包；@tailwindcss/vite）
    src/App.vue
    src/main.ts
    src/style.css            # @import tailwindcss + happier-ui/styles
  vite.config.ts             # library mode（ESM + dts + emit styles/tokens）
  tsconfig.lib.json
  package.json               # exports 指向 dist；peer 含 tailwindcss ^4
  LICENSE
  .trellis/
  AGENTS.md
  README.md
```

## 放哪里

| 类型 | 路径 | 说明 |
|------|------|------|
| 新组件 | `src/components/HXxx.vue` | 文件名与导出名一致，`H` 前缀 |
| 组件视觉 | `src/styles/components/*.css` | BEM + `@layer components` |
| 公共导出 | `src/index.ts` | 先 `H*`；npm 消费走 `dist` |
| 设计 token | `src/styles/tokens.css` | 只改这里的视觉数值 |
| `@theme` 映射 | `src/styles/theme.css` | h- utility 桥接 |
| 库构建配置 | `vite.config.ts` / `tsconfig.lib.json` | 不把 playground 配置当库配置 |
| 演示 / 冒烟 | `playground/` | 新组件必须先能在此看见 |
| 组件库文档 | `docs/` | VitePress；`docs:dev` / `docs:build`；GitHub Pages |
| 任务与规范 | `.trellis/` | 不放业务代码；**不进** npm tarball |

## npm 包边界

- **包名**：`happier-ui`（unscoped）；`publishConfig.access: public`。
- **发布内容**（`files`）：仅 `dist/`、`LICENSE`、`README.md`（外加根 `package.json`）。
- **不发布**：`src/`、`playground/`、`docs/`、`.trellis/`、token/secret、本地 `*.tgz`。
- **exports**（0.0.2+）：
  - `.` → `dist/index.js` + `dist/index.d.ts`
  - `./styles` / `./styles.css` → `dist/styles.css`（主推）
  - `./tokens.css` → `dist/tokens.css`（可选）
  - **无** `./style.css`（0.0.1 路径已移除）
- **构建**：`npm run build:lib` 合并 `src/styles` → `dist/styles.css` + copy tokens；`vue` / `@lucide/vue` external。
- **宿主安装**：`npm install happier-ui vue @lucide/vue tailwindcss@^4`，全局 CSS：
  - `@import "tailwindcss";`
  - `@import "happier-ui/styles";`
- **本地联调**：playground alias 到 `src/styles/index.css`；发布验证以 dist/tarball 为准。
- **发布路径**：
  - 本地：`npm run build:lib` 后 `npm publish --access public`（需用户确认）。
  - 常规：推送 **`v*` tag** → release workflow（Secret **`NPM_TOKEN`**）；tag 去掉 `v` 后须与 version 一致。
  - `npm pack` 不等于授权发布。

## 不做的目录

- 无 `pages/`、`router/`、`stores/`：本库不是应用壳。
- 无 `services/`、`api/`：无网络与业务层。
- 无 `composables/`（当前）：尚无共享 hook；出现 ≥2 处复用再抽 `src/composables/`。

## 依赖边界

- **peer**：`vue` ^3.5、`@lucide/vue` ^1.25、`tailwindcss` ^4；不打进 dist。
- **runtime `dependencies`**：`dayjs`（首个 runtime 依赖，随包安装，宿主无需额外装）。日期相关组件（如 HHeatmap）可用 dayjs 做解析/加减/格式化；`vite.config` `rollupOptions.external` 须含 `'dayjs'`，保证不被打进库 bundle、由宿主 node_modules 解析。新增 runtime 依赖属破坏「零运行时依赖」惯例的决策，需经任务评审并记 spec。
- **不 peer** `@ionic/vue`；不依赖 `@heroui/*`。
- **playground**：workspace 包 + `@tailwindcss/vite`；开发期 alias 库 styles。
- **docs**：根 devDependency `vitepress`；Vite alias 同 playground（`happier-ui` → `src`）；theme 内 `@import tailwindcss` + `happier-ui/styles`；**不**进 npm 包。

## 参考

- `src/index.ts` / `src/styles/index.css`
- `vite.config.ts` / `tsconfig.lib.json`
- `playground/src/style.css`
- `README.md`
