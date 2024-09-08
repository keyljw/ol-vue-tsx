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
  name: 'OLayerImg',
  setup(props) {
    const param = takeOlParams()
    const tkMap = inject<Ref<Map>>('tk')
    let imgLayer: any = undefined
    let ciaLayer: any = undefined
    const map = useGetMap(() => {
      const tk = props.tk ?? tkMap
      const layers = map?.value.getLayers()
      const arr = layers?.getArray()
      imgLayer = arr?.find((item: any) => item?.sourceChangeKey_?.target?.layer_ === 'img')
      ciaLayer = arr?.find((item: any) => item?.sourceChangeKey_?.target?.layer_ === 'cia')
      if (!imgLayer) {
        imgLayer = createOlTile(
          `http://t${Math.round(Math.random() * 7)}.tianditu.gov.cn/img_c/wmts?tk=${tk}`,
          'img',
          param
        )
        ciaLayer = createOlTile(
          `http://t${Math.round(Math.random() * 7)}.tianditu.gov.cn/cia_c/wmts?tk=${tk}`,
          'cia',
          param
        )
        layers?.insertAt(0, imgLayer)
        layers?.insertAt(1, ciaLayer)
        layers && map?.value.setLayers(layers)
        props.clipCoordinates && clipLayer(imgLayer, props.clipCoordinates, props.clipStyle)
        props.clipCoordinates && clipLayer(ciaLayer, props.clipCoordinates, props.clipStyle)
      } else {
        imgLayer?.setVisible(true)
        ciaLayer?.setVisible(true)
      }
    })

    onUnmounted(() => {
      imgLayer?.setVisible(false)
      ciaLayer?.setVisible(false)
    })
  }
})
