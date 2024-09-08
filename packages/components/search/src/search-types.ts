import type { OlStyle } from '@vue-omap/utils'
// import locate from '@docs/assets/images/locate.svg'
export const olStyle = {
  icon: { src: '', scale: 1.2 }
}

export interface OSearchProps {
  /**
   * 关键字
   */
  modelValue: string
  /**
   * 绘制样式
   */
  olStyle?: OlStyle
  /**
   * 参考天地图搜索接口参数
   */
  options?: any
}
