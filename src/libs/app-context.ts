'use client'
/** APP 구동시 빈번하게 사용되는 기능들의 복합체, values 등 유틸들이 mixin 되어 있다 */
/* eslint-disable react-hooks/exhaustive-deps */
import { Function1, Function2, debounce } from 'lodash'
import $ from 'jquery'
import getConfig from 'next/config'
import { createSlice } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import React, { forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import { NextRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'
import { AES as cjaes, enc as cjenc } from 'crypto-js'

import * as C from '@/libs/constants'
import values from '@/libs/values'
import log, { getLogger } from '@/libs/log'

type UpdateFunction = (mode?: number) => void

type LauncherProps<V, P> = {
  name?: string
  mounted?: Function
  unmount?: Function
  updated?: Function2<number, string, void>
  unsubscribe?: Function
  vars?: V
  props?: P
  init?: boolean
}

type SetupType<V, P> = {
  uid: string
  update: UpdateFunction
  vars: V
  props?: P
}

type ContextType<T> = {
  [name: string]: T
}

/** 이 부분은 웹팩 플러그인(replace-loader)에 의해 자동으로 채워진다 */
const encrypted = () => '{$$ENCRYPTED$$}'

const ctx: ContextType<LauncherProps<any, any>> = { }

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

/** 메소드 별도선언시 WEBPACK 난독화에 도움이 된다 */
const decryptAES = (v: string, k: string) => JSON.parse(cjaes.decrypt(v, k).toString(cjenc.Utf8))

/** 전역 일반객체 저장소 (non-serializable 객체) */
const appvars = {
  ready: false,
  uidseq: 0,
  router: {} as NextRouter,
  config: {
    api: { timeout: 0 },
    auth: { expiry: 0 },
    security: {
      key: { rsa: '' }
    }
  }
}

/** 전역 STORE 저장소 (serializable 객체) */
const appContextSlice = createSlice({
  name: 'appContext',
  initialState: {
    state: 0,
    mode: 0,
    sendid: ''
  },
  reducers: {
    setState: (state, { payload }) => {
      if (payload?.state || 0) { state.state = payload.state }
      if (payload?.mode !== C.UNDEFINED) { state.mode = payload.mode }
      state.sendid = payload?.sendid || ''
    }
  }
})
/** 전역 STORE 선언 */
const appContextStore = configureStore({ reducer: appContextSlice.reducer })
const app = {
  /** values, log, getLogger mixin */
  ...values, log, getLogger,
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
    const router = useRouter()
    const [uid] = React.useState(app.genId())
    const [phase, setPhase] = React.useState(0)
    const [, setState] = React.useState(0)
    ctx[uid] = app.putAll(ctx[uid] || { name: prm?.name, vars: prm?.vars || { } }, { props: prm?.props || { } })
    const self = (vars?: any, props?: any) => {
      let ret = {
        uid,
        update: (mode: any) => setState(app.state(mode, uid)),
        vars: ctx[uid].vars as V,
        props: (props || ctx[uid].props) as P,
      }
      if (vars) { for (const k in vars) { (ret.vars as any)[k] = vars[k] } }
      return ret as SetupType<V, P>
    }
    app.putAll(self, self())
    if (!appvars?.router) { appvars.router = router as any }
    React.useEffect(() => {
      let retproc: any = () => { }
      let res = C.UNDEFINED
      switch (phase) {
      case 0: {
        setPhase(1)
        if (prm?.mounted) {
          setTimeout(async () => {
            try {
              res = prm?.mounted ? prm.mounted() : { }
              if (res && res instanceof Promise) { res = await res }
              const unsubscribe: any = app.subscribe(async (mode, sendid) => {
                const sender = ctx[sendid] || {}
                log.trace(`SUBSCRIBE : ${sender?.name || ''} → ${prm?.name || ''}`)
                let res = prm?.updated ? prm.updated(mode, sendid) : {}
                if (res && res instanceof Promise) { res = await res }
                setState(app.state(0, uid))
              })
              ctx[uid].unsubscribe = () => {
                log.trace('UNSUBSCRIBE...', uid)
                unsubscribe()
              }
            } catch (e) { log.trace('E:', e) }
            setPhase(2)
          }, 0)
        } else {
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
          if (ctx[uid]?.unsubscribe) { (ctx[uid] as any).unsubscribe() }
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
  async goPage(uri: string | number, param?: any) {
    // log.debug('GO-PAGE:', uri, appvars.router)
    if (typeof uri === C.STRING) {
      try {
        appvars.router.push(String(uri), String(uri), param)
      } catch (e) {
        log.debug('E:', e)
      }
    } else if (typeof uri === C.NUMBER) {
      history.go(Number(uri))
    }
  },
  /** react 페이지 선언 */
  definePage<A, B, C extends A & B>(compo?: A, _opts?: B) {
    let ret = C.UNDEFINED
    let opts: any = _opts
    if (compo) {
      ret = compo
      if (opts) {
        app.putAll(ret, opts)
        if (opts.nossr) {
          ret = dynamic(() => Promise.resolve(compo as any), { ssr: false }) as any
        }
      }
    }
    return ret as any as C
  },
  /** react 컴포넌트 선언 */
  defineComponent<A, B, C extends A & B>(compo?: A, _opts?: B) {
    let ret = C.UNDEFINED
    let opts: any = _opts
    if (compo && compo instanceof Function) {
      ret = compo.length >= 2 ? forwardRef(compo as any) : compo
      if (opts) {
        app.putAll(ret, opts)
      }
    }
    return ret as any as C
  },
  /** 전역상태변수, 인자로 1이상의 값이 입력되면 subscribe 하고 있는 모든 객체에 전파된다 */
  state: (mode: number = C.UPDATE_IF_NOT, sendid = '') => {
    let add = 0
    if (mode) { add = mode }
    const state = (appContextStore.getState().state) % (Number.MAX_SAFE_INTEGER / 2) + (add ? 1 : 0)
    if (add > 1) {
      app._dispatchState(state, mode > 2 ? mode : C.UNDEFINED, sendid)
    }
    return state
  },
  /** 너무 자주 수행되지 않도록 debounce 를 걸어준다 */
  _dispatchState: debounce((state = 0, mode = 0, sendid= '') => {
    appContextStore.dispatch(appContextSlice.actions.setState({ state, mode, sendid })) 
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
  ready(props: AppProps) {
    const $body = $(document.body)
    if (!appvars.ready) {
      appvars.ready = true
      try {
        const conf = decryptAES(encrypted(), C.CRYPTO_KEY)
        app.putAll(appvars.config, conf)
        log.setLevel(conf.log.level)
        log.debug('CONF:', conf)
      } catch (e) { log.debug('E:', e) }
      const fnunload = async () => {
        window.removeEventListener('beforeunload', fnunload)
        $body.addClass('hide-onload')
      }
      const fnload = async () => {
        window.addEventListener('beforeunload', fnunload)
        document.removeEventListener('DOMContentLoaded', fnload)
        $body.removeClass('hide-onload')
      }
      if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', fnload)
      } else {
        fnload()
      }
    }
    appvars.router = props.router
  },
  /** 입력성 컴포넌트 (input 등)에서 자동으로 값을 입력하도록 수행하는 메소드 */
  modelValue<V, P>(self: SetupType<V, P>) {
    const props = self?.props || {} as any
    const model = props?.model
    const name = props?.name ? props.name.split(/[.]/)[0] : undefined
    const inx = props?.name ? props.name.split(/[.]/)[1] : -1
    let value = (model && name) ? model[name] : undefined
    if (typeof value == C.OBJECT) { value = value[inx] }
    const setValue = (v: any, callback?: Function) => {
      if (model && name) {
        if (typeof model[name] == C.OBJECT && inx != -1) {
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
  publicRuntimeConfig,
  serverRuntimeConfig,
  getConfig: () => appvars.config,
}

export default app
export { type ContextType }