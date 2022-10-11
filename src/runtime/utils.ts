import { localeMessages } from '#build/i18n.options'

const loadedLocales = new Set<string>()

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
