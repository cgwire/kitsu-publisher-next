/* eslint-env node */

import { chrome } from '../../electron-vendors.config.json'
import { join } from 'path'
import { builtinModules } from 'module'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

const PACKAGE_ROOT = __dirname

const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '@': join(PACKAGE_ROOT, 'src') + '/'
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@import "./packages/renderer/src/styles/variables.scss";'
      }
    }
  },
  plugins: [vue(), eslintPlugin()],
  base: '',
  server: {
    fs: {
      strict: true
    }
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    emptyOutDir: true,
    brotliSize: false
  }
}

export default config
