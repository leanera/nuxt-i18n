import { describe, expect, it } from 'vitest'
import type { NuxtPage } from '@nuxt/schema'
import { DEFAULT_ROUTES_NAME_SEPARATOR } from '../../src/constants'
import { localizeRoutes } from '../../src/routes'

// Adapted from: https://github.com/intlify/routing/blob/166e3c533ee47b40bc08e3af001bef33dcf975ed/packages/vue-i18n-routing/src/__test__/resolve.test.ts
// Credit: Kazuya Kawaguchi, @intlify
// License: MIT
describe('localizeRoutes', () => {
  describe('basic', () => {
    it('should be localized routing', () => {
      const routes: NuxtPage[] = [
        {
          path: '/',
          name: 'home',
        },
        {
          path: '/about',
          name: 'about',
        },
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, {
        locales: localeCodes,
      })

      expect(localizedRoutes).toMatchSnapshot()
      expect(localizedRoutes.length).to.equal(4)

      for (const locale of localeCodes) {
        for (const route of routes) {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}`,
            name: `${route.name}${DEFAULT_ROUTES_NAME_SEPARATOR}${locale}`,
          })
        }
      }
    })
  })

  describe('has children', () => {
    it('should be localized routing', () => {
      const routes: NuxtPage[] = [
        {
          path: '/user/:id',
          name: 'user',
          children: [
            {
              path: 'profile',
              name: 'user-profile',
            },
            {
              path: 'posts',
              name: 'user-posts',
            },
          ],
        },
      ]
      const children = routes[0].children

      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, {
        locales: localeCodes,
      })

      expect(localizedRoutes).toMatchSnapshot()
      expect(localizedRoutes.length).to.equal(2)

      for (const locale of localeCodes) {
        for (const route of routes) {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}`,
            name: `${route.name}${DEFAULT_ROUTES_NAME_SEPARATOR}${locale}`,
            children: children.map(child => ({
              path: child.path,
              name: `${child.name}${DEFAULT_ROUTES_NAME_SEPARATOR}${locale}`,
            })),
          })
        }
      }
    })
  })

  describe('trailing slash', () => {
    it('should be localized routing', () => {
      const routes: NuxtPage[] = [
        {
          path: '/',
          name: 'home',
        },
        {
          path: '/about',
          name: 'about',
        },
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, {
        locales: localeCodes,
        trailingSlash: true,
      })

      expect(localizedRoutes).toMatchSnapshot()
      expect(localizedRoutes.length).to.equal(4)

      for (const locale of localeCodes) {
        for (const route of routes) {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}/`,
            name: `${route.name}${DEFAULT_ROUTES_NAME_SEPARATOR}${locale}`,
          })
        }
      }
    })
  })

  describe('route name separator', () => {
    it('should be localized routing', () => {
      const routes: NuxtPage[] = [
        {
          path: '/',
          name: 'home',
        },
        {
          path: '/about',
          name: 'about',
        },
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, {
        locales: localeCodes,
        routesNameSeparator: '__',
      })

      expect(localizedRoutes).toMatchSnapshot()
      expect(localizedRoutes.length).to.equal(4)

      for (const locale of localeCodes) {
        for (const route of routes) {
          expect(localizedRoutes).to.deep.include({
            path: `/${locale}${route.path === '/' ? '' : route.path}`,
            name: `${route.name}${'__'}${locale}`,
          })
        }
      }
    })
  })

  describe('strategy: "prefix_and_default"', () => {
    it('should be localized routing', () => {
      const routes: NuxtPage[] = [
        {
          path: '/',
          name: 'home',
        },
        {
          path: '/about',
          name: 'about',
        },
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, {
        defaultLocale: 'en',
        strategy: 'prefix_and_default',
        locales: localeCodes,
      })

      expect(localizedRoutes).toMatchSnapshot()
    })
  })

  describe('strategy: "prefix_except_default"', () => {
    it('should be localized routing', () => {
      const routes: NuxtPage[] = [
        {
          path: '/',
          name: 'home',
        },
        {
          path: '/about',
          name: 'about',
        },
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, {
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        locales: localeCodes,
      })

      expect(localizedRoutes).toMatchSnapshot()
    })
  })

  describe('strategy: "prefix"', () => {
    it('should be localized routing', () => {
      const routes: NuxtPage[] = [
        {
          path: '/',
          name: 'home',
        },
        {
          path: '/about',
          name: 'about',
        },
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, {
        defaultLocale: 'en',
        strategy: 'prefix',
        locales: localeCodes,
        includeUprefixedFallback: true,
      })

      expect(localizedRoutes).toMatchSnapshot()
    })
  })

  describe('strategy: "no_prefix"', () => {
    it('should be localized routing', () => {
      const routes: NuxtPage[] = [
        {
          path: '/',
          name: 'home',
        },
        {
          path: '/about',
          name: 'about',
        },
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, {
        defaultLocale: 'en',
        strategy: 'no_prefix',
        locales: localeCodes,
      })

      expect(localizedRoutes).toMatchSnapshot()
    })
  })

  describe('Route optiosn resolver: routing disable', () => {
    it('should be disabled routing', () => {
      const routes: NuxtPage[] = [
        {
          path: '/',
          name: 'home',
        },
        {
          path: '/about',
          name: 'about',
        },
      ]
      const localeCodes = ['en', 'ja']
      const localizedRoutes = localizeRoutes(routes, {
        locales: localeCodes,
        optionsResolver: () => null,
      })

      expect(localizedRoutes).toMatchSnapshot()
    })
  })
})
