import { inject, onMounted, type ShallowRef } from 'vue'
import Map from 'ol/Map'
export const useGetMap = (callback?: any) => {
  const map = inject<ShallowRef<Map>>('map')
  onMounted(() => {
    new Promise<ShallowRef<Map>>((resolve) => {
      const getMap = () => {
        if (map?.value) {
          return resolve(callback && callback(map.value))
        }
        const timeout = setTimeout(() => {
          getMap()
          clearTimeout(timeout)
        }, 0)
      }
      getMap()
    })
  })
  return map
}
