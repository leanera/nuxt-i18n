# @leanera/nuxt-i18n

[![npm version](https://img.shields.io/npm/v/@leanera/nuxt-i18n?color=a1b858&label=)](https://www.npmjs.com/package/@leanera/nuxt-i18n)

> Lightweight internationalization module for [Nuxt 3](https://v3.nuxtjs.org).

## Setup

```bash
# pnpm
pnpm add -D @leanera/nuxt-i18n

# npm
npm i -D @leanera/nuxt-i18n
```

## Usage

Add `@leanera/nuxt-i18n` to your `nuxt.confg.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@leanera/nuxt-i18n'],
})
```

### Locale Messages

You can manually load and add your translations:

```ts
import de from './locales/de.json'
import en from './locales/en.json'

export default defineNuxtConfig({
  // ...
  i18n: {
    messages: {
      de,
      en,
    },
  },
})
```

The following is a set of files of locale resources defined in the directory:

```sh
-| app/
---| nuxt.config.js
---| package.json
---| locales/
------| en.json/
------| de.json/
```

The locale messages defined above will be loaded by the `@leanera/nuxt-i18n` module and set to the `messages` option when initializing `@leanera/vue-i18n` with `createI18n()`.

## Configuration

The `@leanera/nuxt-i18n` options can be specified in the `i18n` configuration key.

```ts
export default defineNuxtConfig({
  i18n: {
    defaultLocale: 'en',
    messages: {
      en: {
        hello: 'Hello',
      },
      de: {
        hello: 'Hallo',
      },
    },
  },
})
```

## 💻 Development

1. Clone this repository
2. Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
3. Install dependencies using `pnpm install`
4. Run `pnpm run dev:prepare`
5. Start development server using `pnpm run dev`

## License

[MIT](./LICENSE) License © 2022 [LeanERA GmbH](https://github.com/leanera)
