# 技术设计：npm 发布 happier-ui

## 包结构

- 根包 `happier-ui`，版本 `0.0.1`，移除 `private`。
- 仅发布 `dist/`、`README.md`、`LICENSE` 与必要 package metadata；不发布 playground、`.trellis`、源码。
- `peerDependencies` 保留 `vue` 与 `@lucide/vue`，避免重复打包运行时。

## 构建

使用根目录 Vite Library Mode：

- entry：`src/index.ts`
- format：ESM，输出 `dist/index.js`
- CSS：由 Vue SFC 样式提取为 `dist/style.css`
- `src/tokens.css` 作为静态资源复制为 `dist/tokens.css`
- `vite-plugin-dts` 生成 `dist/index.d.ts`；Vue 组件类型随公共入口声明生成
- external：`vue`、`@lucide/vue`
- build 前清空 dist，避免旧文件进入 tarball

## exports

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js"
  },
  "./style.css": "./dist/style.css",
  "./tokens.css": "./dist/tokens.css",
  "./package.json": "./package.json"
}
```

## 许可证与元数据

- `license: MIT`
- 根 `LICENSE`：`Copyright (c) 2026 Happier`
- 补充 `repository`、`homepage`、`bugs`、`keywords`、`engines`（Vue 3）和 `publishConfig.access: public`（非 scoped 包仍明确声明）。

## 验证与发布边界

1. `npm run build:lib`。
2. 检查 `dist` 内容和 `npm pack --dry-run`，确认无 token/私有文件。
3. 使用临时目录安装 tarball，验证 JS 入口、CSS 子路径和 peer metadata。
4. `npm publish --access public` 是不可逆外部动作，只有用户明确确认后执行。
5. 发布后用 `npm view happier-ui version` 与干净临时项目安装验证。
