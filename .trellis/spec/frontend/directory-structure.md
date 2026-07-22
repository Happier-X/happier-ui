# Directory Structure

```text
happier-ui/
  src/
    index.ts              # 公共导出
    tokens.css            # --h-* 权威 token
    components/H*.vue
  playground/             # Vite 冒烟与组件演示
  .trellis/               # 任务 / spec / workflow
  package.json
  README.md
```

## 依赖

- peer：`vue` ^3.5
- playground：独立 workspace 包，本地 `file:..` 引用库
