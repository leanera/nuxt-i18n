import { loadLocale } from '../utils'
import { useNuxtApp } from '#imports'

/**
 * Ensures to load the translation messages for the given locale
 * before switching to it
 */
export async function useLazyLocaleSwitch(newLocale: string) {
  const { locales, messages, setLocale } = useNuxtApp().$i18n
  if (locales.includes(newLocale))
    await loadLocale(messages, newLocale)
  setLocale(newLocale)
}
