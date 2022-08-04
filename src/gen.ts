import { toCode } from './utils'
import type { ModuleOptions } from './module'

export function generateLoaderOptions(options: ModuleOptions) {
  const genCode = Object.entries(options)
    .map(([rootKey, rootValue]) => {
      return `export const ${rootKey} = ${toCode(rootValue)}`
    })
    .join('\n')

  return genCode
}
