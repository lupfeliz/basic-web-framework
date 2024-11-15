/**
 * @File        : app-context.ts
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 통합기능모듈
 *                APP 구동시 빈번하게 사용되는 기능들의 복합체, values 등 유틸들이 mixin 되어 있다
 * @Site        : https://devlog.ntiple.com
 **/
/* eslint-disable react-hooks/exhaustive-deps */
import fs, { readFileSync } from 'fs'
import { Function1, Function2, debounce } from 'lodash'
import $ from 'jquery'
import getConfig from 'next/config'
import { createSlice, configureStore } from '@reduxjs/toolkit'
import React, { useRef, forwardRef } from 'react'
import { useRouter as navRouter, usePathname } from 'next/navigation'
import { type NextRouter, useRouter as nextRouter } from 'next/router'
import dynamic from 'next/dynamic'
import type { AppProps } from 'next/app'
import CryptoJS from 'crypto-js'
import { MDCRipple } from '@material/ripple'

import * as C from '@/libs/constants'
import values from '@/libs/values'
import { getLogger } from '@/libs/log'
import proc from '@/libs/proc'
import misc from '@/libs/misc'
import $t from '@/libs/i18n'

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

type PagePropsType = AppProps & {
} & Record<string, any>

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

const LIBNAME = 'app-context'

const { AES: cjaes, enc: cjenc } = CryptoJS
const { until } = proc
const { randomStr, putAll } = values
const log = getLogger(LIBNAME)

/** 이 부분은 웹팩 플러그인(replace-loader)에 의해 자동으로 채워진다 */
const encrypted = () => '{$$ENCRYPTED$$}'

const ctx: ContextType<LauncherProps<any, any>> = { }

const { publicRuntimeConfig: runtime } = getConfig()

/** 메소드 별도선언시 WEBPACK 난독화에 도움이 된다 */
const decryptAES = (v: string, k: string) => JSON.parse(cjaes.decrypt(v, k).toString(cjenc.Utf8))

/** 전역 일반객체 저장소 (non-serializable 객체) */
const appvars = {
  astate: 0,
  gstate: 0,
  tstate: {} as any,
  uidseq: 0,
  router: {} as NextRouter,
  config: {
    app: { profile: '', basePath: '' },
    api: [{ base: '', alter: '', server: '', timeout: 0 }],
    auth: { expiry: 0 },
    security: {
      key: { rsa: { public: '', private: '' } }
    },
    runtime
  },
  global: { } as any,
  MaterialStyle: {} as any
}

