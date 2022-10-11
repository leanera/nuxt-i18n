import { getLocaleFromRoute } from '../utils'
import { useRoute } from '#imports'

export function useRouteLocale() {
  return getLocaleFromRoute(useRoute())
}
