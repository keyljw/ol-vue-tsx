import { defineComponent, toRefs, watchEffect, type PropType } from 'vue'
import { LineString, Point } from 'ol/geom'
import { Feature } from 'ol'

import { takeStyle } from '@vue-omap/utils'
import { useIntMap } from '@vue-omap/hooks'
import arrowSvg from './arrow.svg'

export const LineProps = {
  arrowAnchor: { type: Array, default: () => [0.75, 0.5] },
  coordinates: { type: Array as PropType<number[][]>, default: [] }, // 线段计划
  olStyle: Object as PropType<any>, //  矢量样式
  arrow: {
    type: [Boolean, String],
    default: () => false
  }
}

export default defineComponent({
  name: 'OLine',
  props: LineProps,
  setup(props, { expose, emit }) {
    const { coordinates, olStyle, arrow, arrowAnchor } = toRefs(props)
    const { onMapMounted, createLayer, onAll } = useIntMap()
    const { source, layer } = createLayer()
    layer.value.setStyle(() => {
      const newStyle = [takeStyle(olStyle.value)]
      if (coordinates?.value?.length >= 2 && arrow?.value) {
        const length = coordinates?.value?.length
        const start = coordinates.value[length - 2]
        const end = coordinates.value[length - 1]
        newStyle.push(arrowStyle(start, end))
      }
      return newStyle
    })
    const FeatureLine = new Feature({
      geometry: new LineString(coordinates.value)
    })
    source.value.addFeature(FeatureLine)

    // 初始化
    onMapMounted(() => onAll(emit))
    watchEffect(() => {
      //style.value && FeatureLine.setStyle(takeStyle(style.value));
      coordinates.value && FeatureLine?.getGeometry()?.setCoordinates(coordinates.value)
    })
    // 创建点位
    function arrowStyle(start: number[], end: number[]) {
      const dx = end[0] - start[0]
      const dy = end[1] - start[1]
      const rotation = Math.atan2(dy, dx)
      return takeStyle({
        geometry: new Point(end),
        icon: {
          src: arrow?.value === true ? arrowSvg : arrow?.value,
          anchor: arrowAnchor?.value,
          rotateWithView: true,
          rotation: -rotation
        }
      })
    }

    expose({ FeatureLine })
  }
})
