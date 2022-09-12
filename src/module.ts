import {
  addPluginTemplate,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import { toCode } from './utils'

export interface ModuleOptions {
  defaultLocale: string
  locales: string[]
  messages: Record<string, any>
}

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
    messages: {},
  },
  async setup(moduleOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    // Add i18n plugin
    addPluginTemplate(resolve('runtime/plugin'))

    // Add i18n composables
    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve('runtime/composables'))
    })

    // Load options template
    addTemplate({
      filename: 'i18n.options.mjs',
      getContents() {
        return Object.entries(moduleOptions)
          .map(([rootKey, rootValue]) => `export const ${rootKey} = ${toCode(rootValue)}`)
          .join('\n')
      },
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
