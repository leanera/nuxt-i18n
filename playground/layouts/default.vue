<script setup lang="ts">
const { defaultLocale, locale, locales, t } = useI18n()
const route = useRoute()
const router = useRouter()

const localeSelect = ref(locale.value)

watch(localeSelect, async (newLocale) => {
  const to = useLocalizedPath(route.fullPath, newLocale)

  // Handle special index page (overwritten route in `nuxt.config.ts`)
  const routeMap: Record<string, string> = {
    '/': `/${newLocale}`,
    [`/${defaultLocale}`]: '/',
  }

  router.push(
    routeMap[to] ?? to,
  )
})
</script>

<template>
  <header>
    <h2>@leanera/nuxt-i18n</h2>

    <NuxtLink :to="locale === defaultLocale ? '/' : `/${locale}`">
      {{ t('menu.home') }}
    </NuxtLink>
    /
    <NuxtLink :to="`/${locale}/about`">
      {{ t('menu.about') }}
    </NuxtLink>
    <hr>
    <form>
      <label for="locale-select">{{ t('language') }}:&nbsp;</label>
      <select id="locale-select" v-model="localeSelect">
        <option v-for="i in locales" :key="i" :value="i">
          {{ i }}
        </option>
      </select>
    </form>
  </header>

  <main>
    <slot />
  </main>
</template>
