import { isCI } from 'std-env'

export default defineNuxtConfig({
  modules: ['../src/module.ts'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    langImports: true,
    lazy: true,
    strategy: 'prefix',
    pages: {
      about: {
        de: '/ueber-uns',
      },
    },
    routeOverrides: {
      // Use `en` catch-all page as fallback for all other locales
      '/en/:id(.*)*': '/:id(.*)*',
    },
    logs: true,
  },

  typescript: {
    typeCheck: !isCI,
    shim: false,
  },
})
