<script setup lang="ts">
const { defaultLocale, locale, locales, t } = useI18n()

const composables = {
  useRouteLocale: useRouteLocale(),
  useLocalizedPath: locales.map(locale => useLocalizedPath(useRoute().path, locale)),
}

const data = {
  composables,
  defaultLocale,
  locale: locale.value,
  locales,
  message: t('menu.home'),
}

useTestResult(data)
</script>
