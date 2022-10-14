import { loadLocale } from '../utils'
import { useNuxtApp } from '#imports'

/**
 * Ensures to load the translation messages for the given locale
 * before switching to it
 */
export async function useLazyLocaleSwitch(locale: string) {
  const { locales, messages, setLocale } = useNuxtApp().$i18n
  if (locales.includes(locale))
    await loadLocale(messages, locale)
  setLocale(locale)
}
