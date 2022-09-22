import de from './locales/de.json'
import en from './locales/en.json'

export default defineNuxtConfig({
  modules: ['../src/module'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    messages: {
      en: {
        ...en,
        title: '@leanera/nuxt-i18n (overwritten by nuxt.config.ts)',
      },
      de: {
        ...de,
        title: '@leanera/nuxt-i18n (überschrieben von nuxt.config.ts)',
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },
})
