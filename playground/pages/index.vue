<script setup lang="ts">
const { locale, t } = useI18n()
const name = ref('visitor')

watchEffect(() => {
  name.value = locale.value === 'en' ? 'Visitor' : 'Besucher'
})
</script>

<template>
  <div class="container">
    <h1>{{ t('title') }}</h1>
    <h2>{{ t('hello', { name }) }}</h2>
  </div>
</template>

<style scoped>
.container {
  margin-top: 1rem;
}
</style>
