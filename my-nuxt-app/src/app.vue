<template>
  <DefaultLayout>
    <NuxtPage />
  </DefaultLayout>
</template>
<script setup lang="ts">
import DefaultLayout from '@/components/layout.vue'
import app from '@/plugins/app-context'
import log from '@/libs/log'
if (typeof window !== 'undefined') {
  app.onload({})
}
</script>