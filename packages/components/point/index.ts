import Point from './src/o-point'
import PointGroup from './src/o-point-group'

import { pluginInstall } from '@vue-omap/utils'

const OPoint = pluginInstall(Point)
const OPointGroup = pluginInstall(PointGroup)

export { OPoint, OPointGroup }
