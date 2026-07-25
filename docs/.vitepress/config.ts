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
            { text: 'Button', link: '/components/button' },
            { text: 'Icon', link: '/components/icon' },
            { text: 'Card', link: '/components/card' },
            { text: 'Cell', link: '/components/cell' },
            { text: 'Empty', link: '/components/empty' },
            { text: 'Image', link: '/components/image' },
            { text: 'Input', link: '/components/input' },
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Switch', link: '/components/switch' },
            { text: 'Range', link: '/components/range' },
            { text: 'Progress', link: '/components/progress' },
            { text: 'NavBar', link: '/components/nav-bar' },
            { text: 'TabBar', link: '/components/tab-bar' },
            { text: 'Dialog', link: '/components/dialog' },
            { text: 'BottomSheet', link: '/components/bottom-sheet' },
            { text: 'Toast', link: '/components/toast' },
            { text: 'FloatingBubble', link: '/components/floating-bubble' },
            { text: 'Sidebar', link: '/components/sidebar' },
            { text: 'Heatmap', link: '/components/heatmap' },
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
