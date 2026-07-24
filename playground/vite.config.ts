import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      'happier-ui/styles': path.resolve(rootDir, '../src/styles/index.css'),
      'happier-ui/styles.css': path.resolve(rootDir, '../src/styles/index.css'),
      'happier-ui/tokens.css': path.resolve(rootDir, '../src/styles/tokens.css'),
      'happier-ui': path.resolve(rootDir, '../src/index.ts'),
    },
  },
  server: {
    port: 5174,
  },
})
