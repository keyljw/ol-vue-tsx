import oGeoJson from './src/geoJson'

import { pluginInstall } from '@vue-omap/utils'

const OGeoJson = pluginInstall(oGeoJson)

export { OGeoJson, OGeoJson as default }