/** 전역 STORE 저장소 (serializable 객체) */
const appContextSlice = createSlice({
  name: LIBNAME,
  initialState: {
    state: 0,
    mode: 0,
    sendid: ''
  },
  reducers: {
    setAppInfo: (state, { payload }) => {
      if (payload?.state || 0) { state.state = payload.state }
      if (payload?.mode !== C.UNDEFINED) { state.mode = payload.mode }
      state.sendid = payload?.sendid || ''
    }
  }
})
/** 전역 STORE 선언 */
const appContextStore = configureStore({ reducer: appContextSlice.reducer })
/** Ripple Effect */
const applyRipple = debounce(() => {
  if (!app.isServer()) {
    setTimeout(async () => {
      await until(() => app.ready())
      $('.ripple-surface').each((_, e) => { !e.classList.contains('mdc-ripple-upgraded') && new MDCRipple(e) })
    }, 1)
  }
}, 300)
const app = {
  /** values, log, getLogger mixin */
  ...values, getLogger, useRef, until, $t,
  ...misc,
  log: getLogger(C.ROOT),
  /** 앱 내 유일키 생성 */
  genId() { return `${new Date().getTime()}${String((appvars.uidseq = (appvars.uidseq + 1) % 1000) + 1000).substring(1, 4)}` },
  /**
   * react 에서 vue 생명주기 메소드인 mounted / unmount 를 흉내낸 방법
   * 다음과 같이 사용한다
   * useSetup({
   *   async mounted() {
   *     {초기화 프로세스}
   *   },
   *   async unmount() {
   *     {종료 프로세스}
   *   }
   * })
   **/
  useSetup<V, P>(prm: LauncherProps<V, P>) {
    let o: any
    const router = navRouter()
    const [uid] = React.useState(app.genId())
    const [phase, setPhase] = React.useState(0)
    const [, setState] = React.useState(0)
    ctx[uid] = putAll(ctx[uid] || { uid, name: prm?.name, vars: prm?.vars || {}, releaselist: [] }, { props: prm?.props || {}, phase })
    if (app.isServer() && (o = prm?.props) && o &&
      (o?.Component && o.pageProps && o?.router?.asPath)) {
      const props = o
      let basepath = '/' + getConfig()?.app?.distDir || 'dist'
      const modpath = String(__filename).substring((process.cwd() + basepath + '/server').length)
      let lang = app.getParameter('lang')
      let nsp = 'commons'
      // log.debug('MOD-PATH:', modpath, lang)
      const lngpath = basepath + '/server/src_locales_' + lang + '_' + nsp + '_ts.js'
      if (fs.existsSync(process.cwd() + lngpath)) {
        /** TODO: 동적으로 로켈 읽어와서 입력하기, 이부분도 마찬가지로 URL 방식 사용시 필요 없음 */
        // const content = readFileSync(process.cwd() + lngpath)
        // log.debug('CHECK-LOCALE:', lngpath, String(content))
      }
    }
    const self = (vars?: any, props?: any) => {
      let ret = {
        uid,
        update: (mode: any) => {
          setState(app.state(mode, uid))
          if (mode === C.UPDATE_SELF && prm?.updated) { prm.updated(C.UPDATE_IF_NOT, uid) }
        },
        ready: () => !!(appvars.astate && ctx[uid]?.phase),
        vars: ctx[uid]?.vars || {} as V,
        props: (props || ctx[uid]?.props || {}) as P,
      }
      if (vars) { for (const k in vars) { (ret.vars as any)[k] = vars[k] } }
      return ret as SetupType<V, P>
    }
    putAll(self, self())
    if (!appvars?.router) { appvars.router = router as any }
    React.useEffect(() => {
      let retproc: any = () => { }
      let res = C.UNDEFINED
      switch (phase) {
      case 0: {
        setPhase(1)
        log.trace('CHECK-MOUNTED:', prm?.name || uid, prm?.mounted)
        applyRipple()
        if (prm?.mounted) {
          setTimeout(async () => {
            try {
              await app.until(() => app.astate() >= C.APPSTATE_USER, { maxcheck: 1000, interval: 10 })
              const releaser = (v: Function) => (ctx[uid]?.releaselist || []).push(v)
              res = prm?.mounted && prm.mounted({ releaser })
              compoSubscribe(prm, uid, setState)
              if (res && res instanceof Promise) { res = await res }
            } catch (e) { log.trace('E:', e) }
            setPhase(2)
          }, 0)
        } else {
          compoSubscribe(prm, uid, setState)
          setPhase(2)
        }
      } break
      case 1: { } break
      case 2: {
        retproc = () => {
          /** 종료스크립트 */
          try {
            if (prm?.unmount) { prm?.unmount && prm.unmount() } 
          } catch (e) { log.trace('E:', e) }
          for (const releaser of (ctx[uid]?.releaselist || [])) {
            if (releaser && releaser instanceof Function) { releaser() }
          }
          delete ctx[uid]
          log.trace('CTX-QTY:', Object.keys(ctx).length)
        }
      } break }
      return retproc
    }, [phase])
    return self
  },
  /**
   * 페이지 이동함수, /pages 폴더 를 기준으로 한 uri 절대경로를 입력해 주면 된다
   * useRouter 를 사용했으므로 경로파라메터도 인식하며, -1 입력시 뒤로가기 기능을 수행한다.
   **/
  goPage(uri: string | number, param?: any) {
    // log.debug('GO-PAGE:', uri, appvars.router)
    return new Promise<any>(async (resolve, reject) => {
      let prevuri = String(location.pathname)
      const callback = async () => {
        if (String(location.pathname) !== prevuri) {
          app.uriChanged({ prev: prevuri, current: String(location.pathname) })
          resolve(prevuri = location.pathname)
          window.removeEventListener('beforeunload', callback)
          observer.disconnect()
        }
      }
      const observer = new MutationObserver(callback)
      observer.observe(document, { subtree: true, childList: true })
      window.addEventListener('beforeunload', callback)
      if (typeof uri === C.STRING) {
        try {
          await appvars.router.push(String(uri), String(uri), param)
        } catch (e) {
          log.debug('E:', e)
          reject(e)
        }
      } else if (typeof uri === C.NUMBER) {
        history.go(Number(uri))
      }
    })
  },
  replacePage(uri: string, param?: any) {
    const callback = () => {
      window.removeEventListener('popstate', callback)
      app.goPage(uri, param)
    }
    window.addEventListener('popstate', callback)
    history.go(-1)
  },
  async uriChanged({ prev, current }: any) {
    let data = current.replace(/^[\/]/, '').split(/[\/]/)
    let cate = ''
    log.trace('DATA:', data.length, data)
    if (data.length == 1 && data[0] == '' && (cate = 'mai') || (data.length > 0 && (cate = data[0]).length == 3)) {
      log.trace('URI-CHANGED:', prev, current, cate)
    }
  },
  sleep(time: number) { return new Promise(r => setTimeout(r, time)) },
  createElement: React.createElement,
  /** react 페이지 선언 */
  definePage<A extends Function1<PagePropsType & Record<string, any>, any>, B, C extends A & B>(compo?: A, _opts?: B) {
    let page = C.UNDEFINED
    let opts: any = _opts
    if (compo && compo instanceof Function) {
      let pagevars = { } as Record<string, any>
      page = (_props: PagePropsType) => {
        let props: PagePropsType = C.UNDEFINED
        /** TODO: 필요한 메소드들을 바인드 한다. (렌더링이 진행될때마다 수행하므로 주의할것.) */
        // if (!pagevars.props) {
        //   let uid = app.genId()
          if (_props) {
            if (props?.router) {
              // log.debug('PAGE-PROPS:', props.router.asPath)
              appvars.router = props.router
            }
            /** 기존 i18n 초기화 부분은 이 부분으로 대체됨 */
            if (props?.pageProps?.lang) {
              try {
                const lang = JSON.parse(props.pageProps.lang)
                log.trace('I18N-LANG:', lang)
              } catch (ignore) { }
            }
          } else {
            _props = { } as any
          }
        //   pagevars.props = new Proxy(_props, {
        //     get(t, p, r) {
        //       switch (p) {
        //       case 'uid': return uid
        //       default: {
        //       let ret = (t as any)[p]
        //       return ret
        //       } }
        //     }
        //   })
        // }
        // let render = compo(pagevars.props)
        let render = compo(_props)
        return render
      }
      if (opts) {
        putAll(page, opts)
        if (opts.nossr) {
          page = dynamic(() => Promise.resolve(page as any), { ssr: false }) as any
        }
      }
    }
    return page as any as C
  },
  /** react 컴포넌트 선언 */
  defineComponent<A, B, C extends A & B>(compo?: A, _opts?: B) {
    let ret: any = compo
    let opts: any = app.copyExclude(_opts || {})
    if (compo && compo instanceof Function) {
      if (compo.length >= 2) {
        if (opts?.nossr) {
          ret = dynamic(() => Promise.resolve(forwardRef(compo as any)), { ssr: false }) as any
        } else {
          ret = forwardRef(compo as any)
        }
      } else {
        if (opts?.nossr) {
          ret = dynamic(() => Promise.resolve(compo as any), { ssr: false }) as any
        }
      }
      if (opts) {
        delete opts['nossr']
        putAll(ret, opts)
      }
    }
    return ret as any as C
  },
  /** 전역상태변수, 인자로 1이상의 값이 입력되면 subscribe 하고 있는 모든 객체에 전파된다 */
  state: (mode?: number, sendid = '') => {
    mode = Number(mode) || C.UPDATE_IF_NOT
    const state = appvars.gstate = (appvars.gstate) % (Number.MAX_SAFE_INTEGER / 2) + (mode ? 1 : 0)
    appvars.tstate[mode] = (appvars.tstate[mode] || 0) + 1
    if (mode > C.UPDATE_SELF) {
      app._dispatchState(state, mode > C.UPDATE_FULL ? mode : C.UNDEFINED, sendid)
    }
    return appvars.astate && state
  },
  /** 너무 자주 수행되지 않도록 debounce 를 걸어준다 */
  _dispatchState: debounce((state = 0, mode = 0, sendid= '') => {
    appContextStore.dispatch(appContextSlice.actions.setAppInfo({ state, mode, sendid })) 
  }, 10),
  /** 전역상태변수 상태를 모니터링(subscribe) 하도록 구독한다. */
  subscribe(fnc: Function2<number, string, void>, delay = 0) {
    const pass = () => {
      const state = appContextStore.getState()
      fnc(state?.mode || 0, state?.sendid)
    }
    const debounced: any = debounce(pass, delay)
    return appContextStore.subscribe(debounced)
  },
  /** APP 최초 구동시 수행되는 프로세스 */
  async onload(props: AppProps) {
    // appvars.router = props.router
    if (props && props.router) { appvars.router = props.router }
    if (appvars.astate == C.APPSTATE_INIT) {
      appvars.astate = C.APPSTATE_START
      try {
        putAll(window, { jQuery: $ })
        const api = (await import('@/libs/api')).default
        const crypto = (await import('@/libs/crypto')).default
        log.trace('APP-ONLOAD-LIBS', props)
        /* @ts-ignore */
        appvars.MaterialStyle = await import('@materialstyle/materialstyle/dist/js/materialstyle.esm')
        /** window.jQuery 를 사용하는 객체 바인딩 후 삭제 */
        values.delete(window, 'jQuery')
        appvars.astate = C.APPSTATE_LIBS
        const userContext = (await import('@/libs/user-context')).default
        const conf = decryptAES(encrypted(), C.CRYPTO_KEY)
        const clitime = new Date().getTime()
        putAll(appvars.config, conf)
        getLogger(LIBNAME).setLevel(conf.log.level)
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
        /** TODO: URL 방식을 사용시 $t.init 부분이 필요 없음 */
        // log.debug('INIT I18N:', $t.current())
        await $t.init(['commons', 'mai'])
        appvars.astate = C.APPSTATE_ENV
        const userInfo = userContext.getUserInfo()
        if (userInfo?.userId && (userInfo.accessToken?.expireTime || 0) > clitime) { userContext.checkExpire() }
        appvars.astate = C.APPSTATE_USER

        /** FIXME: 임시코드 */
        // {
        //   putAll(window, {
        //     $,
        //     APPPROPS: props,
        //     DIALOG: dialog,
        //     APPVARS: appvars,
        //   })
        //   const errhandler = (e: any) => {
        //     log.debug('E:', e)
        //     // e.preventDefault()
        //     // e.stopPropagation()
        //     // return false
        //   }
        //   window.addEventListener('error', errhandler)
        //   window.addEventListener('unhandledrejection', errhandler)
        //   $('#__next')[0].addEventListener('error', errhandler)
        //   $('#__next')[0].addEventListener('unhandledrejection', errhandler)
        // }
      } catch (e) {
        appvars.astate = C.APPSTATE_ERROR
        log.debug('E:', e)
        return
      }
      appvars.astate = C.APPSTATE_READY
    }
  },
  /** 입력성 컴포넌트 (input 등)에서 자동으로 값을 입력하도록 수행하는 메소드 */
  modelValue<V, P>(self: SetupType<V, P>) {
    const props = self?.props || {} as any
    const model = props?.model
    const name = props?.name?.split ? String(props.name).split(/[.]/)[0] : undefined
    const inx = props?.name?.split ? String(props.name).split(/[.]/)[1] : -1
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
  getParameter: (key?: string, props?: any) => {
    let ret: any = C.UNDEFINED
    let router = props?.router || appvars.router || undefined
    if (router && router.asPath) {
      ret = app._parseParameter({
        key, prm: { },
        route: router.route,
        path: router.asPath,
        search: '',
        query: router.query,
        options: { }
      })
      log.trace('PATH:', router.route, router.asPath, router.query)
    } else {
      ret = app._parseParameter({
        key, prm: { },
        route: history?.state?.url || '',
        path: history?.state?.as || '',
        search: location.search,
        query: { },
        options: history?.state?.options
      })
    }
    return ret
  },
  _parseParameter: ({ key, prm, route, path, search, query, options }: any) => {
    let ret: any = C.UNDEFINED
    let o: any
    try {
      const d1 = String(route || '').split(/[/]/)
      const d2 = String(path || '').split(/[/]/)
      let len = d1.length > d2.length ? d1.length : d2.length
      for (let inx = 0; inx < len; inx++) {
        if (/[\[]([a-zA-Z0-9_-]+)[\]]/.test(d1[inx] || '')) {
          prm[d1[inx].substring(1, d1[inx].length - 1)] = d2[inx]
        }
      }
    } catch (e) {
      log.debug('E:', e)
    }
    if ((o = options || {})) { for (const k of Object.keys(o)) { prm[k] = o[k] } }
    if (o = new URLSearchParams(search)) { for (const k of o.keys()) { prm[k] = o.get(k) } }
    if ((o = query || { })) { for (const k of Object.keys(o)) { prm[k] = o[k] } }
    if (Object.keys(prm).length > 0) { log.trace('PRM:', prm) }
    ret = key ? prm[key] : prm
    return ret
  },
  getUrl(props?: AppProps) {
    return location.href
  },
  getUri(props?: AppProps) {
    let ret = '/'
    if (appvars.astate) {
      ret = String(history?.state?.url || '/').replace(/[?].*$/g, '')
    }
    return ret
  },
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
    if (uri && uri.startsWith('/')) { uri = `${String(appvars.config.runtime?.basePath || '').replace(/[\/]+/g, '/')}${uri}` }
    return uri || '/'
  },
  astate: () => appvars.astate,
  ready: (astate: number = C.APPSTATE_READY) => appvars.astate >= astate ? true : false,
  tstate: (mode: number) => (appvars.astate && appvars.tstate[mode]) || 0,
  getConfig: () => appvars.config,
  MaterialStyle: (fnc: Function1<any, any>) => fnc(appvars.MaterialStyle),
  router: () => appvars.router,
  global: appvars.global,
  useGlobalRef: (name: string) => appvars.global[name] = useRef(),
  fncDefineHideOnload: () => FNC_DEFINE_HIDE_ONLOAD(),
  fncWaitCssLoading: (v: string, c: number) => FNC_WAIT_CSS_LOADING(v, c),
  changeLang: async (lang: string) => {
    await app.$t.lang(lang)
    app.state(C.UPDATE_ENTIRE, LIBNAME)
  },
}

