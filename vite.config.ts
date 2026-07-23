import { copyFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      insertTypesEntry: true,
      tsconfigPath: path.resolve(rootDir, 'tsconfig.lib.json'),
    }),
    {
      name: 'copy-happier-ui-tokens',
      closeBundle() {
        copyFileSync(
          path.resolve(rootDir, 'src/tokens.css'),
          path.resolve(rootDir, 'dist/tokens.css'),
        )
      },
    },
  ],
  build: {
    lib: {
      entry: path.resolve(rootDir, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue', '@lucide/vue'],
    },
  },
})
