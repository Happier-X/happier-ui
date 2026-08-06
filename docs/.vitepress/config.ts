import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(rootDir, '../..')
const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  title: 'happier-ui',
  description: 'Web 与移动端通用的 Vue 语义 UI：Tailwind v4 + --h-* / h- utility',
  lang: 'zh-CN',
  base: isProd ? '/happier-ui/' : '/',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#006fee' }],
  ],

  themeConfig: {
    logo: undefined,
    siteTitle: 'happier-ui',
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/button' },
      {
        text: 'GitHub',
        link: 'https://github.com/Happier-X/happier-ui',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装与 Tailwind v4', link: '/guide/installation' },
            { text: 'Token 与 utility', link: '/guide/tokens' },
            { text: '主题与覆盖', link: '/guide/theming' },
            { text: '从 0.0.1 升级', link: '/guide/migration-0.0.2' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
            { text: 'Card 卡片', link: '/components/card' },
            { text: 'Cell 单元格', link: '/components/cell' },
            { text: 'Badge 徽章', link: '/components/badge' },
            { text: 'Tag 标签', link: '/components/tag' },
            { text: 'Empty 空状态', link: '/components/empty' },
            { text: 'Image 图片', link: '/components/image' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Textarea 多行输入', link: '/components/textarea' },
            { text: 'Checkbox 复选框', link: '/components/checkbox' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Range 滑块', link: '/components/range' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'Progress 进度条', link: '/components/progress' },
            { text: 'Loading 加载', link: '/components/loading' },
            { text: 'Pagination 分页', link: '/components/pagination' },
            { text: 'NavBar 导航栏', link: '/components/nav-bar' },
            { text: 'TabBar 标签栏', link: '/components/tab-bar' },
            { text: 'Sidebar 侧边栏', link: '/components/sidebar' },
            { text: 'Dialog 对话框', link: '/components/dialog' },
            { text: 'BottomSheet 底部面板', link: '/components/bottom-sheet' },
            { text: 'Toast 轻提示', link: '/components/toast' },
            { text: 'FloatingBubble 浮动气泡', link: '/components/floating-bubble' },
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Heatmap 热力图', link: '/components/heatmap' },
            { text: 'Tooltip 工具提示', link: '/components/tooltip' },
            { text: 'Scrollbar 滚动条', link: '/components/scrollbar' },
            { text: 'Popup 弹层', link: '/components/popup' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Happier-X/happier-ui' },
    ],
    outline: {
      label: '本页目录',
      level: [2, 3],
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    search: {
      provider: 'local',
    },
    footer: {
      message: 'MIT License',
      copyright: 'Copyright © 2026 Happier',
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'happier-ui/styles': path.resolve(repoRoot, 'src/styles/index.css'),
        'happier-ui/styles.css': path.resolve(repoRoot, 'src/styles/index.css'),
        'happier-ui/tokens.css': path.resolve(repoRoot, 'src/styles/tokens.css'),
        'happier-ui': path.resolve(repoRoot, 'src/index.ts'),
      },
    },
    server: {
      fs: {
        allow: [repoRoot],
      },
    },
  },
})
