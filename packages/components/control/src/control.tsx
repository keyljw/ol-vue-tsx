import { defineComponent, onUnmounted } from 'vue'
import './index.scss'
import { useGetMap } from '@vue-omap/hooks'
import * as Control from 'ol/control'
interface controlObj {
  x: Record<string, any>[]
  map: { [x: string]: any }
}

/**
 *
 * @param type
 * @param FullScreen 全屏
 * @param MousePosition 鼠标位置
 * @param  OverviewMap 鸟瞰图
 * @param ScaleLine 比例尺
 * @param Zoom 缩放按钮
 * @param ZoomToExtent 放大到设定区域
 * @param typeObject 对应实例方法
 */

const props = {
  types: { type: String, default: 'Zoom' },
  typeObject: { type: Object, default: () => {} }
}

//创建控件
function getControl(option: string, fun: Record<string, any>) {
  const types = option.split(',')
  const funList: Record<string, any>[] = []
  types.forEach((k) => {
    const control = (Control as any)?.[k]
    if (control) {
      funList.push(new control(fun?.[k] ?? {}))
    }
  })
  return funList
}

//创建控件
function initControl(x: controlObj['x'], map: controlObj['map']) {
  x.forEach((f: Record<string, any>) => map?.value.addControl(f))
}
//清除控件
function removeControl(x: controlObj['x'], map: controlObj['map']) {
  x.map((f: Record<string, any>) => f && map?.value.removeControl(f))
  // console.log('移除控件');
}

export default defineComponent({
  name: 'OControl',
  props,
  setup(props, { slots, emit }) {
    const x = getControl(props.types, props.typeObject)
    const map = useGetMap(() => {
      map && initControl(x, map), emit('onReady', { x, map })
    })
    map && onUnmounted(() => removeControl(x, map))
    return () => <div ref={props.types}>{slots.default && slots.default({})}</div>
  }
})
