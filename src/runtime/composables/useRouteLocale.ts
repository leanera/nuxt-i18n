import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import { getLocaleFromRoute } from '../utils'
import { useRoute } from '#imports'

export function useRouteLocale(
  route: RouteLocationNormalizedLoaded | RouteLocationNormalized | string = useRoute(),
) {
  return getLocaleFromRoute(route)
}
