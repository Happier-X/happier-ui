# happier-ui

跨 Capacitor + Vue 的语义 UI 与设计 token（`--h-*`）。  
**独立仓库**，与 `muses` 同级开发；消费方用本地 `file:` 依赖接入。

## 布局

```text
happier-ui/
  src/                 # 库源码（tokens + H* 组件）
  playground/          # 纯 Vue 冒烟 / 开发预览
  package.json
```

## 开发（本仓库）

```bash
cd C:\code\happier-ui
npm install
npm run dev:playground   # http://localhost:5174
npm run build:playground
```

## 被 Muses 引用

Muses 根 `package.json`：

```json
"happier-ui": "file:../happier-ui"
```

```bash
cd C:\code\muses
npm install
npm run dev
```

在 `happier-ui` 改组件后，Muses 一般需刷新 dev server；依赖元数据变更时再 `npm install`。

### 逐个替换建议

1. 库内改 `H*` / tokens，playground 目视  
2. Muses 经 `@/components/ui` re-export 已吃到新包  
3. 有把握后，单页改为 `import { HIconButton } from 'happier-ui'`  
4. 领域组件（封面、播放器、`MPage`）永远留 Muses  

## Peer

- **必选**：`vue` ^3.5  
- **图标**：优先 `HIconButton` 的 **slot**；`icon` path 使用 Web Component `ion-icon` 时由宿主加载 Ionic  

## 不做

- 本仓库不塞 Muses 业务  
- 默认不 npm 公网发布（`private: true`）  
