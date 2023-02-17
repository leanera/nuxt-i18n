import { assert, describe, it } from 'vitest'
import { adjustRoutePathForTrailingSlash, getLocaleRouteName } from '../../src/utils'

// Adapted from: https://github.com/intlify/routing/blob/166e3c533ee47b40bc08e3af001bef33dcf975ed/packages/vue-i18n-routing/src/__test__/resolve.test.ts
// Credit: Kazuya Kawaguchi, @intlify
// License: MIT
describe('adjustRouteDefinitionForTrailingSlash', () => {
  describe('pagePath: /foo/bar', () => {
    describe('trailingSlash: faawklse, isChildWithRelativePath: true', () => {
      it('should be trailed with slash: /foo/bar/', () => {
        assert.equal(adjustRoutePathForTrailingSlash('/foo/bar', true, true), '/foo/bar/')
      })
    })

    describe('trailingSlash: false, isChildWithRelativePath: true', () => {
      it('should not be trailed with slash: /foo/bar/', () => {
        assert.equal(adjustRoutePathForTrailingSlash('/foo/bar', false, true), '/foo/bar')
      })
    })

    describe('trailingSlash: false, isChildWithRelativePath: false', () => {
      it('should be trailed with slash: /foo/bar/', () => {
        assert.equal(adjustRoutePathForTrailingSlash('/foo/bar', true, false), '/foo/bar/')
      })
    })

    describe('trailingSlash: false, isChildWithRelativePath: false', () => {
      it('should not be trailed with slash: /foo/bar/', () => {
        assert.equal(adjustRoutePathForTrailingSlash('/foo/bar', false, false), '/foo/bar')
      })
    })
  })

  describe('pagePath: /', () => {
    describe('trailingSlash: false, isChildWithRelativePath: true', () => {
      it('should not be trailed with slash: empty', () => {
        assert.equal(adjustRoutePathForTrailingSlash('/', false, true), '')
      })
    })
  })

  describe('pagePath: empty', () => {
    describe('trailingSlash: true, isChildWithRelativePath: true', () => {
      it('should not be trailed with slash: /', () => {
        assert.equal(adjustRoutePathForTrailingSlash('', true, true), '/')
      })
    })
  })
})

describe('getLocaleRouteName', () => {
  describe('strategy: prefix_and_default', () => {
    it('should be `route1___en___default`', () => {
      assert.equal(
        getLocaleRouteName('route1', 'en', {
          defaultLocale: 'en',
          strategy: 'prefix_and_default',
          routesNameSeparator: '___',
          defaultLocaleRouteNameSuffix: 'default',
        }),
        'route1___en___default',
      )
    })
  })

  describe('strategy: prefix_except_default', () => {
    it('should be `route1___en`', () => {
      assert.equal(
        getLocaleRouteName('route1', 'en', {
          defaultLocale: 'en',
          strategy: 'prefix_except_default',
          routesNameSeparator: '___',
          defaultLocaleRouteNameSuffix: 'default',
        }),
        'route1___en',
      )
    })
  })

  describe('strategy: no_prefix', () => {
    it('should be `route1`', () => {
      assert.equal(
        getLocaleRouteName('route1', 'en', {
          defaultLocale: 'en',
          strategy: 'no_prefix',
          routesNameSeparator: '___',
          defaultLocaleRouteNameSuffix: 'default',
        }),
        'route1',
      )
    })
  })

  describe('irregular', () => {
    describe('route name is null', () => {
      it('should be ` (null)___en___default`', () => {
        assert.equal(
          getLocaleRouteName(null, 'en', {
            defaultLocale: 'en',
            strategy: 'prefix_and_default',
            routesNameSeparator: '___',
            defaultLocaleRouteNameSuffix: 'default',
          }),
          '(null)___en___default',
        )
      })
    })
  })
})
