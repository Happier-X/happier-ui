# 执行计划：npm 发布 happier-ui

1. 安装并锁定 `vite-plugin-dts`（必要时补 library build 依赖）。
2. 新增根 `vite.config.ts` library 配置，构建 ESM、style.css、types，并复制 tokens.css。
3. 更新 `package.json`：版本 0.0.1、移除 private、exports/files/scripts/metadata/license。
4. 新增 MIT `LICENSE`（Copyright (c) 2026 Happier）。
5. 更新 README：npm 安装、CSS 导入、peer 依赖和本地开发说明。
6. 执行 `npm run build:lib`、`npm pack --dry-run`，检查包内容和产物入口。
7. 临时目录安装 tarball，验证 import 与 CSS 子路径；再次运行 playground build。
8. 通过后请求用户确认，再执行 `npm publish --access public`；发布后验证 npm registry。

## 验证命令

```bash
npm run build:lib
npm pack --dry-run
npm run build:playground
```

## Review gates

- 不发布 `.trellis`、playground、源码、npm token。
- peer 依赖 external 且 package metadata 正确。
- `exports` 的 types/import/CSS 子路径均可解析。
- 公开 publish 前必须有用户二次确认。
