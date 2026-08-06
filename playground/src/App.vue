<template>
  <h-nav-bar
    title="happier-ui Playground"
    show-back
    @handle-left-click="onNavLeftClick"
    @handle-right-click="onNavRightClick"
  >
    <template #right>
      <button type="button" class="smoke__nav-action">完成</button>
    </template>
  </h-nav-bar>

  <main class="smoke">
    <header class="smoke__header">
      <h1 class="smoke__title">happier-ui 冒烟</h1>
      <p class="smoke__lead">
        导出 <code>H*</code> 组件与 <code>happier-ui/styles</code>（Tailwind v4 + <code>--h-*</code> / <code>h-</code> utility；纯 Vue，无 Ionic）。
      </p>
      <div class="smoke__swatch" aria-hidden="true" />
      <div class="mt-h-md flex flex-wrap gap-h-sm">
        <span class="rounded-h-control bg-h-primary px-h-md py-h-sm text-h-primary-contrast text-h-label">bg-h-primary</span>
        <span class="rounded-h-control bg-h-surface-secondary px-h-md py-h-sm text-h-ink text-h-label">bg-h-surface-secondary</span>
        <span class="rounded-h-control border border-h-border-subtle px-h-md py-h-sm text-h-ink-muted text-h-label">text-h-ink-muted</span>
      </div>
      <div class="mt-h-md flex flex-wrap items-center gap-h-sm">
        <span class="text-h-ink-muted text-h-label">主题</span>
        <HButton :variant="theme === 'system' ? 'primary' : 'ghost'" size="sm" @click="setTheme('system')">跟随系统</HButton>
        <HButton :variant="theme === 'light' ? 'primary' : 'ghost'" size="sm" @click="setTheme('light')">亮色</HButton>
        <HButton :variant="theme === 'dark' ? 'primary' : 'ghost'" size="sm" @click="setTheme('dark')">暗色</HButton>
      </div>
    </header>

    <section class="smoke__section" aria-labelledby="navbar-heading">
      <h2 id="navbar-heading" class="smoke__section-title">HNavBar</h2>
      <p class="smoke__lead">
        页面顶部演示默认返回按钮、标题和右侧操作；组件只抛出事件，不执行路由或历史返回。
      </p>
      <p class="smoke__ping">最近操作：{{ navAction }}</p>
      <div class="smoke__nav-frame">
        <h-nav-bar
          title="此 prop 标题会被插槽覆盖"
          show-back
          :fixed="false"
          :safe-area="false"
          @handle-left-click="onNavLeftClick"
          @handle-right-click="onNavRightClick"
        >
          <template #left>
            <button type="button" class="smoke__nav-action">取消</button>
          </template>
          <template #title>
            <h2 class="smoke__nav-title">自定义标题插槽</h2>
          </template>
          <template #right>
            <button type="button" class="smoke__nav-action">保存</button>
          </template>
        </h-nav-bar>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="button-heading">
      <h2 id="button-heading" class="smoke__section-title">HButton variants × sizes</h2>
      <div
        v-for="size in buttonSizes"
        :key="size"
        class="smoke__button-block"
      >
        <p class="smoke__hint">size={{ size }}</p>
        <div class="smoke__row smoke__row--wrap">
          <h-button
            v-for="variant in buttonVariants"
            :key="`${size}-${variant}`"
            :variant="variant"
            :size="size"
            @click="onButtonClick"
          >
            {{ variant }}
          </h-button>
          <h-button :size="size" disabled>disabled</h-button>
          <h-button :size="size" variant="outline">
            <template #leading>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </template>
            leading
          </h-button>
        </div>
      </div>
      <p v-if="buttonClicks > 0" class="smoke__ping">Button 点击：{{ buttonClicks }}</p>
    </section>

    <section class="smoke__section" aria-labelledby="icon-button-heading">
      <h2 id="icon-button-heading" class="smoke__section-title">HButton isIconOnly × sizes × shapes</h2>
      <div
        v-for="size in buttonSizes"
        :key="`icon-btn-${size}`"
        class="smoke__button-block"
      >
        <p class="smoke__hint">size={{ size }} · square</p>
        <div class="smoke__row smoke__row--wrap">
          <h-button
            v-for="variant in buttonVariants"
            :key="`icon-square-${size}-${variant}`"
            is-icon-only
            :variant="variant"
            :size="size"
            shape="square"
            :aria-label="`${variant} square ${size}`"
            @click="onIconButtonClick"
          >
            <h-icon :icon="Star" :size="size" aria-hidden="true" />
          </h-button>
          <h-button
            is-icon-only
            :size="size"
            shape="square"
            disabled
            aria-label="disabled square"
          >
            <h-icon :icon="Star" :size="size" aria-hidden="true" />
          </h-button>
        </div>
        <p class="smoke__hint">size={{ size }} · circle</p>
        <div class="smoke__row smoke__row--wrap">
          <h-button
            v-for="variant in buttonVariants"
            :key="`icon-circle-${size}-${variant}`"
            is-icon-only
            :variant="variant"
            :size="size"
            shape="circle"
            :aria-label="`${variant} circle ${size}`"
            @click="onIconButtonClick"
          >
            <h-icon :icon="Heart" :size="size" aria-hidden="true" />
          </h-button>
          <h-button
            is-icon-only
            :size="size"
            shape="circle"
            variant="ghost"
            aria-label="close"
            @click="onIconButtonClick"
          >
            <h-icon :icon="X" :size="size" aria-hidden="true" />
          </h-button>
        </div>
      </div>
      <p v-if="iconButtonClicks > 0" class="smoke__ping">IconButton 点击：{{ iconButtonClicks }}</p>
    </section>

    <section class="smoke__section" aria-labelledby="switch-heading">
      <h2 id="switch-heading" class="smoke__section-title">HSwitch</h2>
      <div class="smoke__row smoke__row--wrap smoke__switch-row">
        <label class="smoke__switch-item">
          <span class="smoke__hint smoke__hint--inline">md v-model</span>
          <h-switch v-model="switchOn" aria-label="示例开关" />
          <span class="smoke__hint smoke__hint--inline">{{ switchOn ? 'on' : 'off' }}</span>
        </label>
        <label class="smoke__switch-item">
          <span class="smoke__hint smoke__hint--inline">disabled on</span>
          <h-switch :model-value="true" disabled aria-label="禁用开" />
        </label>
        <label class="smoke__switch-item">
          <span class="smoke__hint smoke__hint--inline">disabled off</span>
          <h-switch :model-value="false" disabled aria-label="禁用关" />
        </label>
      </div>
      <p class="smoke__hint">sizes</p>
      <div class="smoke__row smoke__row--wrap">
        <h-switch v-model="switchSm" size="sm" aria-label="小开关" />
        <h-switch v-model="switchMd" size="md" aria-label="中开关" />
        <h-switch v-model="switchLg" size="lg" aria-label="大开关" />
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="range-heading">
      <h2 id="range-heading" class="smoke__section-title">HRange</h2>
      <div class="smoke__field-stack">
        <div>
          <p class="smoke__hint">基础 v-model：{{ rangeValue }}</p>
          <h-range v-model="rangeValue" aria-label="基础滑块" />
        </div>
        <div>
          <p class="smoke__hint">步进 step=10（0–100）：{{ rangeStep }}</p>
          <h-range v-model="rangeStep" :step="10" aria-label="步进滑块" />
        </div>
        <div>
          <p class="smoke__hint">自定义区间 min=-50 max=50 step=5：{{ rangeCustom }}</p>
          <h-range v-model="rangeCustom" :min="-50" :max="50" :step="5" aria-label="自定义区间滑块" />
        </div>
        <div>
          <p class="smoke__hint">disabled</p>
          <h-range :model-value="40" disabled aria-label="禁用滑块" />
        </div>
      </div>
      <p class="smoke__hint">sizes</p>
      <div class="smoke__field-stack">
        <h-range v-model="rangeSm" size="sm" aria-label="小滑块" />
        <h-range v-model="rangeMd" size="md" aria-label="中滑块" />
        <h-range v-model="rangeLg" size="lg" aria-label="大滑块" />
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="progress-heading">
      <h2 id="progress-heading" class="smoke__section-title">HProgress</h2>
      <div class="smoke__field-stack">
        <div>
          <p class="smoke__hint">确定进度：{{ progressValue }}%</p>
          <h-progress :value="progressValue" aria-label="安装进度" />
          <div class="smoke__row smoke__row--tight">
            <h-button size="sm" variant="outline" @click="progressValue = Math.max(progressValue - 10, 0)">减少</h-button>
            <h-button size="sm" @click="progressValue = Math.min(progressValue + 10, 100)">增加</h-button>
          </div>
        </div>
        <div>
          <p class="smoke__hint">自定义 max + 越界夹取：value=140 max=120</p>
          <h-progress :value="140" :max="120" variant="success" aria-label="同步进度" />
        </div>
        <div>
          <p class="smoke__hint">不确定进度</p>
          <h-progress indeterminate variant="warning" aria-label="加载中" />
        </div>
        <div>
          <p class="smoke__hint">sizes</p>
          <div class="smoke__field-stack smoke__field-stack--compact">
            <h-progress :value="30" size="sm" aria-label="小进度条" />
            <h-progress :value="55" size="md" aria-label="中进度条" />
            <h-progress :value="80" size="lg" aria-label="大进度条" />
          </div>
        </div>
        <div>
          <p class="smoke__hint">variants + rounded=false</p>
          <div class="smoke__field-stack smoke__field-stack--compact">
            <h-progress :value="25" variant="primary" aria-label="Primary 进度" />
            <h-progress :value="50" variant="success" aria-label="Success 进度" />
            <h-progress :value="75" variant="warning" aria-label="Warning 进度" />
            <h-progress :value="90" variant="danger" :rounded="false" aria-label="Danger 进度" />
          </div>
        </div>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="loading-heading">
      <h2 id="loading-heading" class="smoke__section-title">HLoading</h2>
      <div class="smoke__field-stack">
        <div>
          <p class="smoke__hint">local 默认：父容器 relative，绝对覆盖居中；三档尺寸</p>
          <div class="smoke__row smoke__row--wrap" style="align-items: stretch;">
            <div
              v-for="size in (['sm', 'md', 'lg'] as const)"
              :key="size"
              style="position: relative; width: 120px; height: 96px; border: 1px dashed var(--h-color-border-subtle, #e0e0e0); border-radius: 12px;"
            >
              <h-loading :size="size" :label="size" />
            </div>
          </div>
        </div>
        <div>
          <p class="smoke__hint">local + label prop / default slot</p>
          <div class="smoke__row smoke__row--wrap" style="align-items: stretch;">
            <div style="position: relative; width: 160px; height: 120px; border: 1px dashed var(--h-color-border-subtle, #e0e0e0); border-radius: 12px;">
              <h-loading label="加载中…" />
            </div>
            <div style="position: relative; width: 160px; height: 120px; border: 1px dashed var(--h-color-border-subtle, #e0e0e0); border-radius: 12px;">
              <h-loading>插槽文案</h-loading>
            </div>
          </div>
        </div>
        <div>
          <p class="smoke__hint">深色变量覆盖（--h-loading-track / --h-loading-thumb）</p>
          <div
            style="position: relative; width: 160px; height: 120px; border-radius: 12px; background: #1f1f1f; color: #fff; --h-loading-track: rgba(255,255,255,0.22); --h-loading-thumb: #ffffff;"
          >
            <h-loading label="深色场景" />
          </div>
        </div>
        <div>
          <p class="smoke__hint">global：全屏微遮罩 + 深色 HUD 卡片（约 2s 自动关闭）</p>
          <div class="smoke__row smoke__row--wrap">
            <h-button @click="openLoadingGlobal(false)">打开全局 Loading</h-button>
            <h-button variant="outline" @click="openLoadingGlobal(true)">打开（带文案）</h-button>
          </div>
          <h-loading v-if="loadingGlobal" mode="global" />
          <h-loading v-if="loadingGlobalLabel" mode="global" label="正在同步…" />
        </div>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="sheet-heading">
      <h2 id="sheet-heading" class="smoke__section-title">HBottomSheet</h2>
      <div class="smoke__row smoke__row--wrap">
        <h-button @click="sheetOpen = true">打开底部面板</h-button>
        <h-button variant="outline" @click="openSheetNoOverlayClose">
          打开（遮罩不关）
        </h-button>
        <h-button variant="ghost" @click="sheetLimited = true">
          打开（限宽 640px）
        </h-button>
      </div>
      <p v-if="sheetCloseCount > 0" class="smoke__ping">
        close 次数：{{ sheetCloseCount }}
      </p>

      <h-bottom-sheet
        v-model="sheetOpen"
        title="示例底部面板"
        @close="onSheetClose"
      >
        <p class="smoke__sheet-copy">
          遮罩点击或 Esc 可关闭。内容区可放表单、操作按钮等。
        </p>
        <div class="smoke__row smoke__row--wrap">
          <h-button size="sm" @click="sheetOpen = false">完成</h-button>
          <h-button size="sm" variant="ghost" @click="sheetOpen = false">取消</h-button>
        </div>
      </h-bottom-sheet>

      <h-bottom-sheet
        v-model="sheetNoOverlayClose"
        :close-on-overlay="false"
        title="遮罩不关闭"
        @close="onSheetClose"
      >
        <p class="smoke__sheet-copy">
          点击遮罩不会关闭；请用 Esc 或下方按钮。
        </p>
        <h-button size="sm" @click="sheetNoOverlayClose = false">关闭</h-button>
      </h-bottom-sheet>

      <h-bottom-sheet
        v-model="sheetLimited"
        title="限宽 640px"
        :max-width="640"
        @close="onSheetClose"
      >
        <p class="smoke__sheet-copy">
          宽屏下 max-width="640" 使面板居中最宽 640px（桌面卡片感）；不传则全宽通栏。
        </p>
        <h-button size="sm" @click="sheetLimited = false">关闭</h-button>
      </h-bottom-sheet>
    </section>

    <section class="smoke__section" aria-labelledby="dialog-heading">
      <h2 id="dialog-heading" class="smoke__section-title">HDialog</h2>
      <div class="smoke__row smoke__row--wrap">
        <h-button @click="dialogOpen = true">打开对话框</h-button>
        <h-button variant="outline" @click="dialogNoOverlayClose = true">
          打开（遮罩不关）
        </h-button>
      </div>
      <p v-if="dialogCloseCount > 0" class="smoke__ping">
        dialog close 次数：{{ dialogCloseCount }}
      </p>

      <h-dialog
        v-model="dialogOpen"
        title="确认操作"
        description="这是居中 Dialog 示例。遮罩或 Esc 可关闭。"
        @close="onDialogClose"
      >
        <p class="smoke__sheet-copy">也可在内容区放自定义正文。</p>
        <template #actions>
          <h-button size="sm" variant="ghost" @click="dialogOpen = false">取消</h-button>
          <h-button size="sm" @click="dialogOpen = false">确认</h-button>
        </template>
      </h-dialog>

      <h-dialog
        v-model="dialogNoOverlayClose"
        :close-on-overlay="false"
        title="遮罩不关闭"
        description="请用 Esc 或按钮关闭。"
        @close="onDialogClose"
      >
        <template #actions>
          <h-button size="sm" @click="dialogNoOverlayClose = false">关闭</h-button>
        </template>
      </h-dialog>
    </section>

    <section class="smoke__section" aria-labelledby="popup-heading">
      <h2 id="popup-heading" class="smoke__section-title">HPopup</h2>
      <p class="smoke__hint smoke__hint--spaced">通用浮层基础件；position 统摄 bottom/top/left/right/center/relative/fullscreen。</p>
      <p class="smoke__hint smoke__hint--spaced"><strong>bottom（带 handle + closeable）</strong></p>
      <div class="smoke__row">
        <h-button @click="popupBottom = true">底部弹层</h-button>
      </div>
      <h-popup
        v-model="popupBottom"
        position="bottom"
        title="底部弹层"
        :handle="true"
        closeable
        @close="popupCloseCount++"
      >
        <p class="smoke__hint">position="bottom"，自带拖拽手柄与右上角 X。</p>
        <h-button size="sm" @click="popupBottom = false">关闭</h-button>
      </h-popup>

      <p class="smoke__hint smoke__hint--spaced"><strong>center（带 footer）</strong></p>
      <div class="smoke__row">
        <h-button @click="popupCenter = true">居中弹层</h-button>
      </div>
      <h-popup
        v-model="popupCenter"
        position="center"
        title="居中弹层"
        closeable
        @close="popupCloseCount++"
      >
        <p class="smoke__hint">position="center"，全屏遮罩居中卡片。</p>
        <template #footer>
          <h-button size="sm" variant="ghost" @click="popupCenter = false">取消</h-button>
          <h-button size="sm" @click="popupCenter = false">确认</h-button>
        </template>
      </h-popup>

      <p class="smoke__hint smoke__hint--spaced"><strong>left（侧边抽屉）</strong></p>
      <div class="smoke__row">
        <h-button @click="popupLeft = true">左侧抽屉</h-button>
      </div>
      <h-popup
        v-model="popupLeft"
        position="left"
        title="左侧面板"
        closeable
        @close="popupCloseCount++"
      >
        <p class="smoke__hint">position="left"，面板从左侧滑入。</p>
        <h-button size="sm" @click="popupLeft = false">关闭</h-button>
      </h-popup>

      <p class="smoke__hint smoke__hint--spaced"><strong>right（右侧面板）</strong></p>
      <div class="smoke__row">
        <h-button @click="popupRight = true">右侧抽屉</h-button>
      </div>
      <h-popup
        v-model="popupRight"
        position="right"
        title="右侧面板"
        closeable
        @close="popupCloseCount++"
      >
        <p class="smoke__hint">position="right"，面板从右侧滑入。</p>
        <h-button size="sm" @click="popupRight = false">关闭</h-button>
      </h-popup>

      <p class="smoke__hint smoke__hint--spaced"><strong>relative（相对 trigger 定位 + closeable）</strong></p>
      <div class="smoke__row">
        <h-button
          ref="popupRelTrigger"
          variant="outline"
          @click="popupRelative = !popupRelative"
        >
          {{ popupRelative ? '关闭相对弹层' : '打开相对弹层' }}
        </h-button>
      </div>
      <h-popup
        v-model="popupRelative"
        position="relative"
        :trigger-ref="popupRelTrigger"
        title="相对弹层"
        closeable
        :close-on-overlay="false"
        radius="sm"
        @close="popupCloseCount++"
      >
        <p class="smoke__hint">position="relative"：无遮罩 · JS 计算坐标 · resize/scroll 重算 · 边缘翻转。</p>
        <h-button size="sm" @click="popupRelative = false">关闭</h-button>
      </h-popup>

      <p class="smoke__hint smoke__hint--spaced"><strong>fullscreen（全屏 + 下滑关闭）</strong></p>
      <div class="smoke__row">
        <h-button @click="popupFullscreen = true">全屏弹层</h-button>
      </div>
      <h-popup
        v-model="popupFullscreen"
        position="fullscreen"
        title="不会渲染的内置标题"
        aria-label="全屏演示弹层"
        closeable
        @close="popupCloseCount++"
      >
        <div style="min-height: 120vh; padding: 24px; background: var(--h-color-surface, #fff)">
          <h2 style="margin: 0 0 12px">宿主自管全屏头部</h2>
          <p class="smoke__hint">内容滚动到顶部后向下滑：位移 ≥ 80px 或速度 ≥ 0.3px/ms 时关闭；短距离会回弹。</p>
          <p class="smoke__hint">右上角 X 与 Esc 仍可作为备用关闭方式。</p>
          <h-button size="sm" @click="popupFullscreen = false">关闭</h-button>
        </div>
      </h-popup>

      <p class="smoke__hint smoke__hint--spaced"><strong>keepAlive（内容保活：关闭仅隐藏不卸载）</strong></p>
      <div class="smoke__row">
        <h-button @click="popupKeepAlive = true">打开保活弹层</h-button>
      </div>
      <h-popup
        v-model="popupKeepAlive"
        position="bottom"
        title="保活弹层"
        :handle="true"
        :keep-alive="true"
        @close="popupCloseCount++"
      >
        <p class="smoke__hint">keepAlive=true：关闭再打开内容不重建，计数不重置；入场动画照常重放。</p>
        <p class="smoke__hint">点击次数：{{ popupKeepAliveCount }}</p>
        <div class="smoke__row">
          <h-button size="sm" @click="popupKeepAliveCount++">+1</h-button>
          <h-button size="sm" @click="popupKeepAlive = false">关闭</h-button>
        </div>
      </h-popup>

      <p class="smoke__hint smoke__hint--spaced"><strong>fullscreen + swipeClose=false（内置下滑手势禁用，交还宿主）</strong></p>
      <div class="smoke__row">
        <h-button @click="popupSwipeDisabled = true">全屏弹层（禁手势）</h-button>
      </div>
      <h-popup
        v-model="popupSwipeDisabled"
        position="fullscreen"
        aria-label="全屏演示弹层（禁下滑手势）"
        closeable
        :swipe-close="false"
        @close="popupCloseCount++"
      >
        <div style="min-height: 120vh; padding: 24px; background: var(--h-color-surface, #fff)">
          <h2 style="margin: 0 0 12px">宿主自管全屏头部（swipeClose=false）</h2>
          <p class="smoke__hint">内置下滑手势已禁用：拖动不会关闭、不 preventDefault，面板 touch-action: auto，手势由宿主全权控制。</p>
          <p class="smoke__hint">右上角 X 与 Esc 仍可作为备用关闭方式。</p>
          <h-button size="sm" @click="popupSwipeDisabled = false">关闭</h-button>
        </div>
      </h-popup>
    </section>

    <section class="smoke__section" aria-labelledby="input-heading">
      <h2 id="input-heading" class="smoke__section-title">HInput</h2>
      <div class="smoke__field-stack">
        <h-input
          v-model="simpleName"
          label="v-model 示例"
          description="标准受控输入"
          placeholder="输入名称"
        />
        <p class="smoke__hint smoke__hint--inline">当前值：{{ simpleName || '（空）' }}</p>
        <h-input
          model-value="bad"
          label="错误态"
          error="请输入有效内容"
          size="sm"
        />
        <h-input
          model-value="disabled"
          label="禁用"
          disabled
          size="lg"
        />
      </div>

      <p class="smoke__hint smoke__hint--spaced">TanStack Vue Form 对接</p>
      <form class="smoke__field-stack" @submit.prevent.stop="onTanstackSubmit">
        <form.Field name="email">
          <template #default="{ field }">
            <h-input
              label="Email"
              type="email"
              placeholder="you@example.com"
              :name="field.name"
              :model-value="String(field.state.value ?? '')"
              :error="fieldError(field.state.meta.errors)"
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </template>
        </form.Field>
        <form.Field name="password">
          <template #default="{ field }">
            <h-input
              label="Password"
              type="password"
              :name="field.name"
              :model-value="String(field.state.value ?? '')"
              :error="fieldError(field.state.meta.errors)"
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </template>
        </form.Field>
        <div class="smoke__row smoke__row--wrap">
          <h-button type="submit" size="sm">提交 TanStack 表单</h-button>
        </div>
        <p v-if="tanstackSubmitMsg" class="smoke__ping">{{ tanstackSubmitMsg }}</p>
      </form>
    </section>

    <section class="smoke__section" aria-labelledby="textarea-heading">
      <h2 id="textarea-heading" class="smoke__section-title">HTextarea</h2>
      <div class="smoke__field-stack">
        <div>
          <p class="smoke__hint">基础 v-model：{{ textareaValue || '（空）' }}</p>
          <h-textarea v-model="textareaValue" label="备注" placeholder="输入多行文本..." />
        </div>
        <div>
          <p class="smoke__hint">sizes + rows</p>
          <h-textarea v-model="textareaSm" size="sm" label="sm" placeholder="小号" :rows="2" />
          <h-textarea v-model="textareaValue" size="md" label="md" placeholder="中号" :rows="3" />
          <h-textarea v-model="textareaLg" size="lg" label="lg" placeholder="大号" :rows="4" />
        </div>
        <div>
          <p class="smoke__hint">resize auto（自动撑高）</p>
          <h-textarea v-model="textareaAuto" label="自动撑高" placeholder="输入文字看效果..." resize="auto" />
        </div>
        <div>
          <p class="smoke__hint">maxLength + showCount</p>
          <h-textarea v-model="textareaCount" label="限 50 字" :max-length="50" show-count placeholder="最多 50 字..." />
        </div>
        <div>
          <p class="smoke__hint">error</p>
          <h-textarea v-model="textareaValue" label="反馈" error="内容不得为空" />
        </div>
        <div>
          <p class="smoke__hint">disabled</p>
          <h-textarea model-value="禁用的内容" label="禁用" disabled />
        </div>
        <div>
          <p class="smoke__hint">mono（等宽字体，适合 JSON / curl）</p>
          <h-textarea v-model="textareaMono" label="JSON" mono :rows="3" placeholder='{"key":"sk-...","url":"https://..."}' />
        </div>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="select-heading">
      <h2 id="select-heading" class="smoke__section-title">HSelect</h2>
      <div class="smoke__field-stack">
        <div>
          <p class="smoke__hint">基础 v-model + label：{{ selectValue || '（空）' }}</p>
          <h-select
            v-model="selectValue"
            :options="selectOptions"
            label="水果"
            description="自定义 popover 面板，键盘可导航"
            placeholder="请选择水果"
            clearable
            @change="selectLabel = String($event)"
          />
        </div>
        <div>
          <p class="smoke__hint smoke__hint--inline">change: {{ selectLabel || '（未触发）' }}</p>
        </div>
        <div>
          <p class="smoke__hint">labelPlacement=inside</p>
          <h-select
            v-model="selectInside"
            :options="selectOptions"
            label="城市"
            label-placement="inside"
            placeholder="选择城市"
          />
        </div>
        <div>
          <p class="smoke__hint">variants（flat / bordered / faded / underlined）</p>
          <div class="smoke__field-stack">
            <h-select :options="selectOptions" variant="flat" placeholder="flat" aria-label="flat" />
            <h-select :options="selectOptions" variant="bordered" placeholder="bordered" aria-label="bordered" />
            <h-select :options="selectOptions" variant="faded" placeholder="faded" aria-label="faded" />
            <h-select :options="selectOptions" variant="underlined" placeholder="underlined" aria-label="underlined" />
          </div>
        </div>
        <div>
          <p class="smoke__hint">colors</p>
          <div class="smoke__field-stack">
            <h-select :options="selectOptions" variant="bordered" color="primary" placeholder="primary" aria-label="primary" />
            <h-select :options="selectOptions" variant="bordered" color="success" placeholder="success" aria-label="success" />
            <h-select :options="selectOptions" variant="bordered" color="warning" placeholder="warning" aria-label="warning" />
            <h-select :options="selectOptions" variant="bordered" color="danger" placeholder="danger" aria-label="danger" />
          </div>
        </div>
        <div>
          <p class="smoke__hint">radius（none / sm / md / lg / full）</p>
          <div class="smoke__field-stack">
            <h-select :options="selectOptions" variant="bordered" radius="none" placeholder="none" aria-label="radius none" />
            <h-select :options="selectOptions" variant="bordered" radius="sm" placeholder="sm" aria-label="radius sm" />
            <h-select :options="selectOptions" variant="bordered" radius="md" placeholder="md" aria-label="radius md" />
            <h-select :options="selectOptions" variant="bordered" radius="lg" placeholder="lg" aria-label="radius lg" />
            <h-select :options="selectOptions" variant="bordered" radius="full" placeholder="full" aria-label="radius full" />
          </div>
        </div>
        <div>
          <p class="smoke__hint">sizes</p>
          <div class="smoke__field-stack">
            <h-select :options="selectOptions" size="sm" placeholder="sm" aria-label="小号" />
            <h-select :options="selectOptions" size="md" placeholder="md" aria-label="中号" />
            <h-select :options="selectOptions" size="lg" placeholder="lg" aria-label="大号" />
          </div>
        </div>
        <div>
          <p class="smoke__hint">disabled</p>
          <h-select :options="selectOptions" disabled placeholder="禁用" aria-label="禁用" />
        </div>
        <div>
          <p class="smoke__hint">invalid + error</p>
          <h-select
            :options="selectOptions"
            label="必选项"
            error="请选择一个选项"
            placeholder="选择"
          />
        </div>
        <div>
          <p class="smoke__hint">带 description 的选项 + 长列表滚动</p>
          <h-select
            :options="selectLongOptions"
            placeholder="选择时区"
            aria-label="时区"
          />
        </div>
        <div>
          <p class="smoke__hint">自定义 option slot</p>
          <h-select :options="selectOptions" placeholder="选择水果" aria-label="自定义选项">
            <template #option="{ option }">
              <span>🍉 {{ option.label }}</span>
            </template>
          </h-select>
        </div>
        <div>
          <p class="smoke__hint">#start / #end / #value 自定义</p>
          <h-select
            v-model="selectValue"
            :options="selectOptions"
            placeholder="选择水果"
            aria-label="自定义 start end"
          >
            <template #start>
              <h-icon :icon="Search" size="sm" aria-hidden="true" />
            </template>
            <template #value="{ option, placeholder }">
              <span>{{ option ? `已选：${option.label}` : placeholder }}</span>
            </template>
            <template #end>
              <span class="smoke__hint" style="margin:0;font-size:12px">⭐</span>
            </template>
          </h-select>
        </div>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="table-heading">
      <h2 id="table-heading" class="smoke__section-title">HTable</h2>
      <div class="smoke__field-stack">
        <div>
          <p class="smoke__hint">基础</p>
          <h-table
            :columns="tableColumns"
            :data="tableData"
          />
        </div>
        <div>
          <p class="smoke__hint">bordered + striped</p>
          <h-table
            :columns="tableColumns"
            :data="tableData"
            bordered
            striped
          />
        </div>
        <div>
          <p class="smoke__hint">stickyHeader（滚动容器 240px）</p>
          <div style="max-height: 240px; overflow-y: auto;">
            <h-table
              :columns="tableColumns"
              :data="tableLongData"
              sticky-header
            />
          </div>
        </div>
        <div>
          <p class="smoke__hint">sortable（当前: {{ tableSort }}）</p>
          <h-table
            :columns="tableColumns"
            :data="tableData"
            @sort="tableSort = $event"
          />
        </div>
        <div>
          <p class="smoke__hint">loading</p>
          <h-table
            :columns="tableColumns"
            :data="tableData"
            loading
          />
        </div>
        <div>
          <p class="smoke__hint">空数据</p>
          <h-table
            :columns="tableColumns"
            :data="[]"
          />
        </div>
        <div>
          <p class="smoke__hint">自定义 cell slot（状态码着色）</p>
          <h-table
            :columns="tableColumns"
            :data="tableData"
            bordered
            striped
          >
            <template #cell="{ column, row }">
              <span
                v-if="column.key === 'status'"
                :style="{
                  color: row.status >= 400 ? 'var(--h-color-danger, #eb445a)' :
                         row.status >= 300 ? 'var(--h-color-warning, #f5a623)' :
                         'var(--h-color-success, #22c55e)',
                  fontWeight: 600,
                }"
              >{{ row.status }}</span>
              <template v-else>{{ row[column.key] }}</template>
            </template>
          </h-table>
        </div>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="badge-heading">
      <h2 id="badge-heading" class="smoke__section-title">HBadge</h2>
      <div class="smoke__field-stack">
        <div>
          <p class="smoke__hint">variants</p>
          <div class="smoke__row smoke__row--wrap">
            <h-badge>default</h-badge>
            <h-badge variant="success">success</h-badge>
            <h-badge variant="warning">warning</h-badge>
            <h-badge variant="danger">danger</h-badge>
            <h-badge variant="info">info</h-badge>
          </div>
        </div>
        <div>
          <p class="smoke__hint">sizes</p>
          <div class="smoke__row smoke__row--wrap">
            <h-badge size="sm">sm</h-badge>
            <h-badge size="md">md</h-badge>
          </div>
        </div>
        <div>
          <p class="smoke__hint">dot 模式</p>
          <div class="smoke__row smoke__row--wrap">
            <h-badge dot variant="success" aria-label="运行中" />
            <h-badge dot variant="warning" aria-label="警告" />
            <h-badge dot variant="danger" aria-label="错误" />
            <h-badge dot variant="info" aria-label="信息" />
            <span class="smoke__hint" style="font-size:12px">运行中 警告 错误 信息</span>
          </div>
        </div>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="tag-heading">
      <h2 id="tag-heading" class="smoke__section-title">HTag</h2>
      <div class="smoke__field-stack">
        <div>
          <p class="smoke__hint">variants</p>
          <div class="smoke__row smoke__row--wrap">
            <h-tag>default</h-tag>
            <h-tag variant="primary">primary</h-tag>
            <h-tag variant="success">success</h-tag>
            <h-tag variant="warning">warning</h-tag>
            <h-tag variant="danger">danger</h-tag>
          </div>
        </div>
        <div>
          <p class="smoke__hint">sizes</p>
          <div class="smoke__row smoke__row--wrap">
            <h-tag size="sm">sm</h-tag>
            <h-tag size="md">md</h-tag>
          </div>
        </div>
        <div>
          <p class="smoke__hint">closable</p>
          <div class="smoke__row smoke__row--wrap">
            <h-tag closable variant="primary">标签一</h-tag>
            <h-tag closable variant="success">标签二</h-tag>
            <h-tag closable variant="danger">标签三</h-tag>
          </div>
        </div>
        <div>
          <p class="smoke__hint">disabled</p>
          <div class="smoke__row smoke__row--wrap">
            <h-tag disabled>禁用</h-tag>
            <h-tag disabled closable variant="primary">禁用可关闭</h-tag>
          </div>
        </div>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="checkbox-heading">
      <h2 id="checkbox-heading" class="smoke__section-title">HCheckbox</h2>
      <div class="smoke__field-stack">
        <h-checkbox
          v-model="checkOn"
          label="接受条款"
        />
        <p class="smoke__hint smoke__hint--inline">
          v-model：{{ checkOn ? 'checked' : 'unchecked' }}
        </p>
        <h-checkbox
          :model-value="true"
          disabled
          label="禁用（已选）"
        />
        <h-checkbox
          :model-value="false"
          disabled
          label="禁用（未选）"
        />
        <div class="smoke__row smoke__row--wrap">
          <h-checkbox v-model="checkSm" size="sm" label="sm" />
          <h-checkbox v-model="checkMd" size="md" label="md" />
          <h-checkbox v-model="checkLg" size="lg" label="lg" />
        </div>
        <h-checkbox
          :model-value="selectAll"
          :indeterminate="selectIndeterminate"
          label="全选（半选演示）"
          @update:model-value="onSelectAll"
        />
        <div class="smoke__field-stack smoke__field-stack--indent">
          <h-checkbox v-model="itemA" label="子项 A" />
          <h-checkbox v-model="itemB" label="子项 B" />
          <h-checkbox v-model="itemC" label="子项 C" />
        </div>
        <h-checkbox
          v-model="checkAriaOnly"
          aria-label="无文案复选框"
        />
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="empty-heading">
      <h2 id="empty-heading" class="smoke__section-title">HEmpty</h2>
      <div class="smoke__empty-frame">
        <h-empty
          title="暂无内容"
          description="这里还没有任何项目。可添加数据或调整筛选条件。"
        >
          <template #icon>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M3 9h18"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <h-button size="sm" @click="emptyActionClicks += 1">添加项目</h-button>
          <h-button size="sm" variant="ghost">了解更多</h-button>
        </h-empty>
      </div>
      <p v-if="emptyActionClicks > 0" class="smoke__ping">
        empty action 点击：{{ emptyActionClicks }}
      </p>
      <p class="smoke__hint smoke__hint--spaced">仅标题 + 描述</p>
      <div class="smoke__empty-frame smoke__empty-frame--short">
        <h-empty
          title="搜索无结果"
          description="试试其他关键词。"
        />
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="cell-heading">
      <h2 id="cell-heading" class="smoke__section-title">HCell / HCellGroup</h2>
      <h-cell-group title="通用">
        <h-cell
          title="语言"
          description="用于界面与内容显示"
          clickable
          @click="onCellClick('语言')"
        >
          <template #prefix>
            <h-icon :icon="Languages" />
          </template>
          <template #suffix>简体中文</template>
        </h-cell>
        <h-cell
          title="通知"
          description="允许重要提醒"
        >
          <template #prefix>
            <h-icon :icon="Bell" />
          </template>
          <template #suffix>
            <h-switch v-model="cellNotifications" ariaLabel="允许通知" />
          </template>
        </h-cell>
        <h-cell title="应用版本" description="稳定版" ariaLabel="应用版本 0.0.2">
          <template #suffix>0.0.2</template>
        </h-cell>
      </h-cell-group>
      <p v-if="cellAction" class="smoke__ping">最近激活：{{ cellAction }}</p>

      <p class="smoke__hint smoke__hint--spaced">flat 分组</p>
      <h-cell-group :inset="false">
        <h-cell title="存储空间" description="已使用 1.2 GB" />
        <h-cell title="关于" clickable :show-chevron="false" @click="onCellClick('关于')" />
        <h-cell title="装饰导航指示" show-chevron />
      </h-cell-group>

      <p class="smoke__hint smoke__hint--spaced">card 卡片形态（灰底容器凸显悬浮感）</p>
      <div style="padding: 4px 0; background: var(--h-color-bg-muted, #f4f4f5); border-radius: 12px;">
        <h-cell-group variant="card" title="账户">
          <h-cell title="头像" description="修改你的头像">
            <template #suffix>去设置</template>
          </h-cell>
          <h-cell title="昵称" description="对外展示的名称" clickable @click="onCellClick('昵称')" />
          <h-cell title="会员" description="有效期至 2027-01-01">
            <template #prefix>
              <h-icon :icon="Star" />
            </template>
          </h-cell>
        </h-cell-group>
      </div>
      <p class="smoke__hint">card 与 inset/flat 并排：仅 group 层面留白，cell 交互契约不变</p>
    </section>

    <section class="smoke__section" aria-labelledby="card-heading">
      <h2 id="card-heading" class="smoke__section-title">HCard</h2>

      <p class="smoke__hint">variant 三态</p>
      <div class="smoke__card-grid">
        <h-card
          v-for="variant in cardVariants"
          :key="variant"
          :variant="variant"
        >
          <strong class="smoke__card-title">{{ variant }}</strong>
          <p class="smoke__card-copy">表面、边框与圆角均由 happier-ui token 驱动。</p>
        </h-card>
      </div>

      <p class="smoke__hint smoke__hint--spaced">padding / radius</p>
      <div class="smoke__card-grid">
        <h-card
          v-for="padding in cardPaddings"
          :key="`padding-${padding}`"
          :padding="padding"
        >
          padding={{ padding }}
        </h-card>
        <h-card
          v-for="radius in cardRadii"
          :key="`radius-${radius}`"
          :radius="radius"
          variant="filled"
        >
          radius={{ radius }}
        </h-card>
      </div>

      <p class="smoke__hint smoke__hint--spaced">header / footer 组合</p>
      <div class="smoke__card-grid">
        <h-card>
          只有 body
        </h-card>
        <h-card>
          <template #header>
            <strong class="smoke__card-title">Header</strong>
          </template>
          header + body
        </h-card>
        <h-card variant="filled">
          <template #header>
            <strong class="smoke__card-title">完整卡片</strong>
          </template>
          header + body + footer
          <template #footer>
            <div class="smoke__row">
              <h-button size="sm">确认</h-button>
              <h-button size="sm" variant="ghost">取消</h-button>
            </div>
          </template>
        </h-card>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="image-heading">
      <h2 id="image-heading" class="smoke__section-title">HImage</h2>
      <div class="smoke__row smoke__row--wrap">
        <h-image
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80"
          alt="耳机与唱片机"
          :width="160"
          :height="160"
        />
        <h-image
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80"
          alt="现场演出"
          :width="160"
          :height="160"
          fit="contain"
          radius="lg"
        />
        <h-image
          src="https://invalid.example.com/image.jpg"
          alt="失败占位示例"
          :width="96"
          :height="96"
          radius="full"
        >
          <template #fallback>
            <span class="smoke__image-fallback" aria-hidden="true">♫</span>
          </template>
        </h-image>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="icon-heading">
      <h2 id="icon-heading" class="smoke__section-title">HIcon</h2>
      <p class="smoke__hint">sizes</p>
      <div class="smoke__row smoke__row--wrap smoke__icon-row">
        <h-icon :icon="Search" size="sm" />
        <h-icon :icon="Search" size="md" />
        <h-icon :icon="Search" size="lg" />
        <h-icon :icon="Search" :size="32" />
      </div>
      <p class="smoke__hint smoke__hint--spaced">stroke vs fill（Lucide 非正式 filled 集）</p>
      <div class="smoke__row smoke__row--wrap smoke__icon-row">
        <h-icon :icon="Star" size="lg" aria-label="描边星标" />
        <h-icon :icon="Star" size="lg" variant="fill" color="var(--h-color-primary)" aria-label="填充星标" />
        <h-icon :icon="Heart" size="lg" />
        <h-icon :icon="Heart" size="lg" variant="fill" color="var(--h-color-danger)" />
        <h-icon :icon="Play" size="lg" />
        <h-icon :icon="Play" size="lg" variant="fill" color="var(--h-color-primary)" />
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="floating-bubble-heading">
      <h2 id="floating-bubble-heading" class="smoke__section-title">HFloatingBubble</h2>
      <p class="smoke__hint">默认 y 轴拖拽（右下角气泡）：{{ floatingBubbleClicks }} 次点击</p>
      <div class="smoke__row smoke__row--wrap">
        <h-button size="sm" variant="outline" @click="floatingBubbleOffset = { x: 160, y: 180 }">设置受控位置</h-button>
        <h-button size="sm" variant="ghost" @click="floatingBubbleOffset = null">恢复默认</h-button>
      </div>
      <h-floating-bubble
        v-model:offset="floatingBubbleOffset"
        :icon="MessageCircle"
        ariaLabel="打开消息"
        @click="onFloatingBubbleClick"
      />
      <h-floating-bubble
        :offset="{ x: 120, y: 240 }"
        axis="xy"
        magnetic="x"
        :icon="Star"
        ariaLabel="自由拖拽并吸附"
        @offset-change="onFloatingBubbleOffsetChange"
      />
      <h-floating-bubble
        :offset="{ x: 240, y: 360 }"
        axis="lock"
        :teleport="false"
        ariaLabel="锁定的快捷操作"
      >
        <span aria-hidden="true">+</span>
      </h-floating-bubble>
      <p class="smoke__ping">最近位置变化：{{ floatingBubbleLastOffset }}</p>
    </section>

    <section class="smoke__section" aria-labelledby="toast-heading">
      <h2 id="toast-heading" class="smoke__section-title">HToast</h2>
      <div class="smoke__row smoke__row--wrap">
        <h-button @click="toastSuccess = true">成功（居中）</h-button>
        <h-button variant="outline" @click="toastTop = true">默认（顶部）</h-button>
        <h-button variant="secondary" @click="toastBottom = true">底部</h-button>
        <h-button variant="danger-soft" @click="toastDanger = true">错误</h-button>
        <h-button variant="ghost" @click="toastTextOnly = true">纯文字（icon=false）</h-button>
        <h-button variant="ghost" @click="toastPersist = true">不自动关闭</h-button>
        <h-button size="sm" variant="outline" @click="toastPersist = false">隐藏持续提示</h-button>
      </div>

      <p class="smoke__hint">
        深色 HUD 风格：默认屏幕居中；内置语义图标（✓ / ! / ✕）；#icon 插槽可覆盖；icon=false 纯文字。
        下方容器带 <code>transform: translateZ(0)</code>（会成为 fixed 的包含块）。
        默认 teleport 到 body，toast 仍固定在视口；<code>:teleport="false"</code> 则被容器劫持而错位。
      </p>
      <div class="smoke__row smoke__row--wrap" style="transform: translateZ(0); contain: layout; border: 1px dashed var(--h-color-border-subtle); padding: 12px; border-radius: 8px;">
        <h-button variant="outline" @click="toastTeleport = true">默认 teleport（视口居中）</h-button>
        <h-button variant="ghost" @click="toastInPlace = true">teleport=false（就地/错位）</h-button>

        <h-toast v-model="toastTeleport" variant="success">
          已 teleport 到 body，定位不受祖先影响
        </h-toast>

        <h-toast v-model="toastInPlace" variant="warning" :teleport="false">
          teleport=false：相对 transform 祖先定位
        </h-toast>
      </div>
      <p v-if="toastCloseCount > 0" class="smoke__ping">
        toast close 次数：{{ toastCloseCount }}
      </p>

      <h-toast v-model="toastSuccess" variant="success" @close="onToastClose">
        <template #icon>
          <h-icon :icon="Star" size="sm" />
        </template>
        已保存更改（#icon 插槽覆盖内置 ✓）
      </h-toast>

      <h-toast v-model="toastTop" position="top" @close="onToastClose">
        顶部提示，3 秒后自动关闭
      </h-toast>

      <h-toast v-model="toastBottom" position="bottom" variant="success" @close="onToastClose">
        底部提示（内置 ✓）
      </h-toast>

      <h-toast v-model="toastDanger" variant="danger" @close="onToastClose">
        操作失败，请重试
      </h-toast>

      <h-toast v-model="toastTextOnly" :icon="false" @close="onToastClose">
        纯文字 toast（无图标）
      </h-toast>

      <h-toast v-model="toastPersist" variant="warning" :duration="0">
        持续提示，由宿主在外部控制隐藏
      </h-toast>
    </section>

    <section class="smoke__section" aria-labelledby="pagination-heading">
      <h2 id="pagination-heading" class="smoke__section-title">HPagination</h2>
      <div class="smoke__field-stack">
        <div>
          <p class="smoke__hint">simple 模式：当前 {{ paginationCurrent }}，每页 {{ paginationPageSize }} 条</p>
          <h-pagination
            v-model:current="paginationCurrent"
            v-model:page-size="paginationPageSize"
            :total="256"
            simple
            show-total
          />
        </div>
        <div>
          <p class="smoke__hint">完整模式</p>
          <h-pagination
            v-model:current="paginationCurrent"
            :total="256"
          />
        </div>
        <div>
          <p class="smoke__hint">showTotal + showSizeChanger</p>
          <h-pagination
            v-model:current="paginationCurrent"
            v-model:page-size="paginationPageSize"
            :total="256"
            show-total
            show-size-changer
          />
        </div>
        <div>
          <p class="smoke__hint">disabled</p>
          <h-pagination
            v-model:current="paginationCurrent"
            :total="256"
            disabled
          />
        </div>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="tooltip-heading">
      <h2 id="tooltip-heading" class="smoke__section-title">HTooltip</h2>
      <p class="smoke__hint">hover / focus / tap 触发；接近视口边缘自动翻转。</p>
      <div class="smoke__row smoke__row--wrap">
        <h-tooltip content="默认 top 方向">
          <h-button variant="outline">top</h-button>
        </h-tooltip>
        <h-tooltip content="bottom 方向" placement="bottom">
          <h-button variant="outline">bottom</h-button>
        </h-tooltip>
        <h-tooltip content="left 方向" placement="left">
          <h-button variant="outline">left</h-button>
        </h-tooltip>
        <h-tooltip content="right 方向" placement="right">
          <h-button variant="outline">right</h-button>
        </h-tooltip>
        <h-tooltip content="带箭头" placement="top" show-arrow>
          <h-button variant="outline">showArrow</h-button>
        </h-tooltip>
        <h-tooltip content="primary 色" color="primary" placement="top">
          <h-button variant="outline">primary</h-button>
        </h-tooltip>
        <h-tooltip content="success 色" color="success" placement="top" show-arrow>
          <h-button variant="outline">success</h-button>
        </h-tooltip>
        <h-tooltip content="禁用态不会弹出" :disabled="true">
          <h-button variant="outline">disabled</h-button>
        </h-tooltip>
        <h-tooltip placement="top" show-arrow>
          <h-button variant="outline">slot content</h-button>
          <template #content>
            <strong>支持 slot</strong> · 可放富文本
          </template>
        </h-tooltip>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="scrollbar-heading">
      <h2 id="scrollbar-heading" class="smoke__section-title">HScrollbar</h2>
      <p class="smoke__hint">CSS-only 细窄滚动条；thin / default / none 三种模式，可调方向、宽度、主题色。移动端自动回退原生。</p>

      <p class="smoke__lead">mode：thin（默认）· default · none</p>
      <div class="smoke__row smoke__row--wrap">
        <h-scrollbar style="height: 100px; width: 14rem">
          <p v-for="n in 10" class="smoke__scrollbar-item">{{ n }} — thin 细窄主题 thumb</p>
        </h-scrollbar>
        <h-scrollbar mode="default" style="height: 100px; width: 14rem">
          <p v-for="n in 10" class="smoke__scrollbar-item">{{ n }} — default 原生</p>
        </h-scrollbar>
        <h-scrollbar mode="none" style="height: 100px; width: 14rem">
          <p v-for="n in 10" class="smoke__scrollbar-item">{{ n }} — none 隐藏 thumb</p>
        </h-scrollbar>
      </div>

      <p class="smoke__lead">axis：y（纵向）· x（横向）· both（双向）</p>
      <div class="smoke__row smoke__row--wrap">
        <h-scrollbar style="height: 100px; width: 14rem">
          <p v-for="n in 8" class="smoke__scrollbar-item">{{ n }} — axis y</p>
        </h-scrollbar>
        <h-scrollbar axis="x" style="width: 14rem; white-space: nowrap">
          <span v-for="n in 15" class="smoke__scrollbar-item" style="display: inline-block; padding: 4px">列{{ n }}</span>
        </h-scrollbar>
        <h-scrollbar axis="both" style="height: 100px; width: 14rem">
          <p v-for="n in 8" class="smoke__scrollbar-item smoke__scrollbar-item--wide">{{ n }} — both</p>
        </h-scrollbar>
      </div>

      <p class="smoke__lead">size：sm 4px · md 6px · lg 8px</p>
      <div class="smoke__row smoke__row--wrap">
        <h-scrollbar size="sm" style="height: 100px; width: 14rem">
          <p v-for="n in 8" class="smoke__scrollbar-item">{{ n }} — sm 4px</p>
        </h-scrollbar>
        <h-scrollbar size="md" style="height: 100px; width: 14rem">
          <p v-for="n in 8" class="smoke__scrollbar-item">{{ n }} — md 6px</p>
        </h-scrollbar>
        <h-scrollbar size="lg" style="height: 100px; width: 14rem">
          <p v-for="n in 8" class="smoke__scrollbar-item">{{ n }} — lg 8px</p>
        </h-scrollbar>
      </div>

      <p class="smoke__lead">color：default · primary · success · warning · danger</p>
      <div class="smoke__row smoke__row--wrap">
        <h-scrollbar style="height: 100px; width: 14rem">
          <p v-for="n in 8" class="smoke__scrollbar-item">{{ n }} — default</p>
        </h-scrollbar>
        <h-scrollbar color="primary" style="height: 100px; width: 14rem">
          <p v-for="n in 8" class="smoke__scrollbar-item">{{ n }} — primary</p>
        </h-scrollbar>
        <h-scrollbar color="success" style="height: 100px; width: 14rem">
          <p v-for="n in 8" class="smoke__scrollbar-item">{{ n }} — success</p>
        </h-scrollbar>
        <h-scrollbar color="warning" style="height: 100px; width: 14rem">
          <p v-for="n in 8" class="smoke__scrollbar-item">{{ n }} — warning</p>
        </h-scrollbar>
        <h-scrollbar color="danger" style="height: 100px; width: 14rem">
          <p v-for="n in 8" class="smoke__scrollbar-item">{{ n }} — danger</p>
        </h-scrollbar>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="heatmap-heading">
      <h2 id="heatmap-heading" class="smoke__section-title">HHeatmap</h2>
      <p class="smoke__hint">GitHub 贡献图风格；hover 单元格看原生 title。</p>
      <div class="smoke__row smoke__row--wrap">
        <h-button size="sm" variant="outline" @click="heatmapLoading = !heatmapLoading">切换 loading（{{ heatmapLoading }}）</h-button>
      </div>
      <h-heatmap :data="heatmapData" :loading="heatmapLoading" />
      <p class="smoke__lead">自定义色阶（GitHub 绿）+ 周一起始：</p>
      <h-heatmap :data="heatmapData" :colors="heatmapColors" :first-day-of-week="1" />
    </section>

    <section class="smoke__section" aria-labelledby="sidebar-heading">
      <h2 id="sidebar-heading" class="smoke__section-title">HSidebar</h2>
      <p class="smoke__hint">当前 key：{{ sidebarActive }}；{{ sidebarCollapsed ? '已折叠' : '展开' }}</p>
      <div class="smoke__row smoke__row--wrap">
        <h-button size="sm" variant="outline" @click="sidebarCollapsed = !sidebarCollapsed">外部切换折叠</h-button>
      </div>
      <div class="smoke__sidebar-frame">
        <h-sidebar
          v-model="sidebarActive"
          v-model:collapsed="sidebarCollapsed"
          :items="sidebarItems"
        >
          <template #header>
            <strong class="smoke__sidebar-brand">happier</strong>
          </template>
          <template #footer>
            <h-button is-icon-only aria-label="账户" variant="ghost">
              <h-icon :icon="User" size="md" aria-hidden="true" />
            </h-button>
          </template>
        </h-sidebar>
        <div class="smoke__sidebar-body">
          <p class="smoke__lead">主内容区：侧栏为常驻列，不遮挡此区域。</p>
        </div>
      </div>
    </section>

    <section class="smoke__section" aria-labelledby="tabbar-heading">
      <h2 id="tabbar-heading" class="smoke__section-title">HTabBar</h2>
      <p class="smoke__hint">当前 key：{{ activeTab }}</p>
      <p class="smoke__lead">
        底栏固定在视口底部（见页面最下方）。点击切换 <code>v-model</code>。
      </p>
    </section>

    <h-tab-bar v-model="activeTab" :items="tabItems" />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm } from '@tanstack/vue-form'
