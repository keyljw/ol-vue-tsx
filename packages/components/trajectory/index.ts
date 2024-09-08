import trajectory from './src/trajectory'

import { pluginInstall } from '@vue-omap/utils'

const OTrajectory = pluginInstall(trajectory)

export { OTrajectory, OTrajectory as default }
