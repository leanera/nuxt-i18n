<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { defaultLocale, locale, locales, t } = useI18n()

const data = {
  defaultLocale,
  locale: locale.value,
  locales: locales.values,
  message: t('menu.home'),
}

useHead({
  script: [
    {
      children: JSON.stringify(data),
      type: 'text/test-result',
    },
  ],
})
</script>

<template>
  <main />
</template>
