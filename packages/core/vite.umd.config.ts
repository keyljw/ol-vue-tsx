import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    bundleAnalyzer({ port: 8956 }) // 方法自动导入
    // AutoImport({
    //   // 导出文件
    //   //  imports: ['vue'],
    //   eslintrc: {
    //     enabled: true // <-- this
    //   },
    //   resolvers: [ElementPlusResolver()],
    //   dts: 'types/auto-imports.d.ts'
    // }),
    // // 组件自动导入
    // Components({
    //   // // 有效扩展名
    //   // extensions: ['vue'],
    //   // // 指定组件位置，默认是src/components
    //   // dirs: ['src/components'],
    //   // 按需引入
    //   resolvers: [ElementPlusResolver()],
    //   dts: 'types/components.d.ts'
    // })
  ],
  build: {
    outDir: 'dist/umd',
    lib: {
      entry: fileURLToPath(new URL('./index.ts', import.meta.url)),
      name: 'VueOmap',
      fileName: 'index',
    //  formats: ['umd']
      // fileName: (format) => `omap.${format}.js`
    },
    rollupOptions: {
      output: {
        exports: 'named',
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
