import type {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router'

export const isString = (val: unknown): val is string => typeof val === 'string'
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export function getLocalesRegex(localeCodes: string[]) {
  return new RegExp(`^/(${localeCodes.join('|')})(?:/|$)`, 'i')
}

export function createLocaleFromRouteGetter(
  localeCodes: string[],
  routesNameSeparator: string,
  defaultLocaleRouteNameSuffix: string,
) {
  const localesPattern = `(${localeCodes.join('|')})`
  const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`
  const regexpName = new RegExp(
    `${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`,
    'i',
  )
  const regexpPath = getLocalesRegex(localeCodes)

  /**
   * Extract locale code from a given route:
   * - if route has a name, try to extract locale from it
   * - otherwise, fall back to using the routes' path
   */
  function getLocaleFromRoute(
    route: string | RouteLocationNormalizedLoaded | RouteLocationNormalized,
  ): string {
    // Extract from route name
    if (isObject(route)) {
      if (route.name) {
        const name = isString(route.name) ? route.name : route.name.toString()
        const matches = name.match(regexpName)
        if (matches && matches.length > 1)
          return matches[1]
      }
      else if (route.path) {
        // Extract from path
        const matches = route.path.match(regexpPath)
        if (matches && matches.length > 1)
          return matches[1]
      }
    }
    else if (isString(route)) {
      const matches = route.match(regexpPath)
      if (matches && matches.length > 1)
        return matches[1]
    }

    return ''
  }

  return getLocaleFromRoute
}
