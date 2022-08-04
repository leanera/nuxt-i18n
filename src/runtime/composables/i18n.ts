import type { I18nInstance } from '@leanera/vue-i18n'

export function useI18n() {
  return useNuxtApp().$i18n as Omit<I18nInstance, 'install'>
}
