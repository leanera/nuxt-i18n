<script setup lang="ts">
const { defaultLocale, locale, locales, t } = useI18n()

const data = {
  defaultLocale,
  locale: locale.value,
  locales,
  message: t('menu.home'),
}

useTestResult(data)
</script>
