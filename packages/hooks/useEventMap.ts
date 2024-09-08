import { onUnmounted, type ShallowRef } from 'vue'
import { useGetMap } from './useMap'

export function useEventMap(
  type: any,
  callback: any,
  options?: { feature?: ShallowRef<any>; layer?: ShallowRef<any> }
) {
  const map = useGetMap(() => {
    map?.value.on(type, onEvent)
  })
  let isCheck = false
  const onEvent = (event: any) => {
    if (options?.layer?.value || options?.feature?.value) {
      let feature: any
      let layer: any
      map?.value.forEachFeatureAtPixel(event.pixel, (f: any, l: any) => {
        feature = f
        layer = l
      })
      if (
        layer === options?.layer?.value ||
        (options?.layer?.value instanceof Set && options?.layer?.value.has(layer)) ||
        feature === options?.feature?.value
      ) {
        isCheck = true
        callback({ layer, feature, event, type })
      } else {
        if (isCheck) {
          callback({ layer: undefined, feature: undefined, event, type })
          isCheck = false
        }
      }
    } else {
      callback({ type, event })
    }
  }
  onUnmounted(() => map?.value.un(type, onEvent))
}

export default useEventMap
