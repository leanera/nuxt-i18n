import { createI18n } from '@leanera/vue-i18n'
import { createLocaleFromRouteGetter } from 'vue-i18n-routing'
import { addRouteMiddleware, defineNuxtPlugin, useRoute } from '#imports'
import { localeMessages, options } from '#build/i18n.options'

const loadedLocales = new Set<string>()

export default defineNuxtPlugin(async (nuxtApp) => {
  const { defaultLocale, langImports, locales, messages = {} } = options
  const hasLocaleMessages = Object.keys(localeMessages).length > 0

  // Constants taken from `vue-i18n-routing`
  const routesNameSeparator = '___'
  const defaultLocaleRouteNameSuffix = 'default'
  const getLocaleFromRoute = createLocaleFromRouteGetter(locales, routesNameSeparator, defaultLocaleRouteNameSuffix)
  const currentLocale = getLocaleFromRoute(useRoute())

  // Resolves an async locale message import
  async function loadMessage(locale: string) {
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
  async function loadLocale(locale: string) {
    if (loadedLocales.has(locale))
      return

    const message = await loadMessage(locale)
    if (message != null) {
      Object.assign(messages, { [locale]: message })
      loadedLocales.add(locale)
    }
  }

  // Loads all locale messages if auto-import is enabled
  if (langImports && hasLocaleMessages) {
    // Import all locale messages for SSR
    if (process.server) {
      await Promise.all(locales.map(locale => loadLocale(locale)))
    }
    // Import default locale message for client
    else {
      await loadLocale(defaultLocale)

      // Import locale messages for the current route
      if (currentLocale && locales.includes(currentLocale))
        await loadLocale(currentLocale)
    }
  }

  const i18n = createI18n({
    defaultLocale,
    messages,
  })

  // Set current locale
  if (currentLocale && locales.includes(currentLocale))
    i18n.setLocale(currentLocale)

  nuxtApp.vueApp.use(i18n)

  // Add route middleware to load locale messages for the target route
  if (langImports && hasLocaleMessages && process.client) {
    addRouteMiddleware(
      'locale-changing',
      async (to) => {
        const targetLocale = getLocaleFromRoute(to)
        if (targetLocale && locales.includes(targetLocale))
          await loadLocale(targetLocale)
      },
      { global: true },
    )
  }

  return {
    provide: {
      i18n,
    },
  }
})
