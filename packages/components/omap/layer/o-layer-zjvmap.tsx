import { defineComponent, onUnmounted, type PropType } from 'vue'
import { clipLayer, createOlTile, paramFormatter, takeOlParams, takeSignature } from './utils'
import { useGetMap } from '@vue-omap/hooks'
import type { OlStyle } from 'packages/typings/utils'
//浙江省地图
export default defineComponent({
  props: {
    ak: { type: String, required: true },
    sk: { type: String, required: true },
    clipCoordinates: { type: Array as PropType<number[][][]> },
    clipStyle: Object as PropType<OlStyle>,
    baseURL: { type: String, default: 'https://ibcdsg.zj.gov.cn:8443/' }
  },
  name: 'OLayerZjvmap',
  setup(props) {
    const param = takeOlParams()
    let imageLayer: any = undefined
    let labelLayer: any = undefined
    const map = useGetMap(async function name() {
      const { ak, sk, baseURL } = props
      const layers = map?.value.getLayers()

      const arr = layers?.getArray()
      imageLayer = arr?.find((item: any) => item?.sourceChangeKey_?.target?.layer_ === 'zjvmap')
      labelLayer = arr?.find((item: any) => item?.sourceChangeKey_?.target?.layer_ === 'zjvmap_lab')
      if (!imageLayer) {
        const signature = await takeSignature(ak, sk)
        const imageLayerURL = paramFormatter(
          baseURL +
            '/restapi/prod/IC33000020220811000009/mapserver/vmap/WMTS/1.0/zjvmap/tdt_kejiganyangshi_2017',
          { jwt: signature, 'x-bg-auth-type': 'jwt_auth' }
        )
        const labelLayerURL = paramFormatter(
          baseURL +
            '/restapi/prod/IC33000020220811000011/mapserver/label/WMTS/1.0/zjvmap/tdt_kejiganyangshi_2017',
          { jwt: signature, 'x-bg-auth-type': 'jwt_auth' }
        )

        imageLayer = createOlTile(imageLayerURL, 'zjvmap', param) // 科技图层
        labelLayer = createOlTile(labelLayerURL, 'zjvmap_lab', param)
        layers?.insertAt(0, imageLayer)
        layers?.insertAt(1, labelLayer)
        layers && map?.value.setLayers(layers)
        props.clipCoordinates && clipLayer(imageLayer, props.clipCoordinates, props.clipStyle)
        props.clipCoordinates && clipLayer(labelLayer, props.clipCoordinates, props.clipStyle)
      } else {
        imageLayer?.setVisible(true)
        labelLayer?.setVisible(true)
      }
    })
    onUnmounted(() => {
      imageLayer?.setVisible(false)
      labelLayer?.setVisible(false)
    })
  }
})
