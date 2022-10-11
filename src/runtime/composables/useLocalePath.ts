import { useRouteLocale } from '#imports'
import { options } from '#build/i18n.options'

export function useLocalePath(path: string, locale?: string): string {
  const currentLocale = useRouteLocale()
  let to = path

  // Normalize target route path
  if (!to.startsWith(`/${currentLocale}`))
    to = `/${currentLocale}${path}`

  if (options.strategy === 'prefix') {
    return to.replace(
      new RegExp(`^/${useRouteLocale()}`),
      `/${locale}`,
    )
  }

  return to.replace(
    new RegExp(`^/${useRouteLocale()}`),
    locale === options.defaultLocale ? '' : `/${locale}`,
  )
}
