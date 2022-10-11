<script setup lang="ts">
const { defaultLocale, locale, locales, t, setLocale } = useI18n()
const route = useRoute()
const router = useRouter()

const localeSelect = ref(locale.value)

watch(localeSelect, async (newLocale, oldLocale) => {
  const to = route.path === '/'
    ? `/${newLocale}`
    : route.fullPath.replace(new RegExp(`^/${oldLocale}`), `/${newLocale}`)
  router.push(to)
})
</script>

<template>
  <div>
    <header>
      <NuxtLink :to="`/${locale !== defaultLocale ? `${locale}/` : ''}`">
        {{ t('menu.home') }}
      </NuxtLink>
      /
      <NuxtLink :to="`/${locale}/about`">
        {{ t('menu.about') }}
      </NuxtLink>
      /
      <form class="language">
        <label for="locale-select">{{ t('language') }}</label>
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
