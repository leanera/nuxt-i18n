import { useLogger } from '@nuxt/kit'
import type { createConsola } from 'consola'
import type { Strategies } from './types'

export const logger: ReturnType<typeof createConsola> = useLogger('@leanera/nuxt-i18n')

export function adjustRoutePathForTrailingSlash(
  pagePath: string,
  trailingSlash: boolean,
  isChildWithRelativePath: boolean,
) {
  return pagePath.replace(/\/+$/, '') + (trailingSlash ? '/' : '') || (isChildWithRelativePath ? '' : '/')
}

export function getRouteName(routeName?: string | symbol | null) {
  return typeof routeName === 'string'
    ? routeName
    : typeof routeName === 'symbol'
      ? routeName.toString()
      : '(null)'
}

export function getLocaleRouteName(
  routeName: string | null,
  locale: string,
  {
    defaultLocale,
    strategy,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix,
  }: {
    defaultLocale: string
    strategy: Strategies
    routesNameSeparator: string
    defaultLocaleRouteNameSuffix: string
  },
) {
  let name = getRouteName(routeName) + (strategy === 'no_prefix' ? '' : routesNameSeparator + locale)

  if (locale === defaultLocale && strategy === 'prefix_and_default')
    name += routesNameSeparator + defaultLocaleRouteNameSuffix

  return name
}
