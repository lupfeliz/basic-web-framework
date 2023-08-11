import { defineStore } from 'pinia'
import { ComponentInternalInstance, ComponentPublicInstance } from 'vue'
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { navigateTo } from 'nuxt/app'

/** [ 타입 및 인터페이스 정의 */
const map: any = {} as any
type AnyType = typeof map
type MethodsType = typeof mixin.methods
interface ComponentMixedType extends ComponentPublicInstance, MethodsType, AnyType { }
interface ComponentInternalType extends ComponentInternalInstance { ctx: ComponentMixedType }
interface ComponentType extends ComponentPublicInstance, AnyType {
  _: ComponentInternalType,
  internal: ComponentInternalType,
  exposed: any
}
/** ] 타입 및 인터페이스 정의 */

export const useBaseSystem = defineStore('baseSystem', {
  state: () => {
    return {
      pageTitle: {} as any,
      pageInstance: undefined as any as ComponentType,
      layoutInstance: undefined as any as ComponentType,
      window: undefined as any,
      bootstrap: {
        Modal: class {
          constructor(a: any) { }
        }
      },
      popstate: undefined as any,
      popstateHook: undefined as any as Function | undefined,
      removeHist: undefined as any as Function,
      saveHist: undefined as any as Function,
      m: {} as any
    }
  },
  actions: {
  },
})

const mixin  = {
  methods: {
    goPage(uri: string | number, opt?: any) {
      switch(typeof uri) {
      case C.STRING:
        navigateTo(String(uri), opt)
        break
      case C.NUMBER:
        history.go(Number(uri))
        break
      }
    },
    getParameter(key?: string) {
      const route = useRoute()
      if (key) {
        return route.params[key]
      } else {
        return route.params
      }
    },
    async removeHist(blen?: number, backuri?: string, callback?: Function) {
      const bssys = useBaseSystem()
      await bssys.removeHist(blen, backuri, callback)
    },
    async saveHist(data: any, callback?: Function) {
      const bssys = useBaseSystem()
      await bssys.saveHist(data, callback)
    },
    findForm(self?: any) {
      if (!self && this) { self = this }
      let x: any
      let ctx = self?._
      // log.debug('SELF:', self)
      const fnchk = (ctx: any) => {
        let x: any
        if ((x = ctx?.exposed) &&
          x?.validate && x?.validate instanceof Function &&
          x?.reset && x?.reset instanceof Function &&
          x?.resetField && x?.resetField instanceof Function &&
          x?._VFORM_) {
          return x._VFORM_
        }
      }
      const list = self?._?.subTree?.children
      // log.debug('LIST:', list)
      for (const sub of list) {
        // log.debug('SUB:', sub?.component?.exposed)
        if (x = fnchk(sub?.component)) { return x }
      }
      while (ctx) {
        // log.debug('CTX:', ctx)
        if (x = fnchk(ctx)) { return x }
        ctx = ctx.parent
      }
      return undefined
    },
    currentUri() {
      return history?.state?.current
    }
  }
}

const inst: (e: any) => ComponentMixedType = (e: any) => {
  // log.debug('ROUTE:', useRoute(), '/', useRouter()?.options?.history?.state, '/')
  const ret = new Proxy(e?.ctx, {
    get(o, p: string) {
      let x: any, ret: any = e.ctx[p]
      if (!ret && (x = e.ctx?._)) { ret = x[p] }
      if (!ret && (x = e.ctx?._?.exposed)) { ret = x[p] }
      return ret
    }
  })
  return ret as any as ComponentMixedType
}

export { mixin, inst, ComponentType, AnyType }