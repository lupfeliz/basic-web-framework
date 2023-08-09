import mitt from 'mitt'
import { ComponentInternalInstance, ComponentPublicInstance } from 'vue'
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { navigateTo } from 'nuxt/app';

/** [ 타입 및 인터페이스 정의 */
const map: any = {} as any
type AnyType = typeof map
type MethodsType = typeof mixin.methods
type SharedObjType = (typeof sharedObj)
interface SharedType extends SharedObjType, AnyType { }
interface ComponentMixedType extends ComponentPublicInstance, MethodsType, AnyType { }
interface ComponentInternalType extends ComponentInternalInstance { ctx: ComponentMixedType }
interface ComponentType extends ComponentPublicInstance, AnyType {
  _: ComponentInternalType,
  internal: ComponentInternalType,
  exposed: any
}
/** ] 타입 및 인터페이스 정의 */

const sharedObj = {
  eventbus: mitt(),
  layoutInstance: undefined as any as ComponentType,
  pageInstance: undefined as any as ComponentType,
  window: undefined as any,
  bootstrap: {
    Modal: class {
      constructor(a: any) { }
    }
  },
  popstateHook: undefined as any as Function | undefined,
  removeHist: undefined as any as Function,
  saveHist: undefined as any as Function
}

const mixin  = {
  methods: {
    goPage(uri: string | number, opt?: any) {
      switch(typeof uri) {
      case C.STRING:
        navigateTo(String(uri), opt)
        break;
      case C.NUMBER:
        history.go(Number(uri))
        break;
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
      await shared.removeHist(blen, backuri, callback)
    },
    async saveHist(data: any, callback?: Function) {
      await shared.saveHist(data, callback)
    },
    test() {
      log.debug('TEST!!!')
    }
  }
}

const shared: SharedType = sharedObj as SharedType
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

export { shared, mixin, inst, ComponentType, AnyType }