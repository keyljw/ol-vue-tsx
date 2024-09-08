import DefaultTheme from 'vitepress/theme'
import './style.css'
// import '../../../src/styles/index.css'
import omap from 'vue-omap'
import DemoBlock from '@ruabick/vitepress-demo-block'
import 'vue-omap/dist/index.css'
import '@ruabick/vitepress-demo-block/dist/style.css'
import popup from '../../components/popup.vue'
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('demo', DemoBlock)
    app.component('popup', popup)
    app.use(omap.install, {
      tk: '6e734104b4d4a24e727f6e09e36e6e66'
    })
  }
}
