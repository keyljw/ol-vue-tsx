import { defineComponent, onUnmounted, watch } from 'vue'
import { Point } from 'ol/geom'
import { Feature } from 'ol'
import { useIntMap } from '@vue-omap/hooks'
import { heateProps } from './heatmap-types'
import Heatmap from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
export default defineComponent({
  props: heateProps,
  name: 'OHeatmap',
  setup(props, { slots, expose }) {
    const { onMapMounted, map } = useIntMap()
    const { position, weight } = props.options
    const source = new VectorSource()
    const weightHandler = (feature: any) => {
      const data = feature.get('data')
      if (props.weightFun) {
        return props.weightFun(data)
      } else {
        const item = feature.get('data')
        const value = item[weight]
        return value ?? 1
      }
    }
    watch(props.data, () => createPoint())
    const heatmap = new Heatmap({
      ...props,
      source: source,
      weight: weightHandler
    })
    onMapMounted(() => {
      createPoint()
      map?.value?.addLayer(heatmap)
    })

    const createPoint = () => {
      const features: any = []
      source.clear()
      for (let index = 0; index < props.data.length; index++) {
        const element = props.data[index]
        const point = new Feature({
          geometry: new Point(element[position])
        })
        point?.set('data', element)
        features.push(point)
      }
      source.addFeatures(features)
    }

    onUnmounted(() => {
      heatmap && map?.value.removeLayer(heatmap)
    })

    expose({ heatmap, source })
    return () => <template>{slots?.default && slots?.default()}</template>
  }
})
