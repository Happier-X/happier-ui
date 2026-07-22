# 技术设计：HSwitch

## 契约

```ts
modelValue?: boolean          // default false
disabled?: boolean            // default false
size?: 'sm' | 'md' | 'lg'     // default 'md'
ariaLabel?: string            // 无外部 label 时建议传

// emit
'update:modelValue': [value: boolean]
```

根节点：`<button type="button" role="switch" :aria-checked="modelValue" :aria-label="ariaLabel" :disabled="disabled">`  
内部：`.h-switch__track` + `.h-switch__thumb`（纯 CSS，不用 checkbox 隐藏技巧亦可；button 更易键盘）。

切换：

```ts
const toggle = () => {
  if (disabled) return
  emit('update:modelValue', !modelValue)
}
```

## 视觉（HeroUI Native 简化）

| 态 | 表现 |
|----|------|
| off | track：`--h-color-surface-secondary` 或 ink-muted 浅底；thumb 白/ surface |
| on | track：`--h-color-primary`；thumb contrast |
| disabled | opacity ~0.45；cursor not-allowed |
| focus-visible | outline focus-ring |
| size | track 宽高 + thumb 直径用 token：`--h-switch-track-*-w/h`、`--h-switch-thumb-*` |

过渡：`transform` / `background-color` 用 `--h-duration-press` 或略长 180ms。

## Token（建议新增）

```css
--h-switch-track-sm-w / h
--h-switch-track-md-w / h
--h-switch-track-lg-w / h
--h-switch-thumb-sm / md / lg
--h-switch-pad: 2px; /* thumb 边距 */
```

数值贴近移动端约 40–52px 宽 track（md），触控可外包 min 高度但控件本体可小于 48px（常见开关尺寸）；若需加大热区可用 padding 扩大 button 可点区域。

## 文件

- `src/components/HSwitch.vue`（新）
- `src/index.ts` 增加导出
- `src/tokens.css` 补 switch token
- `playground/src/App.vue` 增加演示段
- `component-guidelines.md` 更新导出表

## 风险

- 无障碍：仅 `aria-checked` 不够时补 `ariaLabel`
- 与原生 checkbox 对比：本任务用 switch 语义，非 checkbox
