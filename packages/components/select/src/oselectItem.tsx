import { defineComponent, type PropType, onUnmounted, type ShallowRef, inject, ref } from 'vue'
import type { OlStyle } from '../../../typings/utils'
import { takeStyle } from '../../../utils/style'
import { useIntMap } from '@vue-omap/hooks'
import { Style } from 'ol/style'
import Select from 'ol/interaction/Select'
import { singleClick, pointerMove, doubleClick } from 'ol/events/condition'
import { isFunction } from '@vue-omap/utils'

const typeCondition = { singleClick, pointerMove, doubleClick }
type typeNames = 'singleClick' | 'pointerMove' | 'doubleClick'
export default defineComponent({
  name: 'OSelectItem',
  props: {
    checkStyle: { type: Object as PropType<OlStyle> | PropType<(data: any) => Style> },
    type: { type: String as PropType<typeNames>, default: 'singleClick' }
  },
  setup(props, { expose, slots, emit }) {
    //  初始化获取map 方法
    const { type } = props
    const { map, onMapMounted } = useIntMap()
    const selectSet = inject<ShallowRef<Set<any>>>('selectSet')

    const checkStyle = props.checkStyle ? takeStyle(props.checkStyle) : undefined

    const styleFun = (feature: any, resolution: number) => {
      const features = feature?.get('features')
      if (features) {
        return isFunction(checkStyle) ? checkStyle(features[0], resolution) : checkStyle
      }
      return isFunction(checkStyle) ? checkStyle(feature, resolution) : checkStyle
    }
    // const setStyle = (feature: any) => {
    //   if (typeof props.checkStyle === 'function') return props.checkStyle(feature)

    //   // 设置点位名称
    //   let text = feature?.get('text')
    //   const features = feature?.get('features')
    //   if (text || features) {
    //     if (features) text = features[0]?.get('text')
    //     const newStyle = takeStyle(props.checkStyle)
    //     newStyle?.getText().setText(text)
    //     return newStyle
    //   }
    //   return takeStyle(props.checkStyle)
    // }
    const select = new Select({
      condition: typeCondition[type],
      //过滤选中图层
      filter: (feature: any, layer) => {
        if (!selectSet?.value.has(layer)) return false
        const features = feature?.get('features')
        if (features) return features?.length === 1 ? true : false
        return true
      },
      // 样式处理
      style: checkStyle ? styleFun : null
    })

    // 传入默认插槽数据
    const featureCoordinate = ref<any>([]) // 图像坐标
    const show = ref(false) // 是否选中
    const featureCenter = ref<number[]>([]) // 当为 面的时候有值 为面积的中心的
    const coordinate = ref<number[]>([])
    const featureData = ref({})
    const onSelect = (sel: any) => {
      emit('select', sel)
      // let feature = sel.selected?.[0]
      // const features = feature?.get('features')
      // if (features?.length) feature = features[0]

      // if (feature) {
      //   const layer = select?.getLayer(feature)
      //   featureCoordinate.value = feature?.getGeometry()?.getCoordinates()
      //   coordinate.value = sel.mapBrowserEvent.coordinate
      //   if (featureCoordinate.value?.length > 2 || featureCoordinate?.value?.[0]?.length > 2) {
      //     featureCenter.value = getCenter(feature?.getGeometry()?.getExtent()) // sel.mapBrowserEvent.coordinate;
      //   }
      //   show.value = true
      //   featureData.value = feature.get('data') ?? {}
      //   emit('select', {
      //     layer,
      //     feature,
      //     featureCoordinate: featureCoordinate.value,
      //     featureCenter: featureCenter.value,
      //     coordinate: coordinate.value,
      //     data: featureData.value
      //   })
      // } else {
      //   featureCoordinate.value = []
      //   featureCenter.value = []
      //   coordinate.value = []
      //   show.value = false
      //   emit('select', {})
      // }
    }
    select.on('select', onSelect)
    onMapMounted(() => {
      map?.value.addInteraction(select)
    })
    expose({ select })
    onUnmounted(() => {
      select?.un('select', onSelect)
      map?.value && map?.value.removeInteraction(select)
    })
    return () => (
      <template>
        {slots?.default &&
          slots?.default({
            featureCoordinate,
            show,
            featureCenter,
            coordinate,
            featureData
          })}
      </template>
    )
  }
})
