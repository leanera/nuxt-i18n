<script setup lang="ts">
const { t } = useI18n()

useTestResult({
  translations: [
    t('menu.home'),
    t('unknown'),
  ],
})
</script>
