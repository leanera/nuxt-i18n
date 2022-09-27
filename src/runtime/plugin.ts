import { createI18n } from '@leanera/vue-i18n'
import { defineNuxtPlugin } from '#imports'
import { defaultLocale, messages } from '#build/i18n.options'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    defaultLocale,
    messages,
  })

  nuxtApp.vueApp.use(i18n)

  return {
    provide: {
      i18n,
    },
  }
})
