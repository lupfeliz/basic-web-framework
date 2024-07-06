'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { Function0, Function2, debounce } from 'lodash'
import getConfig from 'next/config'
import $ from 'jquery'
import { createSlice } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import React, { forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import { NextRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'

import * as C from '@/libs/constants'
import values from '@/libs/values'
import crypto from '@/libs/crypto'
import log, { getLogger } from '@/libs/log'
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

type LauncherProps = {
  mounted?: Function0<any>
  work?: Function0<any>
  unmount?: Function0<any>
  init?: boolean
  id?: string
}

type ContextType<T> = {
  [name: string]: T
}

const appContextSlice = createSlice({
  name: 'appContext',
  initialState: {
    state: 0,
    mode: 0
  },
  reducers: {
    setState: (state, action) => {
      if (action?.payload?.state || 0) {
        state.state = action.payload.state
      }
      if (action?.payload?.mode !== C.UNDEFINED) {
        state.mode = action.payload.mode
      }
    }
  }
})

const appContextStore = configureStore({
  reducer: appContextSlice.reducer
})

const appConfig = {
  router: {} as NextRouter
}

const app = {
  ...values,
  log, getLogger,
  genId() {
    return `${new Date().getTime()}${values.randomStr(3, C.NUMBER)}`
  },
  useUpdate() {
    const[state, setState] = React.useState(0)
    return (v: number = 0) => setState(v)
  },
  useLauncher(prm: LauncherProps) {
    const router = useRouter()
    const [phase, setPhase] = React.useState(0)
    if (!appConfig?.router) { appConfig.router = router as any }
    React.useEffect(() => {
      let retproc = () => { }
      let res = C.UNDEFINED
      switch (phase) {
      case 0: {
        setPhase(1)
        if (prm?.mounted) {
          setTimeout(async () => {
            try {
              res = prm?.mounted ? prm.mounted() : {}
              if (res instanceof Promise) { res = await res }
            } catch (e) { log.debug('E:', e) }
            setPhase(2)
          }, 0)
        } else {
          setPhase(2)
        }
      } break
      case 1: { } break
      case 2: {
        setPhase(3)
        if (prm?.work) {
          setTimeout(async () => {
            try {
              res = prm?.work ? prm.work() : {}
              if (res instanceof Promise) { res = await res }
            } catch (e) { log.debug('E:', e) }
            setPhase(4)
          }, 0)
        } else {
          setPhase(4)
        }
      } break
      case 3: { } break
      case 4: {
        /** 종료스크립트 */
        if (prm?.unmount) { return prm.unmount }
      } break }
      return retproc
    }, [phase])
    return phase
  },
  async goPage(uri: string | number, param?: any) {
    // log.debug('GO-PAGE:', uri, appConfig.router)
    if (typeof uri === C.STRING) {
      try {
        appConfig.router.push(String(uri), String(uri), param)
      } catch (e) {
        log.debug('E:', e)
      }
    } else if (typeof uri === C.NUMBER) {
      history.go(Number(uri))
    }
  },
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
  defineComponent<A, B, C extends A & B>(compo?: A, _opts?: B) {
    let ret = C.UNDEFINED
    let opts: any = _opts
    if (compo) {
      ret = forwardRef(compo as any)
      if (opts) {
        app.putAll(ret, opts)
      }
    }
    return ret as any as C
  },
  state: (add = 0, mode = C.UNDEFINED) => {
    if ((add !== 0 && !add) || isNaN(add)) { add = 0 }
    const state = (appContextStore.getState().state) % (Number.MAX_SAFE_INTEGER / 2) + add 
    if (add !== 0) {
      app._dispatchState(state, mode)
    } else if (mode != C.UNDEFINED) {
      app._dispatchState(state, mode)
    }
    return state
  },
  /** 너무 자주 수행되지 않도록 debounce 를 걸어준다 */
  _dispatchState: debounce((state = 0, mode = 0) => {
    appContextStore.dispatch(appContextSlice.actions.setState({ state, mode })) 
  }, 10),
  /** 전역상태변수 상태를 모니터링 하도록 구독한다. */
  subscribe(fnc: Function, delay = 0) {
    const pass = () => {
      const state = appContextStore.getState()
      fnc(state?.state || 0, state?.mode || 0)
    }
    const debounced: any = debounce(pass, delay)
    appContextStore.subscribe(debounced)
  },
  ready(props: AppProps) {
    const $body = $(document.body)
    try {
      const el = document.querySelector('script#page-config[type="text/plain"]')
      const conf = JSON.parse(crypto.aes.decrypt(el?.innerHTML || '', '{$$CRYPTO_KEY$$}'))
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
    appConfig.router = props.router
  },
  modelValue(ctx: any) {
    const props = ctx?.props || {}
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
    return { props, model, name, inx, value, setValue }
  },
  pubconf: publicRuntimeConfig,
  svrconf: serverRuntimeConfig,
}

export default app
export { type ContextType }