import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useGetMap } from '@vue-omap/hooks'
import { defineComponent, onUnmounted } from 'vue'
import { Feature } from 'ol'
import { LinearRing } from 'ol/geom'
import { fromExtent } from 'ol/geom/Polygon'
import { takeStyle } from '@vue-omap/utils'

interface Props {
  features: any
  url: string
  olStyle: Record<string, any>
  single: boolean
}

//初始样式
const initStyle = {
  name: 'Style',
  stroke: {
    name: 'Stroke',
    color: '#28BBF1',
    width: 2
  }
}

/**
 * 参数属性
 * @member props
 * @property {json} features  本地geoJson
 * @property {string} url 在线geojson 暂不开放
 * @property {object} style geojson样式
 *  @property {boolean} single 是否只显示导入的geojson地图
 */

const props = {
  features: { type: Object },
  url: { type: String },
  olStyle: { type: Object, default: () => initStyle },
  single: { type: Boolean, default: false }
}

function setSource(localUrl: any[]) {
  return new VectorSource({
    features: localUrl ?? null,
    format: new GeoJSON()
  })
}

function geoJSONLayer(map: Record<string, any>, { features, olStyle, single }: Props) {
  const localUrl = new GeoJSON().readFeatures(features)
  if (!localUrl) return
  const vectorLayer = new VectorLayer({
    source: single ? new VectorSource() : setSource(localUrl),
    style: takeStyle(olStyle)
  })
  map?.addLayer(vectorLayer)
  return single ? setSingle(map, vectorLayer, setSource(localUrl)) : vectorLayer
}

//单一地图
function setSingle(map: Record<string, any>, v: any, s: any) {
  const feature = s.getFeatures()
  const ft = feature[0]
  const converGeom = erase(ft.getGeometry())
  const convertFt = new Feature({
    geometry: converGeom
  })
  v?.getSource()?.addFeature(convertFt)
  return v
}

function erase(geom: any) {
  const extent = [-180, -90, 180, 90]
  const polygonRing = fromExtent(extent)
  const coords = geom?.getCoordinates()
  coords.forEach((coord: any) => {
    const linearRing = new LinearRing(coord[0])
    polygonRing.appendLinearRing(linearRing)
  })
  return polygonRing
}

export default defineComponent({
  props,
  name: 'OGeoJson',
  setup(props, { slots }) {
    let vectorLayer: any = {}
    const map = useGetMap(
      (p: any) => props.features && (vectorLayer = geoJSONLayer(p, props as any))
    )

    vectorLayer && onUnmounted(() => map?.value.removeLayer(vectorLayer))
    return () => <template>{slots.default && slots.default({})}</template>
  }
})
