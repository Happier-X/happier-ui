# Directory Structure（happier-ui）

## 仓库布局

```text
happier-ui/
  src/
    index.ts                 # 公共导出（H* + 兼容 M*）
    tokens.css               # --h-* 权威 token；--muses-* 别名
    components/H*.vue        # 语义 UI 组件（唯一组件目录）
  playground/                # Vite 冒烟宿主（workspace 包）
    src/App.vue              # 组件演示
    src/main.ts
  package.json               # exports: "." → src/index.ts, "./tokens.css"
  .trellis/                  # 任务 / spec / workflow
  AGENTS.md
  README.md
```

## 放哪里

| 类型 | 路径 | 说明 |
|------|------|------|
| 新组件 | `src/components/HXxx.vue` | 文件名与导出名一致，`H` 前缀 |
| 公共导出 | `src/index.ts` | 先 `H*`，可选再导出兼容 `M*` |
| 设计 token | `src/tokens.css` | 只改这里的视觉数值 |
| 演示 / 冒烟 | `playground/src/App.vue` | 新组件必须先能在此看见 |
| 任务与规范 | `.trellis/` | 不放业务代码 |

## 不做的目录

- 无 `pages/`、`router/`、`stores/`：本库不是应用壳。
- 无 `services/`、`api/`：无网络与业务层。
- 无 `composables/`（当前）：尚无共享 hook；出现 ≥2 处复用再抽 `src/composables/`。

## 依赖边界

- **peer**：`vue` ^3.5（见根 `package.json`）。
- **不 peer** `@ionic/vue`：组件用原生 `<button>` / 布局 div；`ion-icon` 仅作可选 Web Component（宿主加载）。
- **playground**：`file:..` 引用本库，独立 Vite 配置。

## 参考

- `src/index.ts`
- `playground/src/main.ts`（`import 'happier-ui/tokens.css'`）
- `README.md`
