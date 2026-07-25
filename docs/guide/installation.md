# 安装与 Tailwind v4

## 依赖

```bash
npm install happier-ui vue @lucide/vue tailwindcss@^4
```

| 包 | 版本 | 说明 |
|----|------|------|
| `happier-ui` | `0.0.2+` | 组件与 styles |
| `vue` | `^3.5` | peer |
| `@lucide/vue` | `^1.25` | peer；`HIcon` / `HTabBar` / `HNavBar` 图标 |
| `tailwindcss` | `^4` | peer；宿主构建管道必须处理 styles |

开发构建工具推荐：

```bash
npm install -D @tailwindcss/vite vite @vitejs/plugin-vue
```

## 样式入口（必需）

**主推**在应用全局 CSS 中：

```css
@import "tailwindcss";
@import "happier-ui/styles";
```

`happier-ui/styles` 包含：

1. `--h-*` token（`tokens.css`）
2. `@theme` → `h-` utility（`theme.css`）
3. 组件 BEM（`@layer components`）

仅需变量、自行映射时：

```css
@import "happier-ui/tokens.css";
```

### 包 exports（0.0.2+）

| 路径 | 内容 |
|------|------|
| `happier-ui` | 组件 ESM + 类型 |
| `happier-ui/styles` / `happier-ui/styles.css` | 完整样式（主推） |
| `happier-ui/tokens.css` | 仅 token |
| ~~`happier-ui/style.css`~~ | **已移除**（0.0.1） |

## Vite 配置

```ts
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

组件样式依赖宿主 **Tailwind v4 管道** 解析 `@import "happier-ui/styles"`；不要再使用 0.0.1 的「只引预编译 style.css、无 Tailwind」路径。

## 不进 npm 包的内容

发布 tarball **仅**含 `dist/`、`LICENSE`、`README.md`。不含 `docs/`、`src/`、`playground/`、`.trellis/`。
