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
  // log.debug('REGISTER POPSTATE EVENT!')
  /** history 이동 관련 */
  window.addEventListener(C.POPSTATE, (e: any) => {
    // log.debug('CANCEL POPSTATE', s.popstateHook ? true : false)
    if (s.popstateHook && s.popstateHook instanceof Function) {
      // log.debug('HOOK POPSTATE', e.cancelable)
      const fnc = s.popstateHook
      s.popstateHook = undefined
      nextTick(() => fnc(e))
      // setTimeout(() => fnc(e), 1000)
      e.cancelBubble = true
      e.stopPropagation()
      e.preventDefault()
      return false
    } else {
      s.eventbus.emit(C.EVT_POPSTATE, e)
    }
  })

  /** history 이동 관련 */
  s.removeHist = (blen?: number, backuri?: string, callback?: Function) => {
    return new Promise((resolve: any) => {
      if (!blen) { blen = 1 }
      if (blen < 1) { return }
      if (!backuri && !history.state?.back) { return }
      if (!backuri) { backuri = history.state?.back }
      const fnRemove = () => {
        s.popstateHook = (e: any) => {
          // log.debug('BINX:', blen, backuri, JSON.stringify(history.state))
          if (Number(blen) > 0 && history.state) {
            blen = Number(blen) - 1
            nextTick(() => fnRemove())
            // setTimeout(() => fnClear(), 1000)
          } else {
            // log.debug('REPLACE-STATE:', blen, backuri, JSON.stringify(history.state))
            history.replaceState(history.state, '', backuri)
            // log.debug('PUSH-STATE:', blen, backuri, JSON.stringify(history.state))
            s.popstateHook = undefined
            self.goPage(String(backuri), history.state)
            if (callback && callback instanceof Function) { callback() }
            resolve()
          }
        }
        // log.debug('HISTORY BACK!')
        history.go(-1)
      }
      fnRemove()
    })
  }
  s.saveHist = (data: any, callback?: Function) => {
    return new Promise((resolve: any) => {
      const pdata = history.state
      pdata.histdata = JSON.stringify(data)
      history.pushState(pdata, '',
        history.state.current
      )
      if (callback && callback instanceof Function) { callback() }
      resolve()
    })
  }
})
onUnmounted(async () => {
  s.eventbus.off(C.EVT_PAGE_LOADED)
  window.removeEventListener(C.POPSTATE, () => { })
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