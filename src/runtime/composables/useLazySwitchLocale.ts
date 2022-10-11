import { loadLocale } from '../utils'
import { useNuxtApp } from '#imports'

/**
 * Ensures to load the locale messages for the given locale
 * before switching to it
 */
export async function useLazySwitchLocale(newLocale: string) {
  const { locales, messages, setLocale } = useNuxtApp().$i18n
  if (locales.includes(newLocale))
    await loadLocale(messages, newLocale)
  setLocale(newLocale)
}
