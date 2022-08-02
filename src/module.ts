import {
  addPluginTemplate,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { I18nInstance } from '@leanera/vue-i18n'
import type { NuxtI18nOptions } from './types'
import { generateLoaderOptions } from './gen'

declare module '@nuxt/kit' {
  interface NuxtApp {
    $i18n: I18nInstance
  }
}

export default defineNuxtModule<NuxtI18nOptions>({
  meta: {
    name: '@leanera/nuxt-i18n',
    configKey: 'i18n',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false,
    },
  },
  defaults: {
    defaultLocale: 'en',
    locales: [],
    messages: {},
  },
  async setup(moduleOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    // Add Nuxt plugin
    addPluginTemplate(resolve('runtime/plugin'))

    // Load options template
    addTemplate({
      filename: 'i18n.options.mjs',
      getContents: () => generateLoaderOptions(moduleOptions),
    })

    addTemplate({
      filename: 'i18n.options.d.ts',
      write: true,
      getContents() {
        return `
export declare const defaultLocale: string
export declare const locales: string[]
export declare const messages: Record<string, any>
`.trimStart()
      },
    })
  },
})
