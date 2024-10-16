<script setup lang="ts">
import DefaultLayout from '@/components/layout.vue'
import app from '@/libs/app-context'
if (!app.isServer()) { app.onload({ config: useRuntimeConfig() }) }
</script>
<template>
  <div v-html="`<script>console.log('OK')</script>`"></div>
  <Component is="script" v-html="`console.log('OK')`"/>
  <DefaultLayout>
    <NuxtPage />
    <!-- <RouterView /> -->
  </DefaultLayout>
</template>