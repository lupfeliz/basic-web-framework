<script setup lang="ts">
import DefaultLayout from '@/components/layout.vue'
import app from '@/libs/app-context'
if (!app.isServer()) { app.onload({ config: useRuntimeConfig() }) }
</script>
<template>
  <DefaultLayout>
    <!-- <NuxtPage :page-key="route => route.fullPath" /> -->
  </DefaultLayout>
  <!-- <DefaultLayout /> -->
</template>