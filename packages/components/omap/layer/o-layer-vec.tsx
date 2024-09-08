import Map from 'ol/Map'
import { defineComponent, inject, onUnmounted, type PropType, type Ref } from 'vue'
import { clipLayer, createOlTile, takeOlParams } from './utils'
import { useGetMap } from '@vue-omap/hooks'
import type { OlStyle } from 'packages/typings/utils'
export default defineComponent({
  props: {
    tk: { type: String },
    clipCoordinates: { type: Array as PropType<number[][][]> },
    clipStyle: Object as PropType<OlStyle>
  },
  name: 'OLayerVec',
  setup(props) {
    const param = takeOlParams()
    const tkMap = inject<Ref<Map>>('tk')
    let vecLayer: any = undefined
    let cvaLayer: any = undefined
    const map = useGetMap(() => {
      const tk = props.tk ?? tkMap
      const layers = map?.value.getLayers()
      const arr = layers?.getArray()
      vecLayer = arr?.find((item: any) => item?.sourceChangeKey_?.target?.layer_ === 'vec')
      cvaLayer = arr?.find((item: any) => item?.sourceChangeKey_?.target?.layer_ === 'cva')
      if (!vecLayer) {
        vecLayer = createOlTile(
          `http://t${Math.round(Math.random() * 7)}.tianditu.gov.cn/vec_c/wmts?tk=${tk}`,
          'vec',
          param
        )
        cvaLayer = createOlTile(
          `http://t${Math.round(Math.random() * 7)}.tianditu.gov.cn/cva_c/wmts?tk=${tk}`,
          'cva',
          param
        )
        layers?.insertAt(0, vecLayer)
        layers?.insertAt(1, cvaLayer)
        layers && map?.value.setLayers(layers)
        props.clipCoordinates && clipLayer(vecLayer, props.clipCoordinates, props.clipStyle)
        props.clipCoordinates && clipLayer(cvaLayer, props.clipCoordinates, props.clipStyle)
      } else {
        vecLayer?.setVisible(true)
        cvaLayer?.setVisible(true)
      }
    })
    onUnmounted(() => {
      vecLayer?.setVisible(false)
      cvaLayer?.setVisible(false)
    })
  }
})
