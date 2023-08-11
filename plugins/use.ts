import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
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
      switch(self?._?.parent?.type?.name) {
      case C.VNM_LAYOUT_LOADER:
        /** 레이아웃 인스턴스 */
        bssys.layoutInstance = new Proxy(self, {
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
        bssys.pageInstance = new Proxy(self, {
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