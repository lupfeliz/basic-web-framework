<template>
  <header class="t-5 py-5 center rounded row">
    <div class="text-left col-3">
      <MyButton
        :class="`btn-secondary mx-1 ${router?.options?.history?.state?.back ? '': 'disabled'}`"
        @click="self.goPage(-1)"
        >
        &lt; 이전 
      </MyButton>
      <MyButton
        v-if="router.options?.history?.state?.current !== '/'"
        class="btn-secondary mx-1"
        @click="self.goPage('/')"
        >
        홈
      </MyButton>
    </div>

    <h1 class="text-center col-6" v-html="pageTitle"></h1>
    <div class="text-right col-3">
      <template v-if="ustore?.userId">
        <MyButton
          class="btn-secondary mx-1"
          @click="logout()"
          >
          로그아웃
        </MyButton>
      </template>
      <template v-else>
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
      </template>
    </div>
  </header>
</template>
<script setup lang="ts">
import MyButton from '@/components/commons/mybutton.vue'

import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { apiPost } from '@/libs/commons/api'
import { useBaseSystem, inst, ComponentType } from '@/store/commons/basesystem'
import { useUserInfo } from '@/store/commons/userinfo'
import { dialog } from '@/libs/commons/dialog'

const self = inst(getCurrentInstance())

const pageTitleDef = '샘플프로젝트'
const pageTitle = ref(pageTitleDef)
const router = useRouter()
const bssys = useBaseSystem()
const ustore = useUserInfo()

watch(() => bssys.$state?.pageInstance, (e: any) => {
  onPageMount(e as ComponentType)
}, { deep: true })

watch(() => bssys.$state?.pageInstance?.pageTitle, (e: any) => {
  titleChanged(bssys.pageTitle)
}, { deep: true })

const onPageMount = (page: ComponentType) => {
  titleChanged(page?.pageTitle)
}

const titleChanged = (title: any) => {
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

const logout = async () => {
  const res = await apiPost({
    act: 'user/logout',
  })
  log.debug('RES:', res)
  if (res?.status === C.SC_OK) {
    ustore.clear()
    self.$forceUpdate()
  }
  await dialog.alert('로그아웃 되었습니다')
}

</script>