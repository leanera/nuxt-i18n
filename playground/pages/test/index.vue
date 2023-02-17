<script setup lang="ts">
const { defaultLocale, locale, locales, t } = useI18n()

const data = {
  defaultLocale,
  locale: locale.value,
  locales: locales.values,
  message: t('menu.home'),
}

useTestResult(data)
</script>
