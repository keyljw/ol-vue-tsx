import type { PropType } from 'vue'
const olStyle = {
  fill: {
    color: 'rgba(255, 255, 255, 0.2)'
  },
  stroke: {
    color: '#409eff',
    width: 5
  },
  circle: {
    radius: 7,
    fill: {
      color: '#409eff'
    }
  }
}

export const odrawProps = {
  /**
   * 类型
   */
  type: {
    type: String as PropType<'Polygon' | 'Point' | 'LineString' | 'Polygon' | 'Circle'>,
    default: 'Polygon'
  },
  /**
   * 绘制样式
   */
  olStyle: {
    type: Object,
    default: () => olStyle
  },
  /**
   * 是否手动控制
   */
  hand: { type: Boolean, default: false },
  /**
   * 绘制相关配置
   */
  options: {
    type: Object,
    default: () => ({})
  }
}
