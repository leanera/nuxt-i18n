<script setup lang="ts">
import { useI18n } from '@leanera/vue-i18n'
const { t } = useI18n()
const name = ref('visitor')
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
