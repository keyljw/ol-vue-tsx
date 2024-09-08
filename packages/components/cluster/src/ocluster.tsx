import { defineComponent, toRefs, type PropType, watch } from 'vue'
import { Cluster } from 'ol/source'
import { Point } from 'ol/geom'
import type { OlStyle } from '../../../typings/utils'
import { takeStyle } from '../../../utils/style'
import { Feature } from 'ol'
import { createEmpty, extend, getHeight, getWidth } from 'ol/extent'
import { useIntMap } from '@vue-omap/hooks'
import { useEventMap } from '@vue-omap/hooks'
import { isFunction } from '@vue-omap/utils'

// interface optionPorps {
//   text?: string
//   id?: string
//   distance?: number
//   minDistance?: number
//   allZoom?: number
// }
const optionProps = {
  id: 'id', //数据id
  distance: 20, // 缩放等级
  minDistance: 0, // 两点距离
  allZoom: 0 // 什么层级后展示全部
}

export default defineComponent({
  name: 'OCluster',
  props: {
    clusterStyle: { type: Object as PropType<OlStyle>, required: true }, // 外层的style
    olStyle: { type: Object as PropType<OlStyle>, required: true }, // 每个点位的style
    data: { type: Object as any, required: true }, // 数据原
    props: {
      type: Object,
      default: () => optionProps
    }, // data数据的key
    fit: { type: Object as any, default: () => ({ duration: 400, padding: [0, 100, 0, 100] }) } // 缩放的默认配置
  },

  setup(props, { expose, emit }) {
    //  初始化获取map 方法
    const { fit } = toRefs(props)
    const { map, onMapMounted, createLayer } = useIntMap()
    const { layer, source } = createLayer(false)
    const olStyle = props.olStyle ? takeStyle(props.olStyle) : undefined

    const clusterStyle = props.olStyle ? takeStyle(props.clusterStyle) : undefined

    const { distance, minDistance, id, allZoom } = { ...optionProps, ...(props.props ?? {}) }
    const cluster = new Cluster({
      source: source.value,
      distance,
      minDistance
    })
    layer.value.setSource(cluster)

    layer.value.setStyle((cluster: any) => {
      const features = cluster.get('features')
      if (features.length === 1) {
        const feature = features[0]
        return isFunction(olStyle) ? olStyle(feature) : olStyle
        // const feature = features[0]
        // if (feature.getStyle()) {
        //   return feature.getStyle()
        // }
        // const text = feature.get('text')
        // let newStyle: any = oldStyle
        // if (text) {
        //   newStyle = takeStyle(olStyle.value)
        //   newStyle?.getText().setText(text)
        // }
      }
      return isFunction(clusterStyle) ? clusterStyle(features) : clusterStyle

      // const newClusterStyle = takeStyle(clusterStyle.value)
      // newClusterStyle?.getText().setText(clusterStyle.value?.text?.text ?? features.length + '')
      // return newClusterStyle
    })

    onMapMounted(() => {
      createPoint()
    })
    // 监听数据变化
    watch(
      () => props.data,
      () => {
        createPoint()
      },
      { deep: false }
    )
    const createPoint = () => {
      const features: any = []
      source.value.clear()
      for (let index = 0; index < props.data.length; index++) {
        const element = props.data[index]
        const point = new Feature({
          geometry: new Point(element.position)
          // style: takeStyle(olStyle.value)
        })
        point?.set('data', element)
        element?.[id] && point?.setId(element?.[id])
        features.push(point)
      }
      source.value.addFeatures(features)
    }

    // 聚合点击效果处理函数
    const clusterClickHandle = () => {
      let isCheck = false
      return async function name({ event, type }: any) {
        const features = await layer.value.getFeatures(event.pixel)
        const clusterMembers = features?.[0]?.get('features')
        if ((features?.length as number) > 0 && clusterMembers?.length > 1) {
          isCheck = true
          if (type === 'singleclick') {
            const extent = createEmpty()
            clusterMembers.forEach((feature: any) =>
              extend(extent, feature.getGeometry().getExtent())
            )
            const view = map?.value.getView() as any
            const resolution = map?.value.getView().getResolution() as number
            if (
              view.getZoom() === view.getMaxZoom() ||
              (getWidth(extent) < resolution && getHeight(extent) < resolution)
            ) {
              return 0
            } else {
              view.fit(extent, { ...fit.value }) // padding: [0, 0, 0, 0]
            }
          }
          emit(type, { features: clusterMembers, event, layer: layer.value })
        } else if (clusterMembers?.length === 1) {
          isCheck = true
          const feature = clusterMembers[0]
          const id = feature.getId()
          const data = feature.get('data')
          emit(type, { id, data, features: clusterMembers, layer: layer.value, event })
        } else {
          if (isCheck) {
            emit(type, { event, layer: layer.value })
            isCheck = false
          }
        }
      }
    }

    useEventMap('singleclick', clusterClickHandle())
    useEventMap('pointermove', clusterClickHandle())
    useEventMap('dblclick', clusterClickHandle())
    useEventMap('moveend', () => {
      const zoom = map?.value.getView().getZoom() ?? 0 // 获取当前地图的缩放级别
      let dist = distance
      // 什么层级下展示全部
      if (allZoom && zoom >= allZoom) {
        dist = 0
      }
      cluster.setDistance(dist)
    })
    expose({ layer, source, cluster })
  }
})
