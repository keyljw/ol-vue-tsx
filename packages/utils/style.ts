import { Circle, Fill, Icon, RegularShape, Stroke, Style, Text } from 'ol/style'
import { isObject } from './utils'
import { toRaw } from 'vue'
export type OlStyle = any

const PROPS_MAP = {
  fill: Fill,
  text: Text,
  stroke: Stroke,
  circle: Circle,
  icon: Icon,
  regularShape: RegularShape
}

const IMAGE_PROPS = ['circle', 'icon', 'regularShape']

function takeFill(fill: any) {
  const opts = isObject(fill) ? fill : { color: fill }
  return new Fill(opts)
}

function takeValue(Model: any, key: string, value: any) {
  if (value === undefined || value === null) return
  if (!Model) return value
  if (['fill'].includes(key)) return takeFill(value)
  if (key === 'text') {
    return isObject(value) ? tackModel(value, Model) : value
  }
  return tackModel(value, Model)
}

function tackModel(settings: any, StyleModel: any) {
  const opts: Record<string, any> = {}
  Object.entries(settings).forEach(([key, value]) => {
    const Model = PROPS_MAP[key as keyof typeof PROPS_MAP]
    if (key === 'font') {
      value = `${value} sans-serif`
    }
    opts[IMAGE_PROPS.includes(key) ? 'image' : key] = takeValue(Model, key, value)
  })
  return new StyleModel(opts)
}

export function takeStyle(settings: any) {
  const options = toRaw(settings)
  if (typeof options === 'function') {
    return (feature: any, resolution: number, rotation?: number) => {
      const style = options(feature, resolution, rotation)
      return takeStyle(style)
    }
  }
  return tackModel(options, Style)
}
