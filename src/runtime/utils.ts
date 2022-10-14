import { DEFAULT_LOCALE_ROUTE_NAME_SUFFIX, DEFAULT_ROUTES_NAME_SEPARATOR, createLocaleFromRouteGetter } from 'vue-i18n-routing'
import { localeMessages, options } from '#build/i18n.options'

const CONSOLE_PREFIX = '[nuxt-i18n]'
const loadedLocales = new Set<string>()

export const getLocaleFromRoute = createLocaleFromRouteGetter(
  options.locales,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
)

// Resolves an async locale message import
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

// Loads a locale message if not already loaded
export async function loadLocale(messages: Record<string, any>, locale: string) {
  if (loadedLocales.has(locale))
    return

  const result = await loadMessages(locale)
  if (result) {
    messages[locale] = result
    loadedLocales.add(locale)
  }
}
