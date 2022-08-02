import { toCode } from './utils'
import type { NuxtI18nOptions } from './types'

export function generateLoaderOptions(options: NuxtI18nOptions) {
  const genCode = Object.entries(options)
    .map(([rootKey, rootValue]) => {
      return `export const ${rootKey} = ${toCode(rootValue)}`
    })
    .join('\n')

  return genCode
}
