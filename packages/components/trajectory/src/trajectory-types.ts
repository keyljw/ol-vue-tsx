import type { OlStyle } from '@vue-omap/utils'
import { type PropType } from 'vue'
import { LineProps } from '../../line/src/line'
export const trajectoryProps = {
  // 循环
  loop: {
    type: Boolean,
    default: true
  },
  arrowWidth: {
    type: Number,
    default: 5
  },
  // 是否显示箭头
  showDir: {
    type: Boolean,
    default: false
  },
  // 轨迹样式
  tStyle: {
    olStyle: Object as PropType<OlStyle>, //  矢量样式
    default() {
      return {
        circle: {
          fill: 'red',
          radius: 10
        }
      }
    }
  },
  // 动画时间，毫秒
  speed: {
    type: Number,
    default: 100
  },

  // 暂停开始
  play: {
    type: Boolean,
    default: true
  },

  ...LineProps
}
