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
// import { shared as s } from '@/libs/commons/shared'
import { useBaseSystem, inst } from '@/store/commons/basesystem'
import { bootstwrap } from '@/libs/commons/bootstwrap'
import { log } from '@/libs/commons/log'
import $ from 'jquery'

// const bssys = s

const self = inst(getCurrentInstance())

const libinit = ref()

// watch(s?.pageInstance, (v: any) => {
//   log.debug('PAGE-CHNAGED1!', v)
// })

// watch(() => { 
//   log.debug('CHECK!!!!!', s?.pageInstance)
//   return s?.pageInstance
// }, (v: any) => {
//   log.debug('PAGE-CHNAGED2!', v)
// })

onBeforeMount(async () => {
  const bssys = useBaseSystem()
  // s.eventbus.on(C.EVT_PAGE_LOADED, onPageMount)
  // log.debug('REGISTER POPSTATE EVENT!')
  /** history 이동 관련 */
  window.addEventListener(C.POPSTATE, (e: any) => {
    // log.debug('CANCEL POPSTATE', s.popstateHook ? true : false)
    if (bssys.popstateHook && bssys.popstateHook instanceof Function) {
      // log.debug('HOOK POPSTATE', e.cancelable)
      const fnc = bssys.popstateHook
      bssys.popstateHook = undefined
      nextTick(() => fnc(e))
      // setTimeout(() => fnc(e), 1000)
      e.cancelBubble = true
      e.stopPropagation()
      e.preventDefault()
      return false
    } else {
      // s.eventbus.emit(C.EVT_POPSTATE, e)
    }
  })

  /** history 이동 관련 */
  bssys.removeHist = (blen?: number, backuri?: string, callback?: Function) => {
    return new Promise((resolve: any) => {
      if (!blen) { blen = 1 }
      if (blen < 1) { return }
      if (!backuri && !history.state?.back) { return }
      if (!backuri) { backuri = history.state?.back }
      const fnFinish = () => {
        // log.debug('REPLACE-STATE:', blen, backuri, JSON.stringify(history.state))
        history.replaceState(history.state, '', backuri)
        // log.debug('PUSH-STATE:', blen, backuri, JSON.stringify(history.state))
        bssys.popstateHook = undefined
        self.goPage(String(backuri), history.state)
        if (callback && callback instanceof Function) { callback() }
        resolve()
      }
      const fnRemove = () => {
        bssys.popstateHook = (e: any) => {
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
  bssys.saveHist = (data: any, callback?: Function) => {
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
  // s.eventbus.off(C.EVT_PAGE_LOADED)
  window.removeEventListener(C.POPSTATE, () => { })
})
onMounted(async () => { 
  const bssys = useBaseSystem()
  if (!bssys.m.libinit) {
    await bootstwrap.new()
    libinit.value = bssys.m.libinit = true
  }
})

const onPageMount = () => {
}
</script>