import { defineComponent, onUnmounted, ref, toRefs, watch, shallowRef } from 'vue'
import { Draw, Modify, Snap } from 'ol/interaction'
import { takeStyle } from '@vue-omap/utils'
import { useIntMap } from '@vue-omap/hooks'
import Ohtml from '../..//html/src/ohtml'
import './style/index.scss'
import { odrawProps } from './odraw-types'
import type { Feature } from 'ol'

export default defineComponent({
  name: 'ODraw',
  props: odrawProps,
  setup(props, { expose, emit }) {
    const { olStyle, type } = toRefs(props)
    const { map, onMapMounted, createLayer } = useIntMap()
    const { source, layer } = createLayer()

    let modify: Modify | undefined
    const snap = new Snap({ source: source.value })
    const drawer = shallowRef<Draw | undefined>()
    const position = ref<number[] | undefined>(undefined)
    const visible = ref(false)

    watch(type, () => {
      if (!props.hand) {
        onDraw()
        onModify()
      }
    })

    //开始绘制
    const onDraw = () => {
      onFinish()
      drawer.value = new Draw({
        source: source.value,
        type: type?.value,
        style: takeStyle(olStyle.value),
        ...props.options
        // stopClick: stopClick?.value,
        // minPoints: minPoints?.value,
        // maxPoints: minPoints?.value,
        // dragVertexDelay: dragVertexDelay?.value,
        // snapTolerance: snapTolerance?.value
      })

      map?.value.addInteraction(drawer.value)
      drawHandler()
    }

    //结束绘制
    const onFinish = () => {
      if (drawer.value) {
        drawer.value.un('drawstart', drawstart)
        drawer.value.un('drawend', drawend)
        drawer.value.dispose()
        drawer.value.finishDrawing()
        map?.value.removeInteraction(drawer.value)
        drawer.value = undefined
      }
      onUnModify()
    }

    //清空
    const onClear = () => {
      source.value?.clear()
    }

    // 删除上一个点位
    const onRemoveLastPoint = () => {
      drawer.value && drawer.value.removeLastPoint()
    }
    /**
     * 开始编辑时触发
     */
    const modifyStartHandler = (evt: any) => {
      emit('modifystart', evt)
    }
    /**
     * 结束编辑时触发
     */
    const modifyEndHandler = (evt: any) => {
      emit('modifyend', evt)
    }
    /**
     * 获取图层
     */
    const getFeatures = () => {
      return source.value?.getFeatures()
    }

    /**
     * 删除指定图形
     * @method removeFeature
     * @param feature
     */
    const removeFeature = (feature: Feature<any>) => {
      source.value?.removeFeature(feature)
    }
    /**
     * 添加图形, 图形加入到矢量图层
     * @method addFeature
     * @param {Feature[]|feature} feature
     */
    const addFeature = (feature: any) => {
      const features = [].concat(feature)
      source.value.addFeatures(features)
    }

    // 开启编辑模式
    const onModify = () => {
      onUnModify()
      modify = new Modify({
        ...props.options,
        source: source.value,
        style: takeStyle(olStyle.value)
      })
      modify.on('modifystart', modifyStartHandler)
      modify.on('modifyend', modifyEndHandler)
      map?.value.addInteraction(modify)
    }
    //结束编辑
    const onUnModify = () => {
      if (!modify) return
      modify.un('modifystart', modifyStartHandler)
      modify.un('modifyend', modifyEndHandler)
      modify && map?.value.removeInteraction(modify)
      modify = undefined
    }

    const drawstart = (evt: any) => {
      if (['Circle', 'Point'].indexOf(type.value) === -1) visible.value = true
      emit('drawstart', evt)
    }
    const drawend = (evt: any) => {
      visible.value = false
      emit('drawend', evt)
    }

    // 绘制事件
    const drawHandler = () => {
      drawer.value && drawer.value.on('drawstart', drawstart)
      drawer.value && drawer.value.on('drawend', drawend)
    }
    // map只有在初始化结束后才能获取到
    onMapMounted(() => {
      layer.value?.setStyle(takeStyle(olStyle.value))
      map?.value.addInteraction(snap)
      if (!props.hand) {
        onDraw()
        onModify()
      }
      layer.value.setZIndex(map?.value.getLayers().getArray().length)
      emit('ready')
    })
    onUnmounted(() => {
      modify && map?.value.removeInteraction(modify)
      drawer.value && drawer.value.finishDrawing()
      drawer.value && map?.value.removeInteraction(drawer.value)
      snap && map?.value.removeInteraction(snap)
    })

    expose({
      onDraw,
      onFinish,
      onUnModify,
      onRemoveLastPoint,
      onModify,
      onClear,
      getFeatures,
      removeFeature,
      addFeature,
      layer,
      source
    })
    return () => (
      <Ohtml
        position={position.value}
        autoPan={false}
        openMove={true}
        positioning="top-left"
        offset={[0, 20]}
        v-show={drawer.value && visible.value}
      >
        <div class="omap-overlay-text-container">单机执行下一个点，双击完成绘制</div>
      </Ohtml>
    )
  }
})

