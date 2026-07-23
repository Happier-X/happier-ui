# Design Tokens（happier-ui）

## 权威

- 文件：`src/tokens.css`
- 前缀：`--h-*`
- 包导出：`happier-ui/tokens.css`（见根 `package.json` `exports`）

宿主入口必须导入一次，例如 playground：

```ts
// playground/src/main.ts
import 'happier-ui/tokens.css'
```

## 兼容别名

同文件内 `--muses-* → var(--h-*)`，供 Muses 存量样式字符串过渡。  
**新组件与新 CSS 只写 `--h-*`。**

## 视觉源

- 直接对齐 **HeroUI Native** 移动端角色（surface / accent / muted / separator、soft radius、状态观感）。
- Primary 色阶对齐 HeroUI common.blue（`--h-primary-50` … `--h-primary-900`，主色 `--h-color-primary`）。
- **禁止** Material elevation / 重阴影。

## 使用方式

```css
/* 组件 scoped 样式 */
.color {
  color: var(--h-color-ink-muted, #92949c);
  border-radius: var(--h-radius-control, 12px);
  min-height: var(--h-touch-target, 48px);
}
```

- 必须带合理 **fallback**（宿主未加载 tokens 时不至于完全崩）。
- 禁止在组件里重新定义一套全局 `:root` 色板。

## 分组（文件内）

| 组 | 示例 |
|----|------|
| 主色阶 | `--h-primary-500` |
| 语义色 | `--h-color-primary`、`--h-color-surface`、`--h-color-danger`、`--h-color-success` / `warning`、`--h-color-focus-ring` |
| 沉浸播放 | `--h-immersive-*`（播放器宿主可用，库组件按需） |
| 间距 / 圆角 / 字号 | `--h-space-*`、`--h-radius-*`、`--h-font-*` |
| 按钮 | `--h-button-height-*`、`--h-button-pad-x-*`、`--h-button-font-*` |
| 开关 | `--h-switch-track-*-w/h`、`--h-switch-thumb-*`、`--h-switch-pad` |
| 底部面板 | `--h-bottom-sheet-z`、`--h-bottom-sheet-overlay-bg`、`--h-bottom-sheet-radius`、`--h-bottom-sheet-duration` |
| 对话框 | `--h-dialog-z`、`--h-dialog-overlay-bg`、`--h-dialog-radius`、`--h-dialog-max-width`、`--h-dialog-duration` |
| 输入框 | `--h-input-height-*`、`--h-input-pad-x-*`、`--h-input-border`、`--h-input-border-invalid` |
| 复选框 | `--h-checkbox-size-*`、`--h-checkbox-radius`、`--h-checkbox-border`、`--h-checkbox-bg-checked` |
| 空状态 | `--h-empty-min-height`、`--h-empty-max-width`、`--h-empty-pad` |
| 图片 | `--h-image-bg`、`--h-image-fallback-ink`、`--h-image-radius-*` |
| 图标 | `--h-icon-size-sm/md/lg` |
| 触控 / 列表 | `--h-touch-target`、`--h-song-row-height`、`--h-list-row-height-compact`、`--h-cover-size-sm` |
| 动效 | `--h-duration-press`、`--h-ease-standard` |
| 层级 | `--h-z-tab`、`--h-z-mini-player`、`--h-z-player` |

## 已知债

- 部分 token 仍 fallback 到 `--ion-*`（历史宿主耦合）；长期应收敛为纯 `--h-*` 默认值。
- `--muses-*` 别名仍保留供 Muses 存量字符串过渡；新代码只写 `--h-*`。

## 反模式

- 在 Muses 与本库各维护一份分叉色板且不别名。
- 组件内写死 `#006fee` 而不走 `--h-color-primary`。
- 新增 elevation shadow token「看起来更立体」。
