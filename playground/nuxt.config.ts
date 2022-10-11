export default defineNuxtConfig({
  modules: ['../src/module'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    langImports: true,
    strategy: 'prefix',
    routeOverrides: {
      // Set default locale's index page as the app's root page
      '/en': '/',
      // Use `en` catch-all page for all other locales
      '/en/:id(.*)*': '/:id(.*)*',
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },
})