import { Bell, Heart, Home, Languages, Library, MessageCircle, Play, Search, Star, User, X } from '@lucide/vue'
import { HBadge, HBottomSheet, HButton, HCard, HCell, HCellGroup, HCheckbox, HDialog, HEmpty, HFloatingBubble, HHeatmap, HIcon, HImage, HInput, HLoading, HNavBar, HPagination, HPopup, HProgress, HRange, HScrollbar, HSelect, HSidebar, HSwitch, HTabBar, HTable, HTextarea, HToast, HTag, HTooltip } from 'happier-ui'
import type { HSelectOption, HSidebarItem, HTabBarItem, HTableColumn } from 'happier-ui'

const buttonClicks = ref(0)

type ThemeMode = 'system' | 'light' | 'dark'
const theme = ref<ThemeMode>('system')
function setTheme(mode: ThemeMode) {
  theme.value = mode
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  if (mode !== 'system') root.classList.add(mode)
}
const iconButtonClicks = ref(0)
const switchOn = ref(true)
const switchSm = ref(false)
const switchMd = ref(true)
const switchLg = ref(false)
const rangeValue = ref(40)
const rangeStep = ref(50)
const rangeCustom = ref(0)
const rangeSm = ref(30)
const rangeMd = ref(50)
const rangeLg = ref(70)
const progressValue = ref(40)
const loadingGlobal = ref(false)
const loadingGlobalLabel = ref(false)
let loadingGlobalTimer: ReturnType<typeof setTimeout> | null = null
const openLoadingGlobal = (withLabel: boolean) => {
  if (loadingGlobalTimer !== null) {
    clearTimeout(loadingGlobalTimer)
    loadingGlobalTimer = null
  }
  loadingGlobal.value = !withLabel
  loadingGlobalLabel.value = withLabel
  loadingGlobalTimer = setTimeout(() => {
    loadingGlobal.value = false
    loadingGlobalLabel.value = false
    loadingGlobalTimer = null
  }, 2000)
}
const sheetOpen = ref(false)
const sheetNoOverlayClose = ref(false)
const sheetLimited = ref(false)
const sheetCloseCount = ref(0)
const dialogOpen = ref(false)
const dialogNoOverlayClose = ref(false)
const dialogCloseCount = ref(0)
const popupBottom = ref(false)
const popupCenter = ref(false)
const popupLeft = ref(false)
const popupRight = ref(false)
const popupRelative = ref(false)
const popupFullscreen = ref(false)
const popupRelTrigger = ref(null)
const popupCloseCount = ref(0)
const popupKeepAlive = ref(false)
const popupKeepAliveCount = ref(0)
const popupSwipeDisabled = ref(false)
const toastSuccess = ref(false)
const toastTop = ref(false)
const toastBottom = ref(false)
const toastDanger = ref(false)
const toastTextOnly = ref(false)
const toastPersist = ref(false)
const toastTeleport = ref(false)
const toastInPlace = ref(false)
const toastCloseCount = ref(0)
const simpleName = ref('')
const tanstackSubmitMsg = ref('')
const selectValue = ref('')
const selectInside = ref('')
const selectLabel = ref('')
const selectOptions: HSelectOption[] = [
  { value: 'apple', label: '苹果', description: 'Apple - 水果之王' },
  { value: 'banana', label: '香蕉', description: 'Banana' },
  { value: 'cherry', label: '樱桃', disabled: true, description: 'Cherry - 缺货中' },
  { value: 'durian', label: '榴莲', description: 'Durian - 气味独特' },
]
const selectLongOptions: HSelectOption[] = Array.from({ length: 50 }, (_, i) => ({
  value: `tz-${i}`,
  label: `Timezone Option ${i + 1}`,
  description: i % 2 === 0 ? 'Even offset' : 'Odd offset',
  disabled: i === 5 || i === 8,
}))
const tableSort = ref<{ key: string; order: 'asc' | 'desc' } | null>(null)
/** 演示用具体行类型：普通 interface（无索引签），验证 HTable 泛型推断无需 as 断言 */
interface DemoRequestLog {
  id: string
  name: string
  status: number
  method: string
  time: string
}
const tableData = ref<DemoRequestLog[]>([
  { id: '1', name: 'GET /api/users', status: 200, method: 'GET', time: '12ms' },
  { id: '2', name: 'POST /api/orders', status: 201, method: 'POST', time: '45ms' },
  { id: '3', name: 'GET /api/products', status: 200, method: 'GET', time: '8ms' },
  { id: '4', name: 'PUT /api/users/1', status: 500, method: 'PUT', time: '230ms' },
  { id: '5', name: 'GET /api/not-found', status: 404, method: 'GET', time: '3ms' },
])
const tableLongData: DemoRequestLog[] = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  name: `GET /api/items/${i + 1}`,
  status: [200, 201, 404, 500, 200][i % 5]!,
  method: ['GET', 'POST', 'GET', 'PUT', 'GET'][i % 5]!,
  time: `${[12, 45, 8, 230, 3][i % 5]}ms`,
}))
const tableColumns: HTableColumn<DemoRequestLog>[] = [
  { key: 'name', title: '路径', sortable: true },
  { key: 'method', title: '方法', width: 80, align: 'center' },
  { key: 'status', title: '状态码', width: 80, align: 'right', sortable: true },
  { key: 'time', title: '耗时', width: 80, align: 'right', sortable: true },
]
const textareaValue = ref('')
const textareaSm = ref('')
const textareaLg = ref('')
const textareaAuto = ref('')
const textareaCount = ref('')
const textareaMono = ref('{"_type":"newapi_channel_conn","key":"sk-abc123","url":"https://api.example.com"}')
const checkOn = ref(false)
const emptyActionClicks = ref(0)
const activeTab = ref('home')
const navAction = ref('尚未点击')
const cellNotifications = ref(true)
const floatingBubbleOffset = ref<{ x: number, y: number } | null>(null)
const floatingBubbleClicks = ref(0)
const floatingBubbleLastOffset = ref('默认')

