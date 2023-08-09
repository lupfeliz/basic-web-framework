<template>
  <header class="t-5 p-5 center rounded row">
    <div class="text-center col-3">
      <Button
        :class="[router.options.history.state.back ? 'btn-secondary' : 'hidden']"
        @click="self.goPage(-1)"
        >
        &lt; 이전
      </Button>
    </div>
    <h1 class="text-center col-6" v-html="pageTitle"></h1>
    <div class="text-center col-3">
      <Button
        class="btn-info"
        >
        로그인
      </Button>
    </div>
  </header>
</template>
<script setup lang="ts">
import Button from '@/components/commons/button.vue';

import * as C from '@/libs/commons/constants'
import { shared as s, inst } from '@/libs/commons/shared'
import { log } from '@/libs/commons/log'

const self = inst(getCurrentInstance())

const pageTitleDef = '샘플프로젝트'
const pageTitle = ref(pageTitleDef)
const router = useRouter()

watch(() => s?.pageInstance?.pageTitle, () => titleChanged())

onBeforeMount(async () => {
  s.eventbus.on(C.EVT_PAGE_LOADED, onPageMount)
  s.eventbus.on(C.EVT_TITLE_CHANGED, titleChanged)
})
onUnmounted(async () => {
  s.eventbus.off(C.EVT_PAGE_LOADED)
  s.eventbus.off(C.EVT_TITLE_CHANGED)
})

const onPageMount = () => {
  titleChanged()
}

const titleChanged = () => {
  let v = s?.pageInstance?.pageTitle
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