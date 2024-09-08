import { type Ref, unref, ref, inject } from 'vue'
type Num = Ref<number[]> | number[] | undefined

export const useDrive = (orig: Num = [], dest: Num = [], mid: Num = [], style = 0) => {
  const tk = inject<string>('tk')
  const coordinates = ref<number[][]>([])
  async function getData() {
    const origVal = unref(orig)
    const destVal = unref(dest)
    const midVal = unref(mid)
    if (origVal.length > 0 && destVal.length > 0) {
      const params = {
        orig: origVal.join(','),
        dest: destVal.join(','),
        style: style + '',
        mid: midVal?.join(',') ?? undefined
      }
      return {}
      // const data = await getDrive(params, tk)

      // if (data.childNodes?.length) {
      //   data.childNodes.forEach((element: any) => {
      //     if (element.nodeName === 'routelatlon') {
      //       const routelatlon = element.childNodes?.[0].split(';')
      //       routelatlon.pop()
      //       coordinates.value = routelatlon.map((item: string) => {
      //         const data = item.split(',')
      //         return [+data[0], +data[1]]
      //       })
      //       coordinates.value.reverse()
      //     }
      //   })
      // }
      // return data
    }
    return {}
  }
  return { getData, coordinates }
}
export default useDrive
