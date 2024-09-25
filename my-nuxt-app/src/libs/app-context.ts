/**
 * @File        : app-context.ts
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 통합기능모듈
 *                APP 구동시 빈번하게 사용되는 기능들의 복합체, values 등 유틸들이 mixin 되어 있다
 * @Site        : https://devlog.ntiple.com
 **/
import { Function1, Function2, debounce } from 'lodash'
import { Router } from '#vue-router' 
import CryptoJS from 'crypto-js'
import * as C from '@/libs/constants'
import values from '@/libs/values'
import log, { getLogger } from '@/libs/log'
import proc from '@/libs/proc'

type UpdateFunction = (mode?: number) => void

type LauncherProps<V, P> = {
  uid?: string
  name?: string
  mounted?: Function1<{ releaser: Function1<any, void> }, void>
  unmount?: Function
  updated?: Function2<number, string, void>
  releaselist?: Function[]
  vars?: V
  props?: P
  phase?: number
}

type SetupType<V, P> = {
  uid: string
  update: UpdateFunction
  ready: Function
  vars: V
  props?: P
}

type ContextType<T> = {
  [name: string]: T
}

const { AES: cjaes, enc: cjenc } = CryptoJS
const { until } = proc
const { randomStr } = values

/** 이 부분은 웹팩 플러그인(replace-loader)에 의해 자동으로 채워진다 */
const encrypted = () => '{$$ENCRYPTED$$}'

// log.debug('ENCRYPTED:', encrypted())

/** 메소드 별도선언시 WEBPACK 난독화에 도움이 된다 */
const decryptAES = (v: string, k: string) => JSON.parse(cjaes.decrypt(v, k).toString(cjenc.Utf8))

/** 전역 일반객체 저장소 (non-serializable 객체) */
const appvars = {
  astate: 0,
  gstate: 0,
  tstate: {} as any,
  uidseq: 0,
  router: {} as Router,
  entrypoint: '',
  config: {
    app: { profile: '', basePath: '' },
    api: [{ base: '', alter: '', server: '', timeout: 0 }],
    auth: { expiry: 0 },
    security: {
      key: { rsa: { public: '', private: '' } }
    },
    runtime: {} as any
  },
  libs: { } as any
}

