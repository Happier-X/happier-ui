import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'happier-ui/tokens.css': path.resolve(rootDir, '../src/tokens.css'),
      'happier-ui': path.resolve(rootDir, '../src/index.ts'),
    },
  },
  server: {
    port: 5174,
  },
})
