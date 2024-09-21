<script setup lang="ts">
import Button from '@/components/button.vue'

import * as C from '@/libs/constants'
import log from '@/libs/log'
import api from '@/libs/api'
import { useBaseSystem, inst, ComponentType } from '@/store/commons/basesystem'
import { useUserInfo } from '@/store/commons/userinfo'
import dialog from '@/libs/dialog-context'

const self = inst(getCurrentInstance())

const pageTitleDef = '샘플프로젝트'
const pageTitle = ref(pageTitleDef)
const router = useRouter()
const sys = useBaseSystem()
const ustore = useUserInfo()

watch(() => sys.$state?.pageInstance, (e: any) => {
  onPageMount(e as ComponentType)
}, { deep: true })

watch(() => sys.$state?.pageInstance?.pageTitle, (e: any) => {
  titleChanged(sys.pageTitle)
}, { deep: true })

const onPageMount = (page: ComponentType) => {
  titleChanged(page?.pageTitle)
}

const titleChanged = (title: any) => {
  let v = sys.pageInstance?.pageTitle
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

const logout = async () => {
  // const res = await api.post('usr/logout', { })
  // log.debug('RES:', res)
  // if (res?.status === C.SC_OK) {
  //   ustore.clear()
  // }
  await dialog.alert('로그아웃 되었습니다')
}

</script>
<template>
<div class="container">
  <header class="t-5 py-5 center rounded row">
    <div class="text-left col-3">
      <Button
        :class="`btn-secondary mx-1 ${router?.options?.history?.state?.back ? '': 'disabled'}`"
        @click="self.goPage(-1)"
        >
        &lt; 이전 
      </Button>
      <Button
        v-if="router.options?.history?.state?.current !== '/'"
        class="btn-secondary mx-1"
        @click="self.goPage('/')"
        >
        홈
      </Button>
    </div>

    <h1 class="text-center col-6" v-html="pageTitle"></h1>
    <div class="text-right col-3">
      <template v-if="ustore?.userId">
        <Button
          class="btn-secondary mx-1"
          @click="logout()"
          >
          로그아웃
        </Button>
      </template>
      <template v-else>
        <Button
          v-if="self.currentUri() !== '/lgn/lgn01001s01'"
          class="btn-secondary mx-1"
          @click="self.goPage('/lgn/lgn01001s01')"
          >
          로그인
        </Button>
        <Button
          v-if="self.currentUri() !== '/usr/usr01001s01'"
          class="btn-secondary mx-1"
          @click="self.goPage('/usr/usr01001s01')"
          >
          회원가입
        </Button>
      </template>
    </div>
  </header>
</div>
</template>