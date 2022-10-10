import { resolve as pathResolve } from 'pathe'
import { addImportsDir, addPluginTemplate, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { genDynamicImport, genImport, genSafeVariableName } from 'knitwork'
import type { I18nRoutingOptions } from 'vue-i18n-routing'
import { setupPages } from './pages'
import { resolveLocales } from './locales'
import { toCode } from './utils'
import type { LocaleInfo } from './types'

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
   * It's recommended to set this to some locale regardless of chosen strategy, as it will be used as a fallback locale when navigating to a non-existent route
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
   * Can be left empty if auto-importing of locales is enabled
   *
   * @default {}
   */
  messages?: Record<string, any>

  /**
   * Custom route overrides for the generated routes
   *
   * @example
   * routeOverrides: {
   *   // Set `en` (default locale) index page as the app's root page
   *   '/en': '/',
   * }
   *
   * @default {}
   */
  routeOverrides?: Record<string, string>

  /**
   * Localize route paths for a given locale
   *
   * @default {}
   */
  // pages?: CustomRoutePages
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
    defaultLocale: 'en',
    locales: [],
    langDir: 'locales',
    langImports: false,
    messages: {},
    strategy: 'no_prefix',
    // pages: {},
    routeOverrides: {},
    lazy: true,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const langPath = options.langImports && options.langDir ? pathResolve(nuxt.options.srcDir, options.langDir!) : undefined
    const localeInfo = langPath ? await resolveLocales(langPath) : []

    const syncLocaleFiles = new Set<LocaleInfo>()
    const asyncLocaleFiles = new Set<LocaleInfo>()

    if (langPath) {
      // Synchronously import locale messages for the default locale
      if (options.defaultLocale) {
        const localeObject = localeInfo.find(({ code }) => code === options.defaultLocale)
        if (localeObject)
          syncLocaleFiles.add(localeObject)
      }

      // Asynchronously import locale messages for the other locales
      for (const locale of localeInfo) {
        if (!syncLocaleFiles.has(locale) && !asyncLocaleFiles.has(locale))
          (options.lazy ? asyncLocaleFiles : syncLocaleFiles).add(locale)
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
  },
})
