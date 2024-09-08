import olayer from './src/o-layer'

import { pluginInstall } from '@vue-omap/utils'

const OLayer = pluginInstall(olayer)

export { OLayer, OLayer as default }
