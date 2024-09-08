import WMTS from 'ol/source/WMTS'
import TileLayer from 'ol/layer/Tile'
import WMTSTileGrid from 'ol/tilegrid/WMTS'

import { get as getProjection } from 'ol/proj'
import { getWidth, getTopLeft } from 'ol/extent'
import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import { getVectorContext } from 'ol/render'
import { takeStyle } from '@vue-omap/utils'

export function takeOlParams() {
  const projection: any = getProjection('EPSG:4326')
  const projectionExtent = projection.getExtent()
  const projectionSize = getWidth(projectionExtent) / 256
  const resolutions = new Array(20)
  const matrixIds = new Array(20)
  for (let index = 0; index < 21; ++index) {
    resolutions[index] = projectionSize / Math.pow(2, index)
    matrixIds[index] = index
  }
  return { projection, projectionExtent, resolutions, matrixIds }
}
// 创建加载瓦片图层
export function createOlTile(url: string, layer: string, param: { [prop: string]: any }) {
  const { projection, projectionExtent, resolutions, matrixIds } = param
  const origin = getTopLeft(projectionExtent)
  const tileGrid = new WMTSTileGrid({ origin, matrixIds, resolutions })
  const sourceWmts = new WMTS({
    url: url,
    layer: layer,
    matrixSet: 'c',
    format: 'tiles',
    version: '1.0.0',
    projection: projection,
    style: 'default',
    wrapX: true,
    tileGrid
  })

  return new TileLayer({ source: sourceWmts, opacity: 1 })
}

// 生成签名
function base64UrlEncode(value: string, CryptoJS: any) {
  const encodedSource = CryptoJS.enc.Base64.stringify(value)
  const reg = new RegExp('/', 'g')
  return encodedSource.replace(/=+$/, '').replace(/\+/g, '-').replace(reg, '_')
}

// 生成签名
export async function takeSignature(ak: string, sk: string) {
  // import { CryptoJS } from 'jsrsasign'
  const CryptoJS: any = {}
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  const payload = JSON.stringify({ key: ak, exp: new Date().setHours(new Date().getHours() + 1) })
  const signs =
    base64UrlEncode(CryptoJS.enc.Utf8.parse(header), CryptoJS) +
    '.' +
    base64UrlEncode(CryptoJS.enc.Utf8.parse(payload), CryptoJS)
  const signature = CryptoJS.HmacSHA256(signs, sk)
  return `${signs}.${base64UrlEncode(signature, CryptoJS)}`
}

// 格式化URL
export function paramFormatter(url: string, option: { [prop: string]: string | number }) {
  const items: any[] = Object.entries(option)
  const param: string[] = items.reduce(
    (total: string[], [key, val]) => (total.push(`${key}=${val}`), total),
    []
  )
  return `${url}?${param.join('&')}`
}

const clipInitStyle = {
  stroke: { color: '' }
}

export function clipLayer(layer: any, coordinates: number[][][], clipStyle?: any) {
  const clipFeature = new Feature({
    geometry: new Polygon(coordinates)
  })

  layer.on('prerender', (event: any) => {
    const vectorContext = getVectorContext(event)
    event.context.globalCompositeOperation = 'source-over'
    const ctx = event.context
    ctx.save()
    vectorContext.drawFeature(clipFeature, takeStyle(clipStyle ?? clipInitStyle)) // 可以对边界设置一个样式
    ctx.clip()
  })
  layer.on('postrender', (event: any) => {
    const ctx = event.context
    ctx.restore()
  })
  layer.setExtent(clipFeature?.getGeometry()?.getExtent())
}
