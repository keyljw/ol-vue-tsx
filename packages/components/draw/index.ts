import odraw from './src/odraw'

import { pluginInstall } from '@vue-omap/utils'

const ODraw = pluginInstall(odraw)

export { ODraw, ODraw as default }
