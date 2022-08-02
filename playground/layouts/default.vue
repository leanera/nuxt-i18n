<script setup lang="ts">
import { useI18n } from '@leanera/vue-i18n'
const { locale, t } = useI18n()
</script>

<template>
  <header>
    <NuxtLink to="/">
      {{ t('menu.home') }}
    </NuxtLink>
    /
    <NuxtLink to="/about">
      {{ t('menu.about') }}
    </NuxtLink>
    /
    <form class="language">
      <label for="locale-select">{{ t('language') }}</label>
      <select id="locale-select" v-model="locale">
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
</template>

<style scoped>
.language {
  display: inline-block;
}
</style>
