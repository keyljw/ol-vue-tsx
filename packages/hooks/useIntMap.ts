import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { useGetMap } from './useMap'
import Map from 'ol/Map'
import { inject, onUnmounted, shallowRef, type ShallowRef } from 'vue'
import useOn from './useOn'

export function useIntMap() {
  let isGroup = false
  const layer = shallowRef()
  const sourceRef = shallowRef()
  const featureRef = shallowRef()

  let mapMounted: (mapData?: Map) => void
  const onMapMounted = (fun: (mapData?: Map) => void) => (mapMounted = fun)

  const selectSet = inject<ShallowRef<Set<any>>>('selectSet')
  const layerGroup = inject<ShallowRef<any>>('layer')
  const olayers = inject<ShallowRef<any>>('olayers')

  const { createOnAll, on } = useOn(featureRef, layer)

  const onAll = (emits: any, feature?: any) => {
    if (layerGroup?.value) return
    featureRef.value = feature || undefined
    createOnAll(({ layer, feature, event, type, id, data }: any) => {
      if (emits) emits(type, { layer, feature, event, type, id, data })
    })
  }
  // 创建适量图层
  const createLayer = (isSetSource = true): { layer: ShallowRef; source: ShallowRef } => {
    if (olayers?.value) {
      layer.value = olayers.value
      return {
        layer: olayers,
        source: shallowRef(olayers?.value?.getSource())
      }
    } else if (layerGroup?.value) {
      layer.value = layerGroup.value
      return {
        layer: layerGroup,
        source: shallowRef(layerGroup?.value?.getSource())
      }
    } else {
      isGroup = true
      layer.value = new VectorLayer()
      sourceRef.value = new VectorSource()
      isSetSource && layer.value.setSource(sourceRef.value)
      selectSet?.value?.add(layer.value)
      return { layer, source: sourceRef }
    }
  }

  const map = useGetMap((mapData: Map) => {
    mapMounted && mapMounted(mapData)

    !layerGroup?.value && !olayers && layer?.value && map?.value?.addLayer(layer.value)
  })

  // map 只有在初始化结束才能获取到
  onUnmounted(() => {
    if (isGroup) {
      sourceRef.value?.clear()
      !layerGroup?.value && !olayers && layer?.value && map?.value.removeLayer(layer.value)
      selectSet?.value && selectSet.value.delete(layer.value)
    }
  })
  return { map, onMapMounted, createLayer, onAll, layerGroup, on }
}

export default useIntMap
