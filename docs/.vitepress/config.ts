import { defineConfig } from 'vitepress'

import { applyPlugins } from '@ruabick/md-demo-plugins'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
import nav from './configs/nav'
import sidebar from './configs/sidebar'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import { genApiDoc } from '@ruabick/vite-plugin-gen-api-doc'

export default defineConfig({
  // lang: '',
  title: 'omap',
  description: '关于 openlayers 使用vue3 tsx 封装的组件库',
  lastUpdated: true,
  cleanUrls: true,
  base: '/ol-vue-tsx/',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    config: (md) => {
      applyPlugins(md)
    }
  },

  vite: {
    plugins: [
      vueJsx(),
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ]
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ]
      })
    ] as any,
    ssr: {
      noExternal: ['element-plus']
    },
    resolve: {
      alias: {
        '@docs': fileURLToPath(new URL('../', import.meta.url)),

        '@packages': fileURLToPath(new URL('../../packages', import.meta.url))
      }
    }
  },

  // vue: {},

  themeConfig: {
    outlineTitle: '本页目录',
    lastUpdatedText: '上次更新',
    logo: '/logo.svg',

    search: {
      provider: 'local'
      // provider: 'algolia',
      // options: {
      //   appId: '',
      //   apiKey: '',
      //   indexName: ''
      // }
    },
    // nav
    nav,
    // sidebar
    sidebar,
    editLink: {
      pattern: '',
      text: '在 GitHub 上编辑此页'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/keyljw/ol-vue-tsx'
      }
    ]
    // footer: {
    //   message: '组件库',
    //   copyright: 'Copyright '
    // }
  }
})