// 绘制面积暂时去掉
// let measureTooltipElement: any = undefined;
// let measureTooltip: any = undefined;
// let sketch: any = undefined;
// let listener: any = undefined;
// //测量绘制
// function createMeasureTooltip() {
// 	if (measureTooltipElement) {
// 		measureTooltipElement.parentNode.removeChild(measureTooltipElement);
// 	}
// 	measureTooltipElement = document.createElement('div');
// 	measureTooltipElement.name = 'ol-tooltip ol-tooltip-measure';
// 	measureTooltip = new Overlay({
// 		element: measureTooltipElement,
// 		offset: [0, -15],
// 		positioning: 'bottom-center',
// 	});
// 	map?.value.addOverlay(measureTooltip);
// }
// function drawHandler() {
// 	drawer.on('drawstart', (evt: any) => {
// 		sketch = evt.feature;
// 		let tooltipCoord = evt.coordinate;
// 		listener = sketch.getGeometry().on('change', (evt: any) => {
// 			let output;
// 			const geom = evt.target;
// 			if (geom instanceof Polygon) {
// 				output = formatArea(geom);
// 				tooltipCoord = geom.getInteriorPoint().getCoordinates();
// 			}
// 			if (geom instanceof LineString) {
// 				output = formatLength(geom);
// 				tooltipCoord = geom.getLastCoordinate();
// 			}
// 			measureTooltipElement.innerHTML = output;
// 			measureTooltip.setPosition(tooltipCoord);
// 		});
// 	});
// 	drawer.on('drawend', () => {
// 		measureTooltipElement.name = 'ol-tooltip ol-tooltip-static';
// 		measureTooltip.setOffset([0, -7]);
// 		sketch = null;
// 		measureTooltipElement = null;
// 		createMeasureTooltip();
// 		unByKey(listener);
// 	});
// }
// function formatLength(line: any) {
// 	const sourceProj = map?.value.getView().getProjection(); //获取投影坐标系
// 	var length = getLength(line, { projection: sourceProj });
// 	var output;
// 	if (length > 10000) {
// 		output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
// 	} else {
// 		output = Math.round(length * 100) / 100 + ' ' + 'm';
// 	}
// 	return output;
// }
// //测量获取亩
// function polygonArea(polygon: any) {
// 	const area = getArea(polygon, {
// 		projection: 'EPSG:4326',
// 	});
// 	return Math.round((area / 666.67) * 100) / 100;
// }
// //测量获取面积
// function formatArea(polygon: any) {
// 	const sourceProj = map?.value.getView().getProjection(); //获取投影坐标系
// 	const geom = polygon.clone().transform(sourceProj, 'EPSG:3857');
// 	const area = getArea(geom);
// 	let output;
// 	output = Math.round((area / 666.67) * 100) / 100 + ' ' + '亩';
// 	return output;
// }
// // 开始绘制
// let draw = () => {
// 	const layer = this.parent.createVectorLayer();
// 	this.source = layer.getSource();
// 	this.map.addInteraction(this.drawer);
// 	this.drawer.on('drawstart', this.handleDrawStart);
// 	this.drawer.on('drawend', this.handleDraw);
// };
