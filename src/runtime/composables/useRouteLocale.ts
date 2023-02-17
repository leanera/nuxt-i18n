import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import { getLocaleFromRoute } from '../utils'
import { useRoute } from '#imports'

export function useRouteLocale(
  route: string | RouteLocationNormalizedLoaded | RouteLocationNormalized = useRoute(),
) {
  return getLocaleFromRoute(route)
}
