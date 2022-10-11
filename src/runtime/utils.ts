import { DEFAULT_LOCALE_ROUTE_NAME_SUFFIX, DEFAULT_ROUTES_NAME_SEPARATOR, createLocaleFromRouteGetter } from 'vue-i18n-routing'
import { localeMessages, options } from '#build/i18n.options'

const loadedLocales = new Set<string>()

export const getLocaleFromRoute = createLocaleFromRouteGetter(
  options.locales,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
)

// Resolves an async locale message import
export async function loadMessage(locale: string) {
  let messages: Record<string, any> = {}
  const loader = localeMessages[locale]

  if (loader) {
    try {
      messages = await loader().then((r: any) => r.default || r)
    }
    catch (e: any) {
      console.error('[nuxt-i18n]', 'Failed locale loading:', e.message)
    }
  }
  else {
    console.warn('[nuxt-i18n]', `Could not find "${locale}" locale`)
  }

  return messages
}

// Loads a locale message if not already loaded
export async function loadLocale(messages: Record<string, any>, locale: string) {
  if (loadedLocales.has(locale))
    return

  const message = await loadMessage(locale)
  if (message != null) {
    Object.assign(messages, { [locale]: message })
    loadedLocales.add(locale)
  }
}
