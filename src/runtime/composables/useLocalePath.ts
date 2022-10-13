import { useRouteLocale } from '#imports'
import { options } from '#build/i18n.options'

export function useLocalePath(path: string, locale?: string): string {
  const currentLocale = useRouteLocale()
  let to = path

  // Normalize target route path
  if (!to.startsWith(`/${currentLocale}`))
    to = `/${currentLocale}${path}`

  return to.replace(
    new RegExp(`^/${useRouteLocale()}`),
    options.strategy !== 'prefix' && locale === options.defaultLocale
      ? ''
      : `/${locale}`,
  )
}
