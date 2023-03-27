<script setup lang="ts">
const { locale, locales, t } = useI18n()
const route = useRoute()

const localeSelect = ref(locale.value)
const routeMap: Record<string, Record<string, string>> = {
  about: {
    en: '/about',
    de: '/ueber-uns',
  },
}

watch(localeSelect, async (newLocale) => {
  const to = useLocalizedPath(route.fullPath, newLocale)
  // eslint-disable-next-line no-console
  console.log(to)

  await navigateTo(
    `/${newLocale}`,
  )
})
</script>

<template>
  <header>
    <h2>@leanera/nuxt-i18n</h2>

    <NuxtLink :to=" `/${locale}`">
      {{ t('menu.home') }}
    </NuxtLink>
    /
    <NuxtLink :to="`/${locale}${routeMap.about[locale]}`">
      {{ t('menu.about') }}
    </NuxtLink>

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