const compoSubscribe = <V, P>(prm: LauncherProps<V, P>, uid: string, setState: Function) => {
  log.trace('CHECK-HAS-UPDATE:', prm?.name || uid, prm?.updated)
  // if (prm?.updated) {
    setTimeout(() => {
      log.trace('REGIST-SUBSCRIBE:', prm.name || uid)
      const unsubscribe = app.subscribe(async (mode, sendid) => {
        const sender = ctx[sendid] || {}
        log.trace(`SUBSCRIBE : ${sender?.name || ''} → ${prm?.name || ''}`)
        let res = prm?.updated ? prm.updated(mode, sendid) : {}
        if (res && res instanceof Promise) { res = await res }
        setState(app.state(0, uid))
      })
      ctx[uid].releaselist?.push(() => {
        log.trace('UNSUBSCRIBE...', ctx[uid]?.name || uid)
        unsubscribe()
      })
    }, 1)
  // }
}

var FNC_DEFINE_HIDE_ONLOAD = () => `
  <style type="text/css">
    body { transition: opacity 0.4s 0.2s ease; display: block !important; }
    .hide-onload { opacity: 0; }
  </style>
`.replace(/[ \r\n\t]+/gm, ' ').trim()

var FNC_WAIT_CSS_LOADING = (htmlid: string, duration: number = 1000) => `
<script>
{
  ${''/** SSR 로케일을 원한다면 현시점에서 locale을 체크하여 해당 언어로 강제 redirect 하도록 한다. */}
  console.log('CHECK-STORAGE:', localStorage.getItem('runtime'));
}
{
  var body = document.body;
  function fnunload() {
    window.removeEventListener('beforeunload', fnunload);
    body.classList.add('hide-onload');
  }
  ${''/** CSS가 적재될때 까지 대기 (깨짐방지) */}
  var c = 0;
  function findcss () {
    var s = false;
    var o = false;
    for (var i = document.styleSheets.length; i >= 0; i--) {
      if (!(s = document.styleSheets[i])) { continue; }
      if (!(s = s.rules)) { continue; }
      for (var j = 0; j < s.length; j++) {
        if (!(o = s[j])) { continue; }
        if (String(o.selectorText).startsWith('html#${htmlid}')) { return true; }
      }
    }
    return false;
  }
  function fnload() {
    if (findcss() || ((c = c + 1) > ${duration})) {
      window.addEventListener('beforeunload', fnunload);
      document.removeEventListener('DOMContentLoaded', fnload);
      body.classList.remove('hide-onload');
    } else {
      setTimeout(fnload, 10);
    }
  }
  fnload();
}
</script>
`.replace(/[ \r\n\t]+/gm, ' ').trim()

if (app.isServer()) {
  app.getParameter = (key? : string, props?: any) => {
    let ret: any = C.UNDEFINED
    let router = props?.router || appvars.router || undefined
    if (router && router.asPath) {
      ret = app._parseParameter({
        key, prm: { },
        route: router.route,
        path: router.asPath,
        search: '',
        query: router.query,
        options: { }
      })
      log.debug('PATH:', router.route, router.asPath, router.query)
    }
    return ret
  }
  app.getUrl = (props) => {
    let router = props?.router || appvars.router || undefined
    if (router && router.asPath) { return router.asPath }
    return ''
  }
  app.getUri = (props) => {
    let router = props?.router || appvars.router || undefined
    if (props && router && router.asPath) { return router.asPath }
    return ''
  }
}

export default app
export { type ContextType }