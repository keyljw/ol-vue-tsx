/**
 * 通过JSON复制数据
 * @param data 复制的数据
 * @returns
 */
export function jsonCopied<T>(data: T): T {
  return structuredClone(data)
}
export const isObject = (obj?: string | object) => obj !== null && typeof obj === 'object'

export const isFunction = (obj?: string | object) => obj !== null && typeof obj === 'function'

export const turnNumbers = (data: number[] | string[] | string) => {
  let num = []
  if (typeof data === 'string') {
    num = data.split(',')
  } else {
    num = data
  }
  return num?.map((m) => +m)
}
