<script setup lang="ts">
import { useI18n } from '@leanera/vue-i18n'
const { t } = useI18n()
</script>

<template>
  <h1>{{ t('about.description') }}</h1>
</template>