const cellAction = ref('')

const tabItems: HTabBarItem[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'search', label: '搜索', icon: Search },
  { key: 'library', label: '曲库', icon: Library },
  { key: 'me', label: '我的', icon: User },
]
const sidebarActive = ref('home')
const sidebarCollapsed = ref(false)
const sidebarItems: HSidebarItem[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'search', label: '搜索', icon: Search },
  { key: 'library', label: '曲库', icon: Library },
  { key: 'settings', label: '设置', icon: Bell, disabled: true },
]
const heatmapLoading = ref(false)
const heatmapColors = ['#9be9a8', '#40c463', '#30a14e', '#216e39']
const heatmapData = (() => {
  const out: { timestamp: number, value: number }[] = []
  const today = Date.now()
  const day = 24 * 60 * 60 * 1000
  let s = 7
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < 365; i++) {
    const r = rand()
    out.push({ timestamp: today - i * day, value: r < 0.4 ? 0 : Math.ceil(r * 12) })
  }
  return out
})()

const checkSm = ref(false)
const checkMd = ref(true)
const checkLg = ref(false)
const paginationCurrent = ref(1)
const paginationPageSize = ref(20)
const checkAriaOnly = ref(false)
const itemA = ref(true)
const itemB = ref(false)
const itemC = ref(false)

