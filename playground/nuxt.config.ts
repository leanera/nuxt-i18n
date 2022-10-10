export default defineNuxtConfig({
  modules: ['../src/module'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    langImports: true,
    strategy: 'prefix',
    routeOverrides: {
      // Set default locale index page as the app's homepage
      '/en': '/',
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },
})
