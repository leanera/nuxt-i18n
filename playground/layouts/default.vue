<script setup lang="ts">
const { defaultLocale, locale, locales, t } = useI18n()
const route = useRoute()
const router = useRouter()

const localeSelect = ref(locale.value)

watch(localeSelect, async (newLocale) => {
  let to = useLocalizedPath(route.fullPath, newLocale)

  // Handle special index page (overwritten route in `nuxt.config.ts`)
  if (route.path === '/')
    to = `/${newLocale}`
  else if (to === `/${defaultLocale}`)
    to = '/'

  router.push(to)
})
</script>

<template>
  <div>
    <header>
      <NuxtLink :to="locale === defaultLocale ? '/' : `/${locale}`">
        {{ t('menu.home') }}
      </NuxtLink>
      /
      <NuxtLink :to="`/${locale}/about`">
        {{ t('menu.about') }}
      </NuxtLink>
      /
      <form class="language">
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
  </div>
</template>

<style scoped>
.language {
  display: inline-block;
}
</style>
