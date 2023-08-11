<template>
  <header class="t-5 py-5 center rounded row">
    <div class="text-left col-3">
      <MyButton
        :class="[router.options.history.state.back ? 'btn-secondary' : 'hidden']"
        @click="self.goPage(-1)"
        >
        &lt; 이전 
      </MyButton>
    </div>

    <h1 class="text-center col-6" v-html="pageTitle"></h1>
    <div class="text-right col-3">
      <MyButton
        v-if="self.currentUri() !== '/user/login'"
        class="btn-secondary mx-1"
        @click="self.goPage('/user/login')"
        >
        로그인
      </MyButton>
      <MyButton
        v-if="self.currentUri() !== '/user/register'"
        class="btn-secondary mx-1"
        @click="self.goPage('/user/register')"
        >
        회원가입
      </MyButton>
    </div>
  </header>
</template>
<script setup lang="ts">
import MyButton from '@/components/commons/mybutton.vue'

import * as C from '@/libs/commons/constants'
// import { shared as s, inst, ComponentType } from '@/libs/commons/shared'
import { log } from '@/libs/commons/log'
import { useBaseSystem, inst, ComponentType } from '@/store/commons/basesystem'
import pinia from 'pinia'

const self = inst(getCurrentInstance())

const pageTitleDef = '샘플프로젝트'
const pageTitle = ref(pageTitleDef)
const router = useRouter()
const bssys = useBaseSystem()
// const bssys = s

bssys.$subscribe((e: any) => {
}, { deep: true, detached: true })

watch(() => bssys.$state?.pageInstance, (e: any) => {
  log.debug('WATCH-PAGEINSTANCE:', e)
  log.debug('PAGE-CHANGED!:', e?.events?.newValue, bssys?.pageInstance)
  log.debug('PAGE-CHANGED!:', e?.events?.newValue?.pageTitle, bssys?.pageInstance?.pageTitle)
  onPageMount(e as ComponentType)
}, { deep: true })

watch(() => bssys.$state?.pageInstance?.pageTitle, (e: any) => {
  log.debug('WATCH-TITLE:', e)
  titleChanged(bssys.pageTitle)
}, { deep: true })

// watch(() => s?.pageInstance?.pageTitle, () => titleChanged())

// watch(() => s?.pageInstance, (v: any) => {
//   log.debug('PAGE-CHNAGED!', v)
// })

onBeforeMount(async () => {
  // s.eventbus.on(C.EVT_PAGE_LOADED, onPageMount)
  // s.eventbus.on(C.EVT_TITLE_CHANGED, titleChanged)
  log.debug('ONMOUNTED:', self)
})
// onUnmounted(async () => {
//   s.eventbus.off(C.EVT_PAGE_LOADED)
//   s.eventbus.off(C.EVT_TITLE_CHANGED)
// })

const onPageMount = (page: ComponentType) => {
  titleChanged(page?.pageTitle)
}

const titleChanged = (title: any) => {
  // let v = s?.pageInstance?.pageTitle
  let v = bssys.pageInstance?.pageTitle
  if (v) {
    if (isRef(v)) {
      pageTitle.value = String(v.value)
    } else if (v instanceof Function) {
      pageTitle.value = v()
    } else {
      pageTitle.value = v
    }
  } else {
    pageTitle.value = pageTitleDef
  }
}

</script>