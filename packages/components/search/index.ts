import search from './src/search.vue'

import { pluginInstall } from '@vue-omap/utils'

const OSearch = pluginInstall(search)

export { OSearch, OSearch as default }