const app = {
  /** values, log, getLogger mixin */
  ...values, log, getLogger,
  until,
  /** 앱 내 유일키 생성 */
  genId() { return `${new Date().getTime()}${String((appvars.uidseq = (appvars.uidseq + 1) % 1000) + 1000).substring(1, 4)}` },
  setEntrypoint() {
    if (!app.isServer()) {
      log.debug('USE-PLUGINS...', location.pathname, history.state)
      appvars.entrypoint = location.pathname
    }
  },
  async onload(props: any) {
    if (appvars.astate == C.APPSTATE_INIT) {
      appvars.astate = C.APPSTATE_START
      try {
        appvars.config.runtime = props.config.public
        // log.debug('CHECK-URL:', location.pathname, history.state, useRouter().resolve(appvars.entrypoint))
        if (appvars.entrypoint != location.pathname) {
          history.replaceState({}, '', appvars.entrypoint)
        }
        // log.debug('CHECK-URL:', location.pathname, history.state, useRouter(), useRoute())
        const api = (await import('@/libs/api')).default
        const crypto = (await import('@/libs/crypto')).default

        appvars.libs['bootstrap'] = (await import ('bootstrap')).default
        appvars.astate = C.APPSTATE_LIBS
        // const userContext = (await import('@/libs/user-context')).default
        const conf = decryptAES(encrypted(), C.CRYPTO_KEY)
        const clitime = new Date().getTime()
        app.putAll(appvars.config, conf)
        log.setLevel(conf.log.level)
        log.debug('CONF:', conf)
        const cres = await api.get(`cmn01001`, {}, { noprogress: true })
        await crypto.rsa.init(app.getConfig().security.key.rsa.public, C.PUBLIC_KEY)
        const kobj = JSON.parse(crypto.rsa.decrypt(cres?.check || '{}'))
        const svrtime = Number(kobj?.t || 0)
        /** TODO: 서버시간과 동기화 */
        log.debug('SERVER-TIME:', svrtime)
        const aeskey = kobj?.k || ''
        await crypto.aes.init(aeskey)
        /** TODO: 워크 페이지별 다국어 적재 */
        // await $t.init(['commons', 'mai'])
        appvars.astate = C.APPSTATE_ENV
        // const userInfo = userContext.getUserInfo()
        // if (userInfo?.userId && (userInfo.accessToken?.expireTime || 0) > clitime) { userContext.checkExpire() }
        appvars.astate = C.APPSTATE_USER
      } catch (e) {
        appvars.astate = C.APPSTATE_ERROR
        log.debug('E:', e)
      }
      appvars.astate = C.APPSTATE_READY
    }
  },
  /** 입력성 컴포넌트 (input 등)에서 자동으로 값을 입력하도록 수행하는 메소드 */
  modelValue<V, P>(self: SetupType<V, P>) {
    const props = self?.props || {} as any
    const model = props?.model
    const name = props?.name ? props.name.split(/[.]/)[0] : undefined
    const inx = props?.name ? props.name.split(/[.]/)[1] : -1
    let value = (model && name) ? model[name] : undefined
    if (value && typeof value == C.OBJECT) { value = value[inx] }
    const setValue = (v: any, callback?: Function) => {
      if (model && name) {
        if (model[name] && typeof model[name] == C.OBJECT && inx != -1) {
          model[name][inx] = v
        } else {
          model[name] = v
        }
        if (callback) { callback(model, name, inx, value) }
      }
      return v
    }
    return { props: self?.props, vars: self?.vars, model, name, inx, value, setValue }
  },
  getParameter: (key?: string) => {
    let ret: any = C.UNDEFINED
    const prm: any = { }
    let o: any
    try {
      const d1 = String(history?.state?.url || '').split(/[/]/)
      const d2 = String(history?.state?.as || '').split(/[/]/)
      let len = d1.length > d2.length ? d1.length : d2.length
      for (let inx = 0; inx < len; inx++) {
        if (/[\[]([a-zA-Z0-9_-]+)[\]]/.test(d1[inx] || '')) {
          prm[d1[inx].substring(1, d1[inx].length - 1)] = d2[inx]
        }
      }
    } catch (e) {
      log.debug('E:', e)
    }
    if ((o = history?.state?.options)) {
      for (const k of Object.keys(o)) { prm[k] = o[k] }
    }
    if (o = new URLSearchParams(location.search)) {
      for (const k of o.keys()) { prm[k] = o.get(k) }
    }
    if (Object.keys(prm).length > 0) { log.debug('PRM:', prm, history) }
    ret = key ? prm[key] : prm
    return ret
  },
  getUri() {
    let ret = '/'
    if (appvars.astate) {
      ret = String(history?.state?.url || '/').replace(/[?].*$/g, '')
    }
    return ret
  },
  window: () => (app.isServer() ? {} : window) as any,
  setGlobalTmp(value: any) {
    const tid = randomStr(10, C.ALPHANUM)
    if (!app.isServer()) {
      (window as any)[tid] = () => value
    }
    return tid
  },
  getGlobalTmp(tid: string) {
    let ret: any = C.UNDEFINED
    if (!app.isServer()) {
      const win: any = window
      if (win[tid]) {
        ret = win[tid]
        if (ret) { ret = ret() }
        if ([C.LOCAL, C.MY].indexOf(app.profile()) === -1) {
          delete win[tid]
        }
      }
    }
    return ret
  },
  setOpenerTmp(value: any) {
    const tid = randomStr(10, C.ALPHANUM)
    if (!app.isServer()) {
      const win: any = window
      if (win && win.opener) {
        win.opener[tid] = () => value
      }
    }
    return tid
  },
  getOpenerTmp(tid: string) {
    let ret: any = C.UNDEFINED
    if (!app.isServer()) {
      const win: any = window
      if (win.opener && win.opener[tid]) {
        ret = win.opener[tid]
        if (ret) { ret = ret() }
        if (ret.$$POUPCTX$$) {
          ret.$$POUPCTX$$.close = () => {
            window.close()
          }
          delete ret.$$POUPCTX$$
        }
        if ([C.LOCAL, C.MY].indexOf(app.profile()) === -1) {
          delete win.opener[tid]
        }
      } else {
        /** 오픈주체가 없으므로 창을 닫는다 */
        window.close()
      }
    }
    return ret
  },
  profile: () => String(appvars.config.runtime.profile),
  basepath(uri: string) {
    if (uri.startsWith('/')) { uri = `${String(appvars.config.runtime?.basePath || '').replace(/[\/]+/g, '/')}${uri}` }
    return uri
  },
  astate: () => appvars.astate,
  ready: (astate: number = C.APPSTATE_READY) => appvars.astate >= astate ? true : false,
  tstate: (mode: number) => (appvars.astate && appvars.tstate[mode]) || 0,
  getConfig: () => appvars.config,
  isServer: () => typeof window === 'undefined',
  asAny: (v: any) => v as any,
  asType: <T>(v: any, _: T) => v as T,
  getFrom: (v: any, k: string) => v && v[k],
  px2rem(v: any, el?: any) {
    v = Number(String(v).replace(/[^0-9^.]+/g, ''))
    if (isNaN(v)) { v = 0 }
    if (!el) { el = document.documentElement }
    return v / parseFloat(getComputedStyle(el).fontSize)
  },
  rem2px(v: any, el?: any) {
    v = Number(String(v).replace(/[^0-9^.]+/g, ''))
    if (isNaN(v)) { v = 0 }
    if (!el) { el = document.documentElement }
    return v * parseFloat(getComputedStyle(el).fontSize)
  },
}

export default app