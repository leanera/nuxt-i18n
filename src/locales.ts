import { parse } from 'pathe'
import { resolveFiles } from '@nuxt/kit'
import type { LocaleInfo } from './types'

export async function resolveLocales(path: string): Promise<LocaleInfo[]> {
  const files = await resolveFiles(path, '**/*{json,json5,yaml,yml}')
  return files.map((file) => {
    const parsed = parse(file)
    return {
      path: file,
      file: parsed.base,
      code: parsed.name,
    }
  })
}
