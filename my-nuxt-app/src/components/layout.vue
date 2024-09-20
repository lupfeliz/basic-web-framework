<template>
  <template v-if="(sys?.m?.libinit)">
    <main>
      <div class="container">
        <Header />
        <RouterView v-slot="{ Component, route }">
          <Transition name="slide-fade">
            <Component :key="route.fullPath" :is="Component" />
          </Transition>
        </RouterView>
        <Footer />
      </div>
    </main>
    <Dialog />
  </template>
</template>
<script setup lang="ts">
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import Dialog from '@/components/dialog.vue'
import * as C from '@/libs/constants'
import { useBaseSystem, inst } from '@/store/commons/basesystem'
import log from '@/libs/log'
import $ from 'jquery'

const self = inst(getCurrentInstance())

const sys = ref()

onBeforeMount(async () => {
  sys.value = useBaseSystem()
  // log.debug('REGISTER POPSTATE EVENT!')
  /** history 이동 관련 */
  window.addEventListener(C.POPSTATE, (e: any) => {
    // log.debug('CANCEL POPSTATE', s.popstateHook ? true : false)
    if (sys.value.popstateHook && sys.value.popstateHook instanceof Function) {
      // log.debug('HOOK POPSTATE', e.cancelable)
      const fnc = sys.value.popstateHook
      sys.value.popstateHook = undefined
      nextTick(() => fnc(e))
      // setTimeout(() => fnc(e), 1000)
      e.cancelBubble = true
      e.stopPropagation()
      e.preventDefault()
      return false
    } else {
      sys.value.popstate = e
    }
  })

  /** history 이동 관련 */
  sys.value.removeHist = (blen?: number, backuri?: string, callback?: Function) => {
    return new Promise((resolve: any) => {
      if (!blen) { blen = 1 }
      if (blen < 1) { return }
      if (!backuri && !history.state?.back) { return }
      if (!backuri) { backuri = history.state?.back }
      const fnFinish = () => {
        // log.debug('REPLACE-STATE:', blen, backuri, JSON.stringify(history.state))
        history.replaceState(history.state, '', backuri)
        // log.debug('PUSH-STATE:', blen, backuri, JSON.stringify(history.state))
        sys.value.popstateHook = undefined
        self.goPage(String(backuri), history.state)
        if (callback && callback instanceof Function) { callback() }
        resolve()
      }
      const fnRemove = () => {
        sys.value.popstateHook = (e: any) => {
          // log.debug('BINX:', blen, backuri, JSON.stringify(history.state))
          if (Number(blen) > 0 && history.state) {
            blen = Number(blen) - 1
            nextTick(() => fnRemove())
            // setTimeout(() => fnClear(), 1000)
          } else {
            fnFinish()
          }
        }
        // log.debug('HISTORY BACK!')
        if (history.state?.back && history.state?.position > 1) {
          history.go(-1)
        } else {
          fnFinish()
        }
      }
      fnRemove()
    })
  }
  sys.value.saveHist = (data: any, callback?: Function) => {
    return new Promise((resolve: any) => {
      const pdata = history.state
      pdata.histdata = JSON.stringify(data)
      history.pushState(pdata, '', history.state.current)
      if (callback && callback instanceof Function) { callback() }
      resolve()
    })
  }
  if (!sys.value.m.libinit) {
    sys.value.window = window
    sys.value.window.$ = $
    sys.value.bootstrap = await import ('bootstrap')
    sys.value.m.libinit = true
  }
})

onUnmounted(async () => {
  window.removeEventListener(C.POPSTATE, () => { })
})
</script>