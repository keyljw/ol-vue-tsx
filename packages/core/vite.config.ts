import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer'
import dts from 'vite-plugin-dts'
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    bundleAnalyzer({ port: 8956 }), // 方法自动导入
    dts({
      tsconfigPath: fileURLToPath(new URL('../../tsconfig.build.json', import.meta.url)),
      outDir: 'dist/types'
    })
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: fileURLToPath(new URL('./index.ts', import.meta.url)),
      name: 'VueOmap',
      fileName: (format) => `omap.${format}.js`
    },
    rollupOptions: {
      output: {
        globals: { vue: 'Vue', ol: 'Ol', jsrsasign: 'Jsrsasign' },
        assetFileNames(chunkInfo) {
          if (chunkInfo.name === 'style.css') return 'index.css'
          return chunkInfo.name as string
        }
      },
      external: [/^ol\//, 'vue', 'jsrsasign']
    }
  }
})
