<script setup lang="ts">
const { locales } = useI18n()
const path = useRoute().path

const data = {
  useRouteLocale: useRouteLocale(),
  useLocalizedPath: locales.map(locale => useLocalizedPath(path, locale)),
}

useTestResult(data)
</script>
