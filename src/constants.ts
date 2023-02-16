export const STRATEGIES = {
  PREFIX: 'prefix',
  PREFIX_EXCEPT_DEFAULT: 'prefix_except_default',
  PREFIX_AND_DEFAULT: 'prefix_and_default',
  NO_PREFIX: 'no_prefix',
} as const

export const DEFAULT_LOCALE = ''
export const DEFAULT_STRATEGY = STRATEGIES.PREFIX_EXCEPT_DEFAULT
export const DEFAULT_TRAILING_SLASH = false
export const DEFAULT_ROUTES_NAME_SEPARATOR = '___'
export const DEFAULT_LOCALE_ROUTE_NAME_SUFFIX = 'default'
