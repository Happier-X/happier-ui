# 技术设计：HCheckbox

## API

```ts
modelValue?: boolean // default false
indeterminate?: boolean // default false；不进 v-model
label?: string
disabled?: boolean
size?: 'sm' | 'md' | 'lg' // default md
ariaLabel?: string // 无 label 时建议提供
name?: string // 可选，原生表单

// emits
'update:modelValue': [value: boolean]
```

## 结构

原生 `input[type=checkbox]`（视觉可隐藏）+ 自定义 box 指示 + 可选 label 文案。  
用 `label` 包裹整行，点击文案即可切换。

```html
<label class="h-checkbox" :class="size / checked / indeterminate / disabled">
  <input
    ref="inputEl"
    type="checkbox"
    class="h-checkbox__input"
    :checked="modelValue"
    :disabled="disabled"
    :name="name"
    :aria-label="ariaLabel"
    @change="onChange"
  />
  <span class="h-checkbox__box" aria-hidden="true">…check / dash…</span>
  <span v-if="label" class="h-checkbox__label">{{ label }}</span>
</label>
```

## indeterminate 同步

- `watch([indeterminate, modelValue], …)` 设置 `inputEl.indeterminate = indeterminate && !modelValue`（或始终 `= indeterminate`，宿主约定半选时 model 通常 false）。
- PRD：半选时点击 → `update:modelValue(true)`。原生 change 在 indeterminate 点选后通常会变成 checked=true；以 `emit(true)` 对齐。
- 若非半选：`emit(event.target.checked)`。
- **不** emit `update:indeterminate`；宿主在监听 v-model 后自行 `indeterminate = false`。

## a11y

- 有 `label` 文本：关联可见文案即可。
- 无 `label`：依赖 `ariaLabel`。
- 半选：DOM `indeterminate` 使读屏读 mixed；可选同步 `aria-checked` 若用 role 方案。本设计走原生 checkbox，优先原生语义。

## Token

```css
--h-checkbox-size-sm/md/lg
--h-checkbox-radius
--h-checkbox-border
--h-checkbox-bg-checked (primary)
--h-checkbox-mark (contrast)
--h-checkbox-duration
```

## 文件

`HCheckbox.vue`、tokens、index、playground、README、specs。
