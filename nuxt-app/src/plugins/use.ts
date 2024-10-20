import 'core-js'
import ResizeObserver from 'resize-observer-polyfill'
if (typeof window !== 'undefined') { window.ResizeObserver = ResizeObserver }

import * as C from '@/libs/constants'
import log from '@/libs/log'
import app from '@/libs/app-context'
import { useBaseSystem, mixin, type ComponentType  } from '@/store/commons/basesystem'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

app.setEntrypoint()

const plugin = defineNuxtPlugin(nuxtApp => {
  /** [nuxt] Your project has pages but the <NuxtPage /> component 오류 억제 */
  nuxtApp._isNuxtPageUsed = true
  const vueApp = nuxtApp.vueApp
  /** VUE 경고 핸들링. hydration 경고 등을 제어하도록 한다. */
  // vueApp.config.warnHandler = (msg: string, instance: ComponentPublicInstance | null, trace: string) => {
  //   // if (msg.startsWith('Failed to resolve component: Mjx')) {
  //   //   return
  //   // }
  //   // if (msg.includes('mjx-container')) {
  //   //   return
  //   // }
  //   // // if (/^Hydration node mismatch[:]/.test(msg)) {
  //   // //   log.debug(msg)
  //   // //   return ''
  //   // // }
  //   // if (/^Hydration class mismatch on/.test(msg)) {
  //   //   log.trace(msg)
  //   //   return ''
  //   // }
  //   log.warn('WARN: ', msg, trace)
  // }
  // vueApp.config.errorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
  //   log.warn('ERROR: ', err, info)
  // }

  vueApp.use(createPinia)
  { (nuxtApp as any).$pinia.use(piniaPluginPersistedstate) }
  vueApp.mixin({
    async mounted() {
      let x
      const self: ComponentType = this
      const sys = useBaseSystem()
      switch(self?._?.parent?.type?.name) {
      case C.VNM_LAYOUT_LOADER:
        /** 레이아웃 인스턴스 */
        sys.layoutInstance = new Proxy(self, {
          get(o, p: string) {
            let x: any, ret: any = self[p]
            if (!ret && (x = self?._)) { ret = x[p] }
            if (!ret && (x = self?._?.exposed)) { ret = x[p] }
            return ret
          }
        })
        break
      case C.VNM_ROUTE_PROVIDER:
        /** 페이지 인스턴스 */
        sys.pageInstance = new Proxy(self, {
          get(o, p: string) {
            let x: any, ret: any = self[p]
            if (!ret && (x = self?._)) { ret = x[p] }
            if (!ret && (x = self?._?.exposed)) { ret = x[p] }
            return ret
          }
        })
        break
      }
    },
    data: () => {
      return { }
    },
    methods: mixin.methods 
  })
})

export default plugin