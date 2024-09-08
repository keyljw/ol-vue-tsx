import cluster from './src/ocluster'

import { pluginInstall } from '@vue-omap/utils'

const OCluster = pluginInstall(cluster)

export { OCluster, OCluster as default }
