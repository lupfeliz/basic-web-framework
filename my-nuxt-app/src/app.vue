<template>
  <script v-html="`
    console.log('OK!!!!')
  `"/>
  <DefaultLayout>
    <NuxtPage />
  </DefaultLayout>
</template>
<script setup lang="ts">
import DefaultLayout from '@/components/layout.vue'
import app from '@/libs/app-context'
if (!app.isServer()) { app.onload({ config: useRuntimeConfig() }) }
</script>