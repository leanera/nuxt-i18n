export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isRegExp = (val: unknown): val is RegExp => Object.prototype.toString.call(val) === '[object RegExp]'
export const isObject = (val: any): val is object => Object.prototype.toString.call(val) === '[object Object]'

export function stringifyObj(obj: Record<string, any>): string {
  return `Object({${Object.entries(obj)
    .map(([key, value]) => `${JSON.stringify(key)}:${toCode(value)}`)
    .join(',')}})`
}

export function toCode(code: any): string {
  if (code === null)
    return 'null'

  if (code === undefined)
    return 'undefined'

  if (isString(code))
    return JSON.stringify(code)

  if (isRegExp(code) && code.toString)
    return code.toString()

  if (isFunction(code) && code.toString)
    return `(${code.toString()})`

  if (Array.isArray(code))
    return `[${code.map(c => toCode(c)).join(',')}]`

  if (isObject(code))
    return stringifyObj(code)

  return `${code}`
}
