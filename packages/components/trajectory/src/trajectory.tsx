import { computed, defineComponent, nextTick, watch } from 'vue'
import { LineString, Point } from 'ol/geom'
import { Feature } from 'ol'
import { takeStyle } from '@vue-omap/utils'
import { useIntMap } from '@vue-omap/hooks'
import { trajectoryProps } from './trajectory-types'
import { isFunction } from '@vue-omap/utils'
import { getVectorContext } from 'ol/render'
import { Icon, Style } from 'ol/style'
import arrowRightImg from './arrowright.svg'
export default defineComponent({
  name: 'OTrajectory',
  props: trajectoryProps,
  setup(props) {
    const lineString = new LineString(props.coordinates ?? [])
    const lineFeature = new Feature({
      geometry: lineString
    })
    watch(
      () => props.play,
      () => animation()
    )
    watch(
      () => props.coordinates,
      () => {
        lineString.setCoordinates(props.coordinates ?? [])
        lineFeature?.changed()
        position.setCoordinates(origin.value)
        animation()
        nextTick(() => {
          map?.value.getView().fit(lineString, { padding: [50, 50, 50, 50], duration: 2000 })
        })
      }
    )

    const { speed } = props
    const olStyle = props.tStyle ? takeStyle(props.olStyle) : undefined
    lineFeature.setStyle(() => {
      const style = isFunction(olStyle) ? olStyle(lineFeature) : olStyle

      return [style, ...createArrowPolylineStyle()]
    })
    const { map, onMapMounted, createLayer } = useIntMap()
    const { layer, source } = createLayer()
    const origin = computed(() => props.coordinates?.[0] ?? [])
    const position = new Point(origin.value)
    let distance = 0
    let lastTime: any = undefined
    const geoMarker = new Feature({
      type: 'geoMarker',
      geometry: position
    })

    const style = props.tStyle ? takeStyle(props.tStyle) : undefined
    const tStyle = (rotation?: number) => {
      if (isFunction(style)) {
        return (feature: any, resolution: number) => style(feature, resolution, rotation)
      } else {
        return style
      }
    }
    geoMarker.setStyle(tStyle())

    function getRotation(prev?: number[], next?: number[]) {
      if (prev?.length && next?.length) {
        const dx = prev[0] - next[0]
        const dy = prev[1] - next[1]
        return Math.atan2(dy, dx)
      }
      return 0
    }
    function moveFeature(event: any) {
      if ((!props.loop && distance > 0.999) || !props.coordinates.length) return
      const time = event.frameState.time
      const elapsedTime = time - lastTime
      distance = (distance + (speed * elapsedTime) / 1e6) % 1
      lastTime = time
      const geometry = lineFeature.getGeometry()
      const currentCoordinate = geometry?.getCoordinateAt(distance)
      const nextCoordinate = geometry?.getCoordinateAt(Math.min(distance + 0.0001, 1))
      const rotation = getRotation(currentCoordinate, nextCoordinate)
      const vectorContext = getVectorContext(event)

      const style = tStyle(rotation)
      const sty2 = isFunction(style) ? style(geoMarker) : style
      const img = sty2.getImage()
      geoMarker.setStyle(tStyle(rotation))
      position.setCoordinates(currentCoordinate ?? [])
      vectorContext.setStyle(sty2)
      img && vectorContext.setImageStyle(img)
      vectorContext.drawGeometry(position)
      map?.value.render()
    }
    function animation() {
      if (props.play) {
        lastTime = Date.now()
        layer.value.on('postrender', moveFeature)
        map?.value.render()
        geoMarker.setGeometry(undefined)
      } else {
        geoMarker.setGeometry(position)
        layer.value?.un('postrender', moveFeature)
      }
    }

    onMapMounted(() => {
      source.value?.addFeatures([geoMarker, lineFeature])
      animation()
    })

    function createArrowPolylineStyle() {
      if (!props.showDir) return []
      const styles = []
      const coords = props.coordinates
      // let coords = coordss.filter((item, index) => index !== coordss.length - 2)
      // 内部箭头间隔距离（像素）
      const step = 40
      let distance = step / 2 //首个点放置在距离起点1/2间隔的位置

      // 获取起始像素坐标
      let pixStart = map?.value.getPixelFromCoordinate(origin.value) ?? []
      let pixEnd

      for (let i = 1; i < coords.length; i++) {
        let coord: any, coordPix, style

        // 获取当前第一个箭头位置
        pixEnd = map?.value.getPixelFromCoordinate(coords[i]) ?? []
        const distanceStart2end = Math.sqrt(
          Math.pow(pixStart[0] - pixEnd[0], 2) + Math.pow(pixStart[1] - pixEnd[1], 2)
        ) //计算收尾在屏幕上的距离
        if (distanceStart2end > distance) {
          //距离大于间隔
          //计算距离开始点位的像素值
          coordPix = [
            (distance * (pixEnd[0] - pixStart[0])) / distanceStart2end + pixStart[0],
            (distance * (pixEnd[1] - pixStart[1])) / distanceStart2end + pixStart[1]
          ]
          //计算经纬度
          coord = map?.value.getCoordinateFromPixel(coordPix)

          style = new Style({
            geometry: new Point(coord),
            image: new Icon({
              src: arrowRightImg,
              rotateWithView: true,
              // rotation: Math.PI + Math.atan2(pixEnd[1] - pixStart[1], pixEnd[0] - pixStart[0]),
              rotation: Math.atan2(pixEnd[1] - pixStart[1], pixEnd[0] - pixStart[0]),
              scale: props.arrowWidth / 12
            })
          })
          //下次循环开始点为当前点
          pixStart = coordPix
          distance = step
          i--
        } else if (distanceStart2end == distance) {
          //距离等于间隔
          style = new Style({
            geometry: new Point(coords[i]),
            image: new Icon({
              src: arrowRightImg,
              rotateWithView: true,
              rotation: Math.atan2(pixEnd[1] - pixStart[1], pixEnd[0] - pixStart[0]),
              scale: props.arrowWidth / 12
            })
          })
          pixStart = pixEnd
          distance = step
        } else {
          //距离小于间隔
          distance = distance - distanceStart2end
          pixStart = pixEnd
        }
        style && styles.push(style)
      }
      return styles
    }
  }
})
