import drive from './src/drive'

import { pluginInstall } from '@vue-omap/utils'

const ODrive = pluginInstall(drive)

export { ODrive, ODrive as default }
