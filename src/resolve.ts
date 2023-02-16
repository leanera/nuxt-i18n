import type { NuxtPage } from '@nuxt/schema'
import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  DEFAULT_ROUTES_NAME_SEPARATOR,
  DEFAULT_STRATEGY,
  DEFAULT_TRAILING_SLASH,
} from './constants'
import type { Strategies } from './types'

export interface ComputedRouteOptions {
  locales: readonly string[]
  paths: Record<string, string>
}

export type RouteOptionsResolver = (
  route: NuxtPage,
  localeCodes: string[]
) => ComputedRouteOptions | null

export interface LocalizeRoutesPrefixableOptions {
  currentLocale: string
  defaultLocale: string
  strategy: Strategies
  isChild: boolean
  path: string
}

export type LocalizeRoutesPrefixable = (
  options: LocalizeRoutesPrefixableOptions
) => boolean

export interface I18nRoutingLocalizationOptions {
  /**
   * The app's default locale
   *
   * @default ''
   */
  defaultLocale?: string
  /**
   * List of locales supported by the app
   *
   * @default []
   */
  locales?: string[]
  /**
   * Routes strategy
   *
   * @remarks
   * Can be set to one of the following:
   *
   * - `no_prefix`: routes won't have a locale prefix
   * - `prefix_except_default`: locale prefix added for every locale except default
   * - `prefix`: locale prefix added for every locale
   * - `prefix_and_default`: locale prefix added for every locale and default
   *
   * @default 'prefix_except_default'
   */
  strategy?: Strategies
  /**
   * Whether to use trailing slash
   *
   * @default false
   */
  trailingSlash?: boolean
  /**
   * Internal separator used for generated route names for each locale
   *
   * @default '___'
   */
  routesNameSeparator?: string
  /**
   * Internal suffix added to generated route names for default locale
   *
   * @default 'default'
   */
  defaultLocaleRouteNameSuffix?: string
  /**
   * Whether to prefix the localize route path with the locale or not
   *
   * @default {@link DefaultLocalizeRoutesPrefixable}
   */
  localizeRoutesPrefixable?: LocalizeRoutesPrefixable
  /**
   * Whether to include uprefixed fallback route
   *
   * @default false
   */
  includeUprefixedFallback?: boolean
  /**
   * Resolver for route localizing options
   *
   * @default undefined
   */
  optionsResolver?: RouteOptionsResolver
}

function adjustRoutePathForTrailingSlash(
  pagePath: string,
  trailingSlash: boolean,
  isChildWithRelativePath: boolean,
) {
  return (
    pagePath.replace(/\/+$/, '') + (trailingSlash ? '/' : '')
    || (isChildWithRelativePath ? '' : '/')
  )
}

function prefixable(options: LocalizeRoutesPrefixableOptions): boolean {
  const { currentLocale, defaultLocale, strategy, isChild, path } = options

  const isDefaultLocale = currentLocale === defaultLocale
  const isChildWithRelativePath = isChild && !path.startsWith('/')

  // No need to add prefix if child's path is relative
  return (
    !isChildWithRelativePath
    // Skip default locale if strategy is `prefix_except_default`
    && !(isDefaultLocale && strategy === 'prefix_except_default')
  )
}

export const DefaultLocalizeRoutesPrefixable = prefixable

/**
 * Localize all routes with given locales
 *
 * @remarks
 * Based on [@intlify/routing](https://github.com/intlify/routing), licensed under MIT
 */
