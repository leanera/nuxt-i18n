export default defineNuxtConfig({
  modules: ['../src/module'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    langImports: true,
    strategy: 'prefix',
    routeOverrides: {
      // Set `en` (default locale) index page as the app's root page
      '/en': '/',
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },
})
