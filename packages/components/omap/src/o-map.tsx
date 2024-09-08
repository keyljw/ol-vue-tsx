import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import {
  defineComponent,
  ref,
  shallowRef,
  onMounted,
  provide,
  type PropType,
  onUnmounted,
  inject
} from 'vue'
import * as olControl from 'ol/control'
import LayerImg from '../layer/o-layer-img'
export default defineComponent({
  name: 'OMap',
  props: {
    id: { type: String, default: 'olmap' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '100%' },
    // 最小缩放
    minZoom: { type: Number, default: 1 },
    // 最大缩放
    maxZoom: { type: Number, default: 18 },
    // 初始化缩放层级
    zoom: { type: Number, default: 10 },
    // 初始化中心经纬度
    center: { type: Array as PropType<Array<number>>, default: () => [120.25664, 29.153607] },
    // 地图的坐标类型  BD09(百度地图坐标系) | WGS84(1984年世界大地坐标系统) | GCJ02(火星坐标系)
    projection: { type: String, default: 'EPSG:4326' },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tk: { type: String }
  },
  emits: ['initMap'],
  setup(props, { slots, emit }) {
    const { height, width, id, minZoom, maxZoom, zoom, center, projection } = props

    // const { tk } =  toRefs(props)

    const tk = props.tk ?? inject('tk')
    const mapContainer = ref<HTMLElement>()

    const map = shallowRef<Map>()
    provide('map', map)
    provide('tk', tk)
    onMounted(() => initialOlMap())
    const setCursor = (e: any) => {
      const pixel: any = map?.value?.getEventPixel(e.originalEvent)
      const feature = map?.value?.forEachFeatureAtPixel(pixel, (feature) => {
        return feature
      })
      if (feature == undefined) {
        map.value && (map.value.getTargetElement().style.cursor = 'auto')
      } else {
        map.value && (map.value.getTargetElement().style.cursor = 'pointer')
      }
    }
    function initialOlMap() {
      const viewer = new View({ minZoom, maxZoom, zoom, center, projection })
      map.value = new Map({
        layers: [],
        target: mapContainer.value,
        view: viewer,
        controls: olControl.defaults({
          zoom: false,
          attribution: false,
          rotate: false
        })
      })
      emit('initMap', map.value)

      // 修改鼠标样式
      map?.value.on('pointermove', setCursor)
    }
    onUnmounted(() => {
      map?.value?.un('pointermove', setCursor)
      // 销毁地图
      map?.value?.dispose()
    })
    return () => (
      <div id={id} style={{ height, width }} ref={mapContainer}>
        {slots.layer ? slots?.layer() : <LayerImg />}
        {slots.default && slots.default()}
      </div>
    )
  }
})
