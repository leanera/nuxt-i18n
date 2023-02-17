import { fileURLToPath } from 'node:url'
import destr from 'destr'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils'

describe('nuxt-i18n', async () => {
  await setup({
    server: true,
    rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  })

  it('renders the test page correctly for default locale', async () => {
    const html = await $fetch('/en/test')
    const content = getTestResult(html)
    expect(content).toMatchSnapshot()
  })

  it('renders the test page correctly for "de" locale', async () => {
    const html = await $fetch('/de/test')
    const content = getTestResult(html)
    expect(content).toMatchSnapshot()
  })

  it('renders the error page', async () => {
    const html = await $fetch('/not-found')
    expect(html).toContain('<h1>Error</h1>')
  })
})

function getTestResult(html: string) {
  const content = html.match(/<script\s+type="text\/test-result">(.*?)<\/script>/s)?.[1]
  return destr(content)
}
