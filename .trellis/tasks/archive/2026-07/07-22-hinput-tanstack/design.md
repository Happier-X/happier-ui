# 技术设计：HInput + TanStack Form

## API

```ts
modelValue?: string | number
type?: string // default 'text'
name?: string
id?: string
label?: string
description?: string
error?: string
placeholder?: string
disabled?: boolean
readonly?: boolean
autocomplete?: string
inputmode?: string
invalid?: boolean // 默认：Boolean(error)
size?: 'sm' | 'md' | 'lg' // 可选，md 默认

// emits
'update:modelValue': [value: string]
'blur': [event: FocusEvent]
// 可选透传 focus 不强制
```

内部结构：

```html
<div class="h-input" :class="size/invalid/disabled">
  <label v-if="label" :for="inputId">...</label>
  <input
    :id="inputId"
    :name="name"
    :type="type"
    :value="modelValue"
    :disabled="disabled"
    :readonly="readonly"
    :placeholder="placeholder"
    :aria-invalid="isInvalid"
    :aria-describedby="describedBy"
    @input="onInput"
    @blur="onBlur"
  />
  <p v-if="description" :id="descId">...</p>
  <p v-if="error" :id="errId" role="alert">...</p>
</div>
```

`onInput`: `emit('update:modelValue', (e.target as HTMLInputElement).value)`  
`onBlur`: `emit('blur', e)` — TanStack 的 `handleBlur` 可直接挂到 `@blur`。

## TanStack 对接（宿主）

```vue
<form.Field name="email">
  <template v-slot="{ field }">
    <h-input
      :name="field.name"
      :model-value="String(field.state.value ?? '')"
      :error="field.state.meta.errors[0]?.toString?.() ?? field.state.meta.errors[0]"
      @update:model-value="field.handleChange"
      @blur="field.handleBlur"
      label="Email"
    />
  </template>
</form.Field>
```

库内不 import tanstack。

## Token

```css
--h-input-height-sm/md/lg
--h-input-pad-x
--h-input-radius (可用 --h-radius-control)
--h-input-border
--h-input-border-invalid
--h-input-bg
```

## Playground

1. 简单 v-model 计数/回显  
2. 安装 `@tanstack/vue-form` 到 **playground only**，做一个最小 form 提交 console/log  
   - 若 workspace 安装失败，降级为 mock `{ name, state, handleChange, handleBlur }` 演示同等绑定  

## 文件

`HInput.vue`、index、tokens、playground、README、specs。
