/* eslint-disable antfu/top-level-function */
import type {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router'
import {
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  localeMessages,
  options,
} from '#build/i18n.options'

const CONSOLE_PREFIX = '[nuxt-i18n]'
const loadedLocales = new Set<string>()

const isString = (val: unknown): val is string => typeof val === 'string'
const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

const getLocalesRegex = (localeCodes: string[]) =>
  new RegExp(`^/(${localeCodes.join('|')})(?:/|$)`, 'i')

/**
 * Extract locale code from a given route:
 * - If route has a name, try to extract locale from it
 * - Otherwise, fall back to using the routes' path
 */
export function getLocaleFromRoute(
  route: string | RouteLocationNormalizedLoaded | RouteLocationNormalized,
  {
    localeCodes = options.locales,
    routesNameSeparator = DEFAULT_ROUTES_NAME_SEPARATOR,
    defaultLocaleRouteNameSuffix = DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  } = {},
): string {
  const localesPattern = `(${localeCodes.join('|')})`
  const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`
  const regexpName = new RegExp(
    `${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`,
    'i',
  )
  const regexpPath = getLocalesRegex(localeCodes)

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

/**
 * Resolves an async locale message import
 */
export async function loadMessages(locale: string) {
  let messages: Record<string, any> = {}
  const loader = localeMessages[locale]

  if (!loader) {
    console.warn(CONSOLE_PREFIX, `No locale messages found for locale "${locale}"`)
    return
  }

  try {
    messages = await loader().then((r: any) => r.default || r)
  }
  catch (e) {
    console.error(CONSOLE_PREFIX, 'Failed loading locale messages:', (e as any).message)
  }

  return messages
}

/**
 * Loads a locale message if not already loaded
 */
export async function loadLocale(
  messages: Record<string, any>,
  locale: string,
) {
  if (loadedLocales.has(locale))
    return

  const result = await loadMessages(locale)
  if (result) {
    messages[locale] = result
    loadedLocales.add(locale)
  }
}
