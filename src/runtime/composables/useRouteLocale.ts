import { DEFAULT_LOCALE_ROUTE_NAME_SUFFIX, DEFAULT_ROUTES_NAME_SEPARATOR, createLocaleFromRouteGetter } from 'vue-i18n-routing'
import { options } from '#build/i18n.options'
import { useRoute } from '#imports'

export function useRouteLocale() {
  const getLocaleFromRoute = createLocaleFromRouteGetter(
    options.locales,
    DEFAULT_ROUTES_NAME_SEPARATOR,
    DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  )
  return getLocaleFromRoute(useRoute())
}
