import type { PropType } from 'vue'

const options = {
  position: 'position',
  weight: 'weight'
}
export const heateProps = {
  // [{coordinate:[], weight}]
  data: { type: Array as PropType<any[]>, default: () => [] },
  // 不透明度（0,1）
  opacity: {
    type: Number,
    default: 1
  },
  // 图层排序
  zIndex: Number,
  // 此图层可见的最小分辨率
  minResolution: Number,
  maxResolution: Number,
  minZoom: Number,
  maxZoom: Number,
  // 热图的颜色渐变，指定为CSS颜色字符串数组
  gradient: {
    type: Array as PropType<string[]>,
    default: () => ['#00f', '#0ff', '#0f0', '#ff0', '#f00']
  },
  // 半径大小（以像素为单位）
  radius: { type: Number, default: 8 },
  // 模糊大小（以像素为单位）
  blur: { type: Number, default: 15 },
  // 用于权重的要素属性或从要素返回权重的函数。重量值的范围应为0到1（外部的值将被限制在该范围内）。
  weightFun: { type: Function },
  options: {
    type: Object,
    default: () => ({ ...options })
  }
}
