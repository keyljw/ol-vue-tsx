import popup from './src/popup.vue'

import { pluginInstall } from '@vue-omap/utils'

const OPopup = pluginInstall(popup)

export { OPopup, OPopup as default }
