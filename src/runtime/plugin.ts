import { createI18n } from '@leanera/vue-i18n'
import { getLocaleFromRoute, loadLocale } from './utils'
import { addRouteMiddleware, defineNuxtPlugin, useRoute } from '#imports'
import { localeMessages, options } from '#build/i18n.options'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { defaultLocale, lazy, locales, messages, strategy } = options
  const hasLocaleMessages = Object.keys(localeMessages).length > 0
  const currentLocale = getLocaleFromRoute(useRoute())

  // Loads all locale messages if auto-import is enabled
  if (hasLocaleMessages) {
    // Import all locale messages for SSR, if `lazy` is disabled or `strategy` is `no_prefix`
    if (process.server || !lazy || strategy === 'no_prefix') {
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

  nuxtApp.vueApp.use(i18n)

  // Set locale from the current route
  if (currentLocale && locales.includes(currentLocale))
    i18n.setLocale(currentLocale)

  // Add route middleware to load locale messages for the target route
  if (process.client && hasLocaleMessages && lazy && strategy !== 'no_prefix') {
    addRouteMiddleware(
      'locale-changing',
      async (to) => {
        const targetLocale = getLocaleFromRoute(to)
        if (targetLocale && locales.includes(targetLocale)) {
          await loadLocale(i18n.messages, targetLocale)
          i18n.setLocale(targetLocale)
        }
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
