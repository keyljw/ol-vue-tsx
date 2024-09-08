import { defineComponent, onUnmounted, toRefs, watchEffect, type PropType, watch } from 'vue'
import { Point } from 'ol/geom'
import { Feature } from 'ol'
import type { OlStyle } from '../../../typings/utils'
import { takeStyle } from '../../../utils/style'
import { useIntMap } from '@vue-omap/hooks'
import { turnNumbers } from '@vue-omap/utils'

export default defineComponent({
  props: {
    position: { type: Array as PropType<number[]>, required: true }, // 定位点
    olStyle: Object as PropType<OlStyle>, //  矢量样式
    id: [Number, String], // 适量点位的id
    data: Object // 点击返回的数据集 存在 适量里面
  },
  emits: ['singleclick', 'pointermove', 'dblclick'],
  name: 'OPoint',
  setup(props, { expose, emit }) {
    const { position, data } = toRefs(props)

    const point = new Feature({
      geometry: new Point(turnNumbers(position?.value) ?? [])
    })
    const { onMapMounted, createLayer, onAll } = useIntMap()
    const { layer: pointlayer, source } = createLayer()

    onMapMounted(() => {
      source.value?.addFeature(point)
      onAll(emit)
    })

    watchEffect(() => {
      position?.value && point?.getGeometry()?.setCoordinates(turnNumbers(position.value))
      data?.value && point?.set('data', data?.value ?? {})
      if (props.id !== undefined) point.setId(props.id)
      point.changed()
    })
    watch(
      () => props.olStyle,
      () => props.olStyle && point.setStyle(takeStyle(props.olStyle)),
      { deep: true, immediate: true }
    )
    onUnmounted(() => {
      if (point) source.value.removeFeature(point)
    })
    expose({ layer: pointlayer, point })
  }
})
