import omap from './src/o-map'
import LayerImg from './layer/o-layer-img'
import LayerVec from './layer/o-layer-vec'
import LayerZjvmap from './layer/o-layer-zjvmap'
import { pluginInstall } from '@vue-omap/utils'

const OMap = pluginInstall(omap)
const OLayerImg = pluginInstall(LayerImg)
const OLayerVec = pluginInstall(LayerVec)
const OLayerZjvmap = pluginInstall(LayerZjvmap)
export { OMap, OLayerImg, OLayerVec, OLayerZjvmap, OMap as default }
