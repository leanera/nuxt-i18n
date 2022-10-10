<script setup lang="ts">
const { locale, t, setLocale } = useI18n()
const route = useRoute()
const router = useRouter()

const localeSelect = ref(locale.value)

watch(localeSelect, async (newLocale, oldLocale) => {
  await useSwitchLocale(newLocale)
  const to = route.fullPath.replace(new RegExp(`^/${oldLocale}`), `/${newLocale}`)
  router.push(to)
})
</script>

<template>
  <div>
    <header>
      <NuxtLink to="/">
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
          <option value="en">
            en
          </option>
          <option value="de">
            de
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
