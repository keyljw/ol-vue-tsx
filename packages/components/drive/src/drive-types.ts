import { trajectoryProps } from '../../trajectory/src/trajectory-types'
import { type PropType } from 'vue'
export const driveProps = {
  // 起点经纬度
  orig: {
    type: Array as PropType<number[]>,
    required: true,
    default: []
  },
  //	终点经纬度
  dest: {
    type: Array as PropType<number[]>,
    required: true,
    default: []
  },
  // mid
  mid: {
    type: Array as PropType<number[]>
  },
  /**
   *	导航路线类型
   * 	默认0 （0：最快路线，1：最短路线，2：避开高速，3：步行）
   */
  routeType: {
    type: Number,
    default: 0
  },
  ...trajectoryProps
}
