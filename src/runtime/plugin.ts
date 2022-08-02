import { createI18n } from '@leanera/vue-i18n'
import { defineNuxtPlugin } from '#app'
import {
  defaultLocale,
  messages,
} from '#build/i18n.options.mjs'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { vueApp: app } = nuxtApp

  const i18n = createI18n({
    defaultLocale,
    messages,
  })

  app.use(i18n)

  return {
    provide: {
      i18n,
    },
  }
})
