import { createI18n } from '@leanera/vue-i18n'
import { getLocaleFromRoute, loadLocale } from './utils'
import { addRouteMiddleware, defineNuxtPlugin, useRoute } from '#imports'
import { localeMessages, options } from '#build/i18n.options'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { defaultLocale, locales, messages = {} } = options
  const hasLocaleMessages = Object.keys(localeMessages).length > 0
  const currentLocale = getLocaleFromRoute(useRoute())

  // Loads all locale messages if auto-import is enabled
  if (hasLocaleMessages) {
    // Import all locale messages for SSR
    if (process.server) {
      await Promise.all(locales.map(locale => loadLocale(messages, locale)))
    }
    // Import default locale message for client
    else {
      await loadLocale(messages, defaultLocale)

      // Import locale messages for the current route
      if (currentLocale && locales.includes(currentLocale))
        await loadLocale(messages, currentLocale)
    }
  }

  const i18n = createI18n({
    defaultLocale,
    locales,
    messages,
  })

  // Set current locale
  if (currentLocale && locales.includes(currentLocale))
    i18n.setLocale(currentLocale)

  nuxtApp.vueApp.use(i18n)

  // Add route middleware to load locale messages for the target route
  if (hasLocaleMessages && process.client) {
    addRouteMiddleware(
      'locale-changing',
      async (to) => {
        const targetLocale = getLocaleFromRoute(to)
        if (targetLocale && locales.includes(targetLocale))
          await loadLocale(i18n.messages, targetLocale)

        // Set target locale
        i18n.setLocale(targetLocale)
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