const selectAll = computed(() => itemA.value && itemB.value && itemC.value)
const selectIndeterminate = computed(() => {
  const n = [itemA.value, itemB.value, itemC.value].filter(Boolean).length
  return n > 0 && n < 3
})

const onSelectAll = (value: boolean) => {
  itemA.value = value
  itemB.value = value
  itemC.value = value
}

type DemoForm = {
  email: string
  password: string
}

const form = useForm({
  defaultValues: {
    email: '',
    password: '',
  } satisfies DemoForm,
  onSubmit: async ({ value }) => {
    tanstackSubmitMsg.value = `已提交：${value.email} / ${'*'.repeat(value.password.length || 0)}`
  },
})

const fieldError = (errors: unknown[]) => {
  const first = errors[0]
  if (first == null) return undefined
  if (typeof first === 'string') return first
  if (typeof first === 'object' && first !== null && 'message' in first) {
    return String((first as { message: unknown }).message)
  }
  return String(first)
}

const onTanstackSubmit = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  void form.handleSubmit()
}

const buttonVariants = [
  'primary',
  'secondary',
  'tertiary',
  'outline',
  'ghost',
  'danger',
  'danger-soft',
] as const
const buttonSizes = ['sm', 'md', 'lg'] as const
const cardVariants = ['outlined', 'filled', 'flat'] as const
const cardPaddings = ['none', 'sm', 'md', 'lg'] as const
const cardRadii = ['sm', 'md'] as const

