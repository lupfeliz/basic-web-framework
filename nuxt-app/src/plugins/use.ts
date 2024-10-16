import 'core-js'
import * as C from '@/libs/constants'
import log from '@/libs/log'
import app from '@/libs/app-context'
import { useBaseSystem, mixin, type ComponentType  } from '@/store/commons/basesystem'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

app.setEntrypoint()

const plugin = defineNuxtPlugin(nuxtApp => {
  const vueApp = nuxtApp.vueApp
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