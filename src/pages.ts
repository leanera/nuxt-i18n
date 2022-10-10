import { extendPages } from '@nuxt/kit'
import { localizeRoutes } from 'vue-i18n-routing'
import type { Nuxt, NuxtPage } from '@nuxt/schema'
import type { ComputedRouteOptions, RouteOptionsResolver } from 'vue-i18n-routing'
import type { ModuleOptions } from './module'

export function setupPages(
  options: Required<ModuleOptions>,
  nuxt: Nuxt,
) {
  let includeUprefixedFallback = nuxt.options.target === 'static'
  nuxt.hook('generate:before', () => {
    includeUprefixedFallback = true
  })

  extendPages((pages) => {
    const localizedPages = localizeRoutes(pages, {
      ...options,
      includeUprefixedFallback,
      optionsResolver: getRouteOptionsResolver(options),
    })
    pages.splice(0, pages.length)
    pages.unshift(...(localizedPages as NuxtPage[]))

    for (const [key, value] of Object.entries(options.routeOverrides)) {
      const page = pages.find(({ path }) => path === key)
      if (page)
        page.path = value
    }

    // if (nuxt.options.dev)
    //   logger.info('Localized pages:', pages)
  })
}

function getRouteOptionsResolver(moduleOptions: Required<ModuleOptions>): RouteOptionsResolver {
  return function (route, localeCodes): ComputedRouteOptions | null {
    const options: ComputedRouteOptions = {
      locales: localeCodes,
      paths: {},
    }

    // Set custom localized route paths
    if (Object.keys(moduleOptions.pages).length > 0) {
      for (const locale of options.locales) {
        const customPath = moduleOptions.pages[route.path]?.[locale]
        if (customPath)
          options.paths[locale] = customPath
      }
    }

    return options
  }
}
