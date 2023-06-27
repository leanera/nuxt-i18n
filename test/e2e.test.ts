import { fileURLToPath } from 'node:url'
import { destr } from 'destr'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils'

describe('nuxt-i18n', async () => {
  await setup({
    server: true,
    rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  })

  it('renders message for default locale', async () => {
    const html = await $fetch('/en/test')
    const content = getTestResult(html)
    expect(content).toMatchSnapshot()
  })

  it('renders message for "de"', async () => {
    const html = await $fetch('/de/test')
    const content = getTestResult(html)
    expect(content).toMatchSnapshot()
  })

  it('builds routes tree', async () => {
    const html = await $fetch('/en/test/routes')
    const content = getTestResult(html)
    expect(content).toMatchSnapshot()
  })

  it('returns composables data for default locale', async () => {
    const html = await $fetch('/en/test/composables')
    const content = getTestResult(html)
    expect(content).toMatchSnapshot()
  })

  it('returns composables data for "de"', async () => {
    const html = await $fetch('/de/test/composables')
    const content = getTestResult(html)
    expect(content).toMatchSnapshot()
  })

  it('contains i18n data', async () => {
    const html = await $fetch('/en/test/i18n')
    const content = getTestResult(html)
    expect(content).toMatchSnapshot()
  })

  it('renders the error page', async () => {
    const html = await $fetch('/not-found')
    expect(html).toMatch(/<h1.*?>Error<\/h1>/)
  })
})

function getTestResult(html: string) {
  const content = html.match(/<script\s+type="text\/test-result">(.*?)<\/script>/s)?.[1]
  return destr(content)
}
