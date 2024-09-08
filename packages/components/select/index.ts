import oselect from './src/oselect'
import oselectItem from './src/oselectItem'

import { pluginInstall } from '@vue-omap/utils'

const OSelect = pluginInstall(oselect)
const OSelectItem = pluginInstall(oselectItem)

export { OSelect, OSelectItem }
