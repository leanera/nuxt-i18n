import { defineNuxtConfig } from 'nuxt'
import nuxtI18n from '../src/module'
import de from './locales/de.json'
import en from './locales/en.json'

export default defineNuxtConfig({
  modules: [nuxtI18n],

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
    shim: false,
  },
})
