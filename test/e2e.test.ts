import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils'

describe('nuxt-i18n', async () => {
  await setup({
    server: true,
    rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  })

  it('renders the test page correctly for default locale', async () => {
    const html = await $fetch('/en/test')
    // Extract content from <script type="text/test-result">...</script> but make sure no other script are inside
    const content = html.match(/<script\s+type="text\/test-result">(.*?)<\/script>/s)?.[1]
    expect(content).toMatchSnapshot()
  })

  it('renders the test page correctly for "de" locale', async () => {
    const html = await $fetch('/de/test')
    const content = html.match(/<script\s+type="text\/test-result">(.*?)<\/script>/s)?.[1]
    expect(content).toMatchSnapshot()
  })
})
