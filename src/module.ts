import { resolve as pathResolve } from 'pathe'
import { genDynamicImport, genImport, genSafeVariableName } from 'knitwork'
import { addImportsDir, addPluginTemplate, addTemplate, createResolver, defineNuxtModule, extendViteConfig, resolveModule } from '@nuxt/kit'
import type { LocaleMessages } from '@leanera/vue-i18n'
import type { I18nRoutingOptions } from 'vue-i18n-routing'
import { resolveLocales } from './locales'
import { setupPages } from './pages'
import { logger, toCode } from './utils'
import type { CustomRoutePages, LocaleInfo } from './types'

export type ModuleOptions = {
  /**
   * List of locales supported by your app
   *
   * @remarks
   * Intended to be an array of string codes, e.g. `['en', 'fr']`
   *
   * @default []
   */
  locales?: string[]

  /**
   * The app's default locale
   *
   * @remarks
   * It's recommended to set this to some locale regardless of the chosen strategy, as it will be used as a fallback locale
   *
   * @default 'en'
   */
  defaultLocale?: string

  /**
   * Directory where your locale files are stored
   *
   * @remarks
   * Expected to be a relative path from the project root
   *
   * @default 'locales'
   */
  langDir?: string

  /**
   * Whether to enable locale auto-importing
   *
   * @remarks
   * When enabled, the module will automatically import all locale files from the `langDir` directory
   *
   * @default false
   */
  langImports?: boolean

  /**
   * Whether to lazily load locale messages in the client
   *
   * @remarks
   * If enabled, locale messages will be loaded on demand when the user navigates to a route with a different locale
   *
   * This has no effect if `strategy` is set to `no_prefix` or the `langImports` option is disabled
   *
   * @default true
   */
  lazy?: boolean

  /**
   * The app's default messages
   *
   * @remarks
   * Can be omitted if auto-importing of locales is enabled
   *
   * @default {}
   */
  messages?: LocaleMessages

  /**
   * Customize route paths for specific locale
   *
   * @remarks
   * Intended to translate URLs in addition to having them prefixed with the locale code
   *
   * @example
   * pages: {
   *   about: {
   *     en: '/about-us', // Accessible at `/about-us` (no prefix with `prefix_and_default` since it's the default locale)
   *     fr: '/a-propos', // Accessible at `/fr/a-propos`
   *     es: '/sobre'     // Accessible at `/es/sobre`
   *   }
   * }
   * @default {}
   */
  pages?: CustomRoutePages

  /**
   * Custom route overrides for the generated routes
   *
   * @example
   * routeOverrides: {
   *   // Set default locale's index page as the app's root page
   *   '/en': '/',
   * }
   *
   * @default {}
   */
  routeOverrides?: Record<string, string>
} & Pick<I18nRoutingOptions, 'strategy'>

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@leanera/nuxt-i18n',
    configKey: 'i18n',
    compatibility: {
      nuxt: '^3',
      bridge: false,
    },
  },
  defaults: {
    defaultLocale: '',
    locales: [],
    langDir: 'locales',
    langImports: false,
    messages: {},
    strategy: 'no_prefix',
    pages: {},
    routeOverrides: {},
    lazy: true,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const langPath = options.langImports && options.langDir ? pathResolve(nuxt.options.srcDir, options.langDir!) : undefined
    const localeInfo = langPath ? await resolveLocales(langPath) : []

    if (!options.defaultLocale) {
      logger.warn('Missing default locale, falling back to `en`')
      options.defaultLocale = 'en'
    }

    if (!options.locales?.length) {
      logger.warn('Locales option is empty, falling back to using the default locale only')
      options.locales = [options.defaultLocale]
    }

    const syncLocaleFiles = new Set<LocaleInfo>()
    const asyncLocaleFiles = new Set<LocaleInfo>()

    if (langPath) {
      // Synchronously import locale messages for the default locale
      if (options.defaultLocale) {
        const localeObject = localeInfo.find(({ code }) => code === options.defaultLocale)
        if (localeObject)
          syncLocaleFiles.add(localeObject)
      }

      // Import locale messages for the other locales
      for (const locale of localeInfo) {
        if (!syncLocaleFiles.has(locale) && !asyncLocaleFiles.has(locale)) {
          (options.strategy !== 'no_prefix' && options.lazy
            ? asyncLocaleFiles
            : syncLocaleFiles
          ).add(locale)
        }
      }
    }

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    // Setup internationalized Nuxt pages
    if (options.strategy !== 'no_prefix' && options.locales?.length)
      setupPages(options as Required<ModuleOptions>, nuxt)

    // Add i18n plugin
    addPluginTemplate(resolve('runtime/plugin'))

    // Add i18n composables
    addImportsDir(resolve('runtime/composables'))

    // Load options template
    addTemplate({
      filename: 'i18n.options.mjs',
      getContents() {
        return `
${[...syncLocaleFiles]
  .map(({ code, path }) => genImport(path, genSafeVariableName(`locale_${code}`)))
  .join('\n')}
export const options = {${Object.entries(options)
  .map(([key, value]) => `${key}: ${toCode(value)}`)
  .join(',')}};
export const localeMessages = {
${[...syncLocaleFiles]
  .map(({ code }) => `  ${toCode(code)}: () => Promise.resolve(${genSafeVariableName(`locale_${code}`)}),`)
  .join('\n')}
${[...asyncLocaleFiles]
  .map(({ code, path }) => `  ${toCode(code)}: ${genDynamicImport(path)},`)
  .join('\n')}
};
`.trimStart()
      },
    })

    addTemplate({
      filename: 'i18n.options.d.ts',
      getContents() {
        return `
${genImport(resolve('module'), ['ModuleOptions'])}
export declare const options: Required<ModuleOptions>;
export declare const localeMessages: Record<string, () => Promise<Record<string, any>>>;
`.trimStart()
      },
    })

    // Reduce bundle size for `vue-i18n` from @intlify, although not bundled
    // into the final app, only used by `vue-i18n-routing`. Therefore, some
    // console warnings about the bundle size of `vue-i18n` will be shown,
    // which we want to suppress.
    extendViteConfig((config) => {
      config.define = config.define || {}
      config.define.__VUE_I18N_FULL_INSTALL__ = 'false'
      config.define.__VUE_I18N_LEGACY_API__ = 'false'
      config.define.__INTLIFY_PROD_DEVTOOLS__ = 'false'
    })
  },
})
