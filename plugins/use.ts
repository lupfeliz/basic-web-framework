import * as C from '@/libs/commons/constants'
// import { shared as s, mixin, inst, ComponentType } from '@/libs/commons/shared'
// import { shared as s } from '@/libs/commons/shared'
import { log } from '@/libs/commons/log'
// import { useSystemStore, ComponentType, mixin } from '@/store/commons/systemstore'
import { useBaseSystem, mixin, ComponentType  } from '@/store/commons/basesystem'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const plugin = defineNuxtPlugin(nuxtApp => {
  const vueApp = nuxtApp.vueApp
  vueApp.use(createPinia)
  { (nuxtApp as any).$pinia.use(piniaPluginPersistedstate) }
  vueApp.mixin({
    async mounted() {
      let x
      const self: ComponentType = this
      const bssys = useBaseSystem()
      // const bssys = s as any
      switch(self?._?.parent?.type?.name) {
      case C.VNM_LAYOUT_LOADER:
        /** 레이아웃 인스턴스 */
        // s.layoutInstance = 
        bssys.layoutInstance = new Proxy(self, {
          get(o, p: string) {
            let x: any, ret: any = self[p]
            if (!ret && (x = self?._)) { ret = x[p] }
            if (!ret && (x = self?._?.exposed)) { ret = x[p] }
            return ret
          }
        })
        // s.eventbus.emit(C.EVT_LAYOUT_LOADED)
        break
      case C.VNM_ROUTE_PROVIDER:
        /** 페이지 인스턴스 */
        // s.pageInstance = 
        bssys.pageInstance = new Proxy(self, {
          get(o, p: string) {
            let x: any, ret: any = self[p]
            if (!ret && (x = self?._)) { ret = x[p] }
            if (!ret && (x = self?._?.exposed)) { ret = x[p] }
            return ret
          }
        })
        // log.debug('PAGE_INSTANCE_CHECK:', s?.pageInstance)
        // s.eventbus.emit(C.EVT_PAGE_LOADED)
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