const onButtonClick = () => {
  buttonClicks.value += 1
}

const onIconButtonClick = () => {
  iconButtonClicks.value += 1
}

const onCellClick = (title: string) => {
  cellAction.value = title
}

const onNavLeftClick = (event: MouseEvent) => {
  navAction.value = `左侧（${event.type}）`
}

const onNavRightClick = (event: MouseEvent) => {
  navAction.value = `右侧（${event.type}）`
}

const onFloatingBubbleClick = () => {
  floatingBubbleClicks.value += 1
}

const onFloatingBubbleOffsetChange = (offset: { x: number, y: number }) => {
  floatingBubbleLastOffset.value = `x: ${Math.round(offset.x)}, y: ${Math.round(offset.y)}`
}


const openSheetNoOverlayClose = () => {
  sheetNoOverlayClose.value = true
}

const onSheetClose = () => {
  sheetCloseCount.value += 1
}

const onDialogClose = () => {
  dialogCloseCount.value += 1
}

const onToastClose = () => {
  toastCloseCount.value += 1
}
</script>

<style scoped>
.smoke {
  max-width: 36rem;
  margin: 0 auto;
  padding: calc(
    var(--h-nav-bar-height, 56px) + var(--h-space-xl, 24px) + env(safe-area-inset-top, 0px)
  ) var(--h-space-lg, 16px) 0;
  padding-bottom: calc(
    var(--h-tab-bar-height, 64px) + var(--h-space-xl, 24px) + env(safe-area-inset-bottom, 0px)
  );
}

.smoke__header {
  margin-bottom: var(--h-space-xl, 24px);
}

.smoke__nav-frame {
  overflow: hidden;
  border: 1px solid var(--h-color-border-subtle, #e0e0e0);
  border-radius: var(--h-radius-control, 12px);
}

.smoke__nav-action {
  min-height: var(--h-touch-target, 48px);
  margin: 0;
  padding: 0 var(--h-space-sm, 8px);
  border: 0;
  border-radius: var(--h-radius-control, 12px);
  background: transparent;
  color: var(--h-color-primary, #006fee);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.smoke__nav-action:focus-visible {
  outline: 2px solid var(--h-color-focus-ring, #006fee);
  outline-offset: -2px;
}

.smoke__nav-title {
  margin: 0;
  overflow: hidden;
  font-size: var(--h-font-title, 15px);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.smoke__title {
  margin: 0 0 var(--h-space-sm, 8px);
  font-size: 1.25rem;
  color: var(--h-color-primary, #006fee);
}

.smoke__lead {
  margin: 0 0 var(--h-space-md, 12px);
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-ink-muted, #666);
  text-wrap: pretty;
}

.smoke__swatch {
  width: 100%;
  height: 8px;
  border-radius: var(--h-radius-pill, 999px);
  background: var(--h-color-primary, #006fee);
}

.smoke__section {
  margin-bottom: var(--h-space-xl, 24px);
}

.smoke__section-title {
  margin: 0 0 var(--h-space-sm, 8px);
  font-size: var(--h-font-label, 12px);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--h-color-ink-muted, #666);
}

.smoke__hint {
  margin: 0 0 var(--h-space-sm, 8px);
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-ink-muted, #666);
}

.smoke__ping {
  margin: var(--h-space-sm, 8px) 0 0;
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-primary, #006fee);
}

.smoke__sidebar-frame {
  display: flex;
  height: 320px;
  overflow: hidden;
  border: 1px solid var(--h-color-border-subtle, #e0e0e0);
  border-radius: var(--h-radius-md, 12px);
}

.smoke__sidebar-brand {
  font-size: var(--h-font-title, 15px);
  color: var(--h-color-ink, #000);
}

.smoke__sidebar-body {
  flex: 1 1 auto;
  min-width: 0;
  padding: var(--h-space-lg, 16px);
}

.smoke__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--h-space-sm, 8px);
}

.smoke__row--wrap {
  margin-bottom: var(--h-space-md, 12px);
}

.smoke__row--tight {
  margin-top: var(--h-space-sm, 8px);
}

.smoke__button-block {
  margin-bottom: var(--h-space-sm, 8px);
}

.smoke__switch-row {
  margin-bottom: var(--h-space-md, 12px);
}

.smoke__switch-item {
  display: inline-flex;
  align-items: center;
  gap: var(--h-space-sm, 8px);
}

.smoke__hint--inline {
  margin: 0;
}

.smoke__sheet-copy {
  margin: 0 0 var(--h-space-md, 12px);
  font-size: var(--h-font-body-sm, 13px);
  color: var(--h-color-ink-muted, #666);
  text-wrap: pretty;
}

.smoke__field-stack {
  display: flex;
  flex-direction: column;
  gap: var(--h-space-md, 12px);
  margin-bottom: var(--h-space-md, 12px);
}

.smoke__hint--spaced {
  margin-top: var(--h-space-md, 12px);
}

.smoke__field-stack--indent {
  margin-left: var(--h-space-lg, 16px);
  margin-bottom: 0;
}

.smoke__field-stack--compact {
  gap: var(--h-space-sm, 8px);
  margin-bottom: 0;
}

.smoke__empty-frame {
  overflow: hidden;
  border: 1px solid var(--h-color-border-subtle, #e0e0e0);
  border-radius: var(--h-radius-control, 12px);
  background: var(--h-color-surface, #ffffff);
}

.smoke__empty-frame .h-empty {
  min-height: 22rem;
}

.smoke__empty-frame--short .h-empty {
  min-height: 12rem;
}

.smoke__card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: var(--h-space-md, 12px);
}

.smoke__card-title {
  display: block;
  font-size: var(--h-font-title, 15px);
}

.smoke__card-copy {
  margin: var(--h-space-sm, 8px) 0 0;
  color: var(--h-color-ink-muted, #666);
  font-size: var(--h-font-body-sm, 13px);
}

.smoke__image-fallback {
  font-size: 1.5rem;
  line-height: 1;
}

.smoke__icon-row {
  align-items: center;
  gap: var(--h-space-md, 12px);
  color: var(--h-color-ink, #000000);
}

.smoke__scrollbar-item {
  margin: 0;
  padding: var(--h-space-xs, 4px) var(--h-space-sm, 8px);
  border-bottom: 1px solid var(--h-color-border-subtle, #ececee);
  font-size: var(--h-font-body-sm, 13px);
}

.smoke__scrollbar-item--wide {
  width: 220%;
  white-space: nowrap;
}
</style>
