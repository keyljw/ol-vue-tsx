import type { Style } from 'ol/style'
import { ref, type Ref } from 'vue'

export const usePopup = (showPopupType: Ref, isVisible: boolean) => {
  const offset = ref([0, 0])
  const visible = ref<boolean>(false) // 判断弹窗是否展示
  const positioning = ref<any>('bottom-center')
  const position = ref([0, 0])
  const setOffset = (styleTemp: any) => {
    if (styleTemp && styleTemp?.getImage()) {
      const size = styleTemp?.getImage().getSize()
      const scale = styleTemp?.getImage().getScale() as any
      if (size && size.length > 1) {
        offset.value = [0, -size[1] * scale]
      } else {
        offset.value = [0, 0]
      }
    }
  }
  const showVisible = (
    isShow: boolean,
    type: string,
    styleTemp?: Style,
    positionVal?: number[]
  ) => {
    if (!isVisible) return
    if (showPopupType.value === type) {
      visible.value = isShow
      position.value = positionVal ?? [0, 0]
      styleTemp && setOffset(styleTemp)
    }
  }
  return { offset, visible, positioning, position, showVisible, setOffset }
}
