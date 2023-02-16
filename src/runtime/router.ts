import type {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router'

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
    if (typeof route === 'object' && route !== null) {
      if (route.name) {
        const name = typeof route.name === 'string' ? route.name : route.name.toString()
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
    else if (typeof route === 'string') {
      const matches = route.match(regexpPath)
      if (matches && matches.length > 1)
        return matches[1]
    }

    return ''
  }

  return getLocaleFromRoute
}
