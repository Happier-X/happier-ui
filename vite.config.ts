import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

/**
 * 将 src/styles 合并为 dist 发布物：
 * - dist/styles.css：完整入口（tokens + theme + components）
 * - dist/tokens.css：仅变量（可选）
 *
 * 库 styles 不经 Tailwind 管道预编译 BEM（BEM 为原生 CSS + var(--h-*)），
 * 消费方用 TW4 处理 theme @theme 与业务 utility。
 */
function emitHappierUiStyles() {
  const stylesDir = path.resolve(rootDir, 'src/styles')
  const distDir = path.resolve(rootDir, 'dist')

  const resolveImports = (filePath: string, seen = new Set<string>()): string => {
    const abs = path.resolve(filePath)
    if (seen.has(abs)) return ''
    seen.add(abs)
    const dir = path.dirname(abs)
    const raw = readFileSync(abs, 'utf8')
    // 去掉块注释，避免把文档示例里的 @import "tailwindcss" 当真实导入
    const withoutBlockComments = raw.replace(/\/\*[\s\S]*?\*\//g, '')
    return withoutBlockComments.replace(
      /@import\s+["']([^"']+)["']\s*;/g,
      (match, rel: string) => {
        // 仅内联相对路径；包名导入留给宿主
        if (!rel.startsWith('.')) return match
        const target = path.resolve(dir, rel)
        return resolveImports(target, seen)
      },
    )
  }

  return {
    name: 'emit-happier-ui-styles',
    closeBundle() {
      mkdirSync(distDir, { recursive: true })
      const stylesCss = resolveImports(path.join(stylesDir, 'index.css'))
      writeFileSync(path.join(distDir, 'styles.css'), stylesCss)
      copyFileSync(
        path.join(stylesDir, 'tokens.css'),
        path.join(distDir, 'tokens.css'),
      )
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    // 库构建不处理组件 CSS（已外置到 styles）；插件保留以便本地工具链一致
    tailwindcss(),
    dts({
      entryRoot: 'src',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      insertTypesEntry: true,
      tsconfigPath: path.resolve(rootDir, 'tsconfig.lib.json'),
    }),
    emitHappierUiStyles(),
  ],
  build: {
    lib: {
      entry: path.resolve(rootDir, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', '@lucide/vue', 'dayjs'],
    },
  },
})
