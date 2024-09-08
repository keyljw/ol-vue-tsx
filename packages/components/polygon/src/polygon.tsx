import { defineComponent, toRefs, watchEffect, type PropType, watch } from 'vue'
import { Polygon } from 'ol/geom'
import { Feature } from 'ol'
import type { OlStyle } from '@vue-omap/utils'
import { takeStyle } from '@vue-omap/utils'
import { useIntMap } from '@vue-omap/hooks'

export default defineComponent({
  name: 'OPolygon',
  props: {
    coordinates: { type: Array as PropType<number[][][]>, required: true },
    olStyle: Object as PropType<OlStyle>, //  矢量样式
    id: [Number, String], //id
    data: Object // 点击返回的数据集 存在 适量里面
  },
  setup(props, { expose, emit }) {
    const { coordinates } = toRefs(props)
    const { createLayer, onAll, onMapMounted } = useIntMap()
    const polygon = new Feature({ geometry: new Polygon(coordinates.value ?? []) })

    const { source, layer } = createLayer()

    onMapMounted(() => onAll(emit, polygon))
    watchEffect(() => {
      if (props.id !== undefined) polygon.setId(props.id)
      polygon.set('data', props.data ?? {})
      coordinates.value && polygon?.getGeometry()?.setCoordinates(coordinates.value)
      polygon.changed()
    })
    watch(
      () => props.olStyle,
      () => props.olStyle && polygon.setStyle(takeStyle(props.olStyle)),
      { deep: true, immediate: true }
    )

    source.value.addFeature(polygon)
    expose({ layer })
  }
})
