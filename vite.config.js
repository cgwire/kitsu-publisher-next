import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/styles/variables.scss";'
      }
    }
  },
  base: path.join(__dirname, './dist/'),
})

