import type { STRATEGIES } from './constants'

export type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES]

export type CustomRoutePages = Record<string, Record<string, string>>

export interface LocaleInfo {
  code: string
  path: string
  file: string
}
