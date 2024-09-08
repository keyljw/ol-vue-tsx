import ocontrol from './src/control'

import { pluginInstall } from '@vue-omap/utils'

const OControl = pluginInstall(ocontrol)

export { OControl, OControl as default }
