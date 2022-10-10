import type { UseI18n } from '@leanera/vue-i18n'
import { useNuxtApp } from '#imports'
import { localeMessages } from '#build/i18n.options'

export async function useLazySwitchLocale(newLocale: string) {
  const { messages, setLocale } = useNuxtApp().$i18n as UseI18n
  const loader = localeMessages[newLocale]

  // Load locale messages for the new locale
  if (loader && !messages[newLocale]) {
    try {
      const localeMessages = await loader().then((r: any) => r.default || r)
      Object.assign(messages, { [newLocale]: localeMessages })
    }
    catch (e: any) {
      console.error('[nuxt-i18n', 'Failed locale loading:', e.message)
    }
  }

  setLocale(newLocale)
}
