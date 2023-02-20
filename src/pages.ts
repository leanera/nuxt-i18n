import { extendPages } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from './module'
import { localizeRoutes } from './routes'
import type { ComputedRouteOptions, RouteOptionsResolver } from './routes'
import { logger } from './utils'

export function setupPages(
  options: Required<ModuleOptions>,
  nuxt: Nuxt,
) {
  const includeUprefixedFallback = nuxt.options._generate

  const optionsResolver: RouteOptionsResolver = (route, localeCodes) => {
    const routeOptions: ComputedRouteOptions = {
      locales: localeCodes,
      paths: {},
    }

    // Set custom localized route paths
    if (Object.keys(options.pages).length) {
      for (const locale of localeCodes) {
        const customPath = options.pages?.[route.name!]?.[locale]
        if (customPath)
          routeOptions.paths[locale] = customPath
      }
    }

    return routeOptions
  }

  extendPages((pages) => {
    const localizedPages = localizeRoutes(pages, {
      ...options,
      includeUprefixedFallback,
      optionsResolver,
    })
    pages.splice(0, pages.length)
    pages.unshift(...localizedPages)

    for (const [key, value] of Object.entries(options.routeOverrides)) {
      const page = pages.find(({ path }) => path === key)
      if (page)
        page.path = value
      else
        logger.error(`Couldn't find page for route override \`${key}\``)
    }
  })
}
