import { onUnmounted, type ShallowRef } from 'vue'
import { useGetMap } from './useMap'

export function useOn(featureRef?: ShallowRef<any>, layerRef?: ShallowRef<any>, callback?: any) {
  const map = useGetMap()
  const eventList: { type: any; event: (e: any) => void }[] = []

  const onEvent = () => {
    // 被选中过
    let isCheck = false
    return (event: any) => {
      const type = event.type
      // 没有 图层
      if (!featureRef?.value && !layerRef?.value) return
      let feature: any
      let layer: any
      map?.value.forEachFeatureAtPixel(
        event.pixel,
        (f: any, l: any) => ((feature = f), (layer = l))
      )
      // 单个适量图层
      if (layerRef?.value && featureRef?.value) {
        if (layer === layerRef?.value && feature === featureRef?.value) {
          isCheck = true
          const id = feature?.getId()
          const data = feature?.get('data')
          callback && callback({ layer, feature, event, type, id, data })
        } else if (isCheck) {
          isCheck = false
          callback && callback({ event, type })
        }
      } else {
        // 父级分发
        if (
          layer === layerRef?.value ||
          (layerRef?.value instanceof Set && layerRef?.value.has(layer))
        ) {
          isCheck = true
          const id = feature?.getId()
          const data = feature?.get('data')
          callback && callback({ layer, feature, event, type, id, data })
        } else if (isCheck) {
          isCheck = false
          callback && callback({ event, type })
        }
      }
    }
  }
  onUnmounted(() => {
    eventList.forEach((element) => {
      map?.value.un(element.type, onEvent)
    })
  })
  function on(type: any) {
    const event = onEvent()
    eventList.push({ type, event })
    map?.value.on(type, event)
  }
  function createOnAll(fun?: any) {
    if (fun) callback = fun
    const list = ['singleclick', 'dblclick', 'pointermove']
    list.forEach((item) => on(item))
  }
  return { on, createOnAll, layerRef, featureRef }
}

export default useOn
