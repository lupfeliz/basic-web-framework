import * as C from '@/libs/commons/constants'
import { shared as s, mixin, inst, ComponentType } from '@/libs/commons/shared'
import { log } from '@/libs/commons/log'

const INTERNAL = 'internal'
const EXPOSED = 'exposed'

const plugin = defineNuxtPlugin(nuxtApp => {
  const vueApp = nuxtApp.vueApp
  vueApp.mixin({
    async mounted() {
      let x
      const self: ComponentType = this
      switch(self?._?.parent?.type?.name) {
      case C.VNM_LAYOUT_LOADER:
        /** 레이아웃 인스턴스 */
        s.layoutInstance = new Proxy(self, {
          get(o, p: string) {
            let x: any, ret: any = self[p]
            if (!ret && (x = self?._)) { ret = x[p] }
            if (!ret && (x = self?._?.exposed)) { ret = x[p] }
            return ret
          }
        })
        s.eventbus.emit(C.EVT_LAYOUT_LOADED)
        break
      case C.VNM_ROUTE_PROVIDER:
        /** 페이지 인스턴스 */
        s.pageInstance = new Proxy(self, {
          get(o, p: string) {
            let x: any, ret: any = self[p]
            if (!ret && (x = self?._)) { ret = x[p] }
            if (!ret && (x = self?._?.exposed)) { ret = x[p] }
            return ret
          }
        })
        s.eventbus.emit(C.EVT_PAGE_LOADED)
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