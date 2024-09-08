import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer'
import dts from 'vite-plugin-dts'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      tsconfigPath: fileURLToPath(new URL('../../tsconfig.build.json', import.meta.url)),
      outDir: 'dist/types'
    }),
    bundleAnalyzer({ port: 8956 }) // 方法自动导入
  ],
  build: {
    outDir: 'dist/es',
    lib: {
      entry: fileURLToPath(new URL('./index.ts', import.meta.url)),
      name: 'VueOmap',
      fileName: 'index',
      formats: ['es']
      // fileName: (format) => `omap.${format}.js`
    },
    rollupOptions: {
      output: {
        assetFileNames(chunkInfo) {
          if (chunkInfo.name === 'style.css') return 'index.css'
          return chunkInfo.name as string
        }
      },
      external: [/^ol\//, 'vue', 'jsrsasign']
    }
  }
})
