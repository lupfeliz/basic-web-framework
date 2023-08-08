<template>
  <template v-if="libinit">
    <main>
      <div class="container">
        <Header></Header>
        <slot></slot>
        <Footer></Footer>
      </div>
    </main>
    <Dialog></Dialog>
  </template>
</template>
<script setup lang="ts">
import Header from '@/components/commons/header.vue'
import Footer from '@/components/commons/footer.vue'
import Dialog from '@/components/commons/dialog.vue'
import * as C from '@/libs/commons/constants'
import { shared as s, inst } from '@/libs/commons/shared'
import { bootstwrap } from '@/libs/commons/bootstwrap'
import { log } from '@/libs/commons/log'
import $ from 'jquery'

const self = inst(getCurrentInstance())

const libinit = ref(s.libinit)

onBeforeMount(async () => {
  s.eventbus.on(C.EVT_PAGE_LOADED, onPageMount)
})

onMounted(async () => { 
  if (!s.libinit) {
    await bootstwrap.new()
    libinit.value = s.libinit = true
  }
})

const onPageMount = () => {
}

</script>