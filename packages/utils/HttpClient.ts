import { isObject } from './utils'
import { xmlToObject } from './xml'

type configType = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
}

export class FetchRequest {
  baseURL: string

  constructor(config: { baseURL: string }) {
    this.baseURL = config.baseURL
  }

  async request<T = any>(config: configType) {
    // fetch中GET方法没有请求体 需要拼接到url中 参数直接拼接
    const fetchURL = this.baseURL + config.url

    // 如果是POST 把data传递给body
    const fetchConfig: RequestInit =
      config.method === 'POST'
        ? {
            method: config.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config.data)
          }
        : {
            method: config.method
            //  headers: { 'Content-Type': 'application/xml' }
          }

    // 获取fetch的数据并返回
    const res = await fetch(fetchURL, fetchConfig)

    if (res.url.includes('/drive')) {
      const xmlString = await res.text()
      const result = xmlToObject(xmlString)
      return result
    }
    return res.json()
  }

  get<T1 = any, T2 = any>(url: string, params?: T2) {
    if (params) {
      const paramsArray: any = []
      //拼接参数
      Object.keys(params).forEach((key) => {
        let item = params[key as keyof typeof params] ?? ''
        if (isObject(item)) {
          item = JSON.stringify(item)
        }
        paramsArray.push(key + '=' + item)
      })
      if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&')
      } else {
        url += '&' + paramsArray.join('&')
      }
    }

    return this.request<T1>({ url, method: 'GET' })
  }

  post<T1 = any, T2 = any>(url: string, data?: T2) {
    return this.request<T1>({ url: url, method: 'POST', data })
  }
}