export function localizeRoutes(
  routes: NuxtPage[],
  {
    defaultLocale = DEFAULT_LOCALE,
    strategy = DEFAULT_STRATEGY as Strategies,
    trailingSlash = DEFAULT_TRAILING_SLASH,
    routesNameSeparator = DEFAULT_ROUTES_NAME_SEPARATOR,
    defaultLocaleRouteNameSuffix = DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
    includeUprefixedFallback = false,
    optionsResolver = undefined,
    localizeRoutesPrefixable = DefaultLocalizeRoutesPrefixable,
    locales = [],
  }: I18nRoutingLocalizationOptions = {},
): NuxtPage[] {
  if (strategy === 'no_prefix')
    return routes

  function makeLocalizedRoutes(
    route: NuxtPage,
    allowedLocaleCodes: string[],
    isChild = false,
    isExtraPageTree = false,
  ): NuxtPage[] {
    // Skip route localization
    if (route.redirect && !route.file)
      return [route]

    // Resolve with route (page) options
    let routeOptions: ComputedRouteOptions | null = null
    if (optionsResolver != null) {
      routeOptions = optionsResolver(route, allowedLocaleCodes)
      if (routeOptions == null)
        return [route]
    }

    // Component specific options
    const componentOptions: ComputedRouteOptions = {
      locales,
      paths: {},
    }

    if (routeOptions != null)
      Object.assign(componentOptions, routeOptions)

    Object.assign(componentOptions, { locales: allowedLocaleCodes })

    // Double check locales to remove any locales not found in `pageOptions`
    // This is there to prevent children routes being localized even though they are disabled in the configuration
    if (
      componentOptions.locales.length > 0
      && routeOptions
      && routeOptions.locales != null
      && routeOptions.locales.length > 0
    ) {
      componentOptions.locales = componentOptions.locales.filter(
        locale => routeOptions.locales.includes(locale),
      )
    }

    return componentOptions.locales.reduce<NuxtPage[]>((_routes, locale) => {
      const { name } = route
      let { path } = route
      const localizedRoute = { ...route }

      // Make localized page name
      if (name)
        localizedRoute.name = `${name}${routesNameSeparator}${locale}`

      // Generate localized children routes
      if (route.children) {
        localizedRoute.children = route.children.reduce<NonNullable<NuxtPage['children']>>(
          (children, child) => [
            ...children,
            ...makeLocalizedRoutes(child, [locale], true, isExtraPageTree),
          ],
          [],
        )
      }

      // Get custom path if any
      if (componentOptions.paths && componentOptions.paths[locale])
        path = componentOptions.paths[locale]

      // For `prefix_and_default` strategy and default locale:
      // - if it's a parent page, add it with default locale suffix added (no suffix if page has children)
      // - if it's a child page of that extra parent page, append default suffix to it
      const isDefaultLocale = locale === defaultLocale
      if (isDefaultLocale && strategy === 'prefix_and_default') {
        if (!isChild) {
          const defaultRoute = { ...localizedRoute, path }

          if (name)
            defaultRoute.name = `${localizedRoute.name}${routesNameSeparator}${defaultLocaleRouteNameSuffix}`

          if (route.children) {
            // Recreate child routes with default suffix added
            defaultRoute.children = []
            for (const childRoute of route.children) {
              // `isExtraPageTree` argument is true to indicate that this is extra route added for `prefix_and_default` strategy
              defaultRoute.children.push(
                ...makeLocalizedRoutes(childRoute, [locale], true, true),
              )
            }
          }

          _routes.push(defaultRoute)
        }
        else if (isChild && isExtraPageTree && name) {
          localizedRoute.name += `${routesNameSeparator}${defaultLocaleRouteNameSuffix}`
        }
      }

      const isChildWithRelativePath = isChild && !path.startsWith('/')

      // Add route prefix
      const shouldAddPrefix = localizeRoutesPrefixable({
        isChild,
        path,
        currentLocale: locale,
        defaultLocale,
        strategy,
      })
      if (shouldAddPrefix)
        path = `/${locale}${path}`

      if (path) {
        path = adjustRoutePathForTrailingSlash(
          path,
          trailingSlash,
          isChildWithRelativePath,
        )
      }

      if (shouldAddPrefix && isDefaultLocale && strategy === 'prefix' && includeUprefixedFallback)
        _routes.push({ ...route })

      localizedRoute.path = path
      _routes.push(localizedRoute)

      return _routes
    }, [])
  }

  return routes.reduce<NuxtPage[]>(
    (localized, route) => [
      ...localized,
      ...makeLocalizedRoutes(route, locales || []),
    ],
    [],
  )
}
