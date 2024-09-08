import { defineComponent, onUnmounted, toRefs, ref, watchEffect, type PropType } from 'vue'
import Overlay, { type PanIntoViewOptions } from 'ol/Overlay'
import { useGetMap } from '@vue-omap/hooks'
import { turnNumbers } from '@vue-omap/utils'
export const useHtmlProps = () => ({
  positioning: {
    type: String as PropType<
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right'
      | 'center-left'
      | 'center-center'
      | 'center-right'
      | 'top-left'
      | 'top-center'
      | 'top-right'
    >,
    default: 'center-center'
  },
  openMove: { type: Boolean, default: false }, // 是否开启跟随鼠标移动变化
  // 显示位置
  position: { type: Array as PropType<number[] | undefined>, required: true },
  // 位置偏移
  offset: Array as PropType<number[]>,
  // 是否阻止时间冒泡，默认 true
  stopEvent: { type: Boolean, default: true },
  // 当Popup超出地图边界时，为了Popup全部可见，地图移动
  autoPan: {
    type: Object as PropType<boolean | PanIntoViewOptions | undefined>,
    default: () => ({
      animation: {
        duration: 250
      }
    })
  }
})

export default defineComponent({
  props: useHtmlProps(),
  name: 'OHtml',
  setup(props, { slots }) {
    const { position, positioning, offset, stopEvent, openMove, autoPan } = toRefs(props)
    // 初始化
    const pointermove = (evt: any) => {
      pointOverlay?.setPosition(evt?.coordinate)
    }
    const map = useGetMap(() => {
      createOverlay()
      openMove.value && map?.value.on('pointermove', pointermove)
    })
    let pointOverlay: Overlay | undefined = undefined
    const elOverlay = ref()

    const createOverlay = () => {
      pointOverlay = new Overlay({
        element: elOverlay.value,
        positioning: positioning.value,
        position: position?.value?.length ? turnNumbers(position.value) : undefined,
        offset: offset.value,
        stopEvent: stopEvent.value,
        autoPan: autoPan.value
      })
      map?.value.addOverlay(pointOverlay)
    }

    watchEffect(() => {
      if (position.value?.[0]) {
        pointOverlay?.setPosition(turnNumbers(position.value))
      } else pointOverlay?.setPosition(undefined)
      positioning?.value && pointOverlay?.setPositioning(positioning.value)
      offset?.value && pointOverlay?.setOffset(offset?.value)
    })
    // 创建点位
    onUnmounted(() => {
      if (pointOverlay) map?.value.removeOverlay(pointOverlay)
      map?.value.un('pointermove', pointermove)
    })
    return () => <div ref={elOverlay}>{slots.default ? slots?.default() : ''}</div>
  }
})
