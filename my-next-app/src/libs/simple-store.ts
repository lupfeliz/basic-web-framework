/**
 * @File        : simple-store.ts
 * @Author      : 정재백
 * @Since       : 2024-09-07
 * @Description : redux 대체용 으로 간단하게 사용할 수 있는 store
 * @Site        : https://devlog.ntiple.com
 **/
import lodash from 'lodash'
const { debounce } = lodash

type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
type ReducerProps = {
  type?: string
  payload?: any
  [name: string]: any
}

type ReducerType<T> = (state: T, prm: ReducerProps) => any

type ReducerCall<T> = (state: T | undefined, action: ReducerProps) => T

type CombineResultType<T extends Record<string, any>> = ReducerCall<Record<keyof T, ReturnType<T[keyof T]>>>

type SliceProps<T, N extends keyof any> = {
  name: string,
  initialState: T
  reducers: Record<N, ReducerType<T>>
}

type ActionRet<T>  = (prm: T | Record<string, any>) => ReducerProps

type SliceType<T, N extends keyof any> = {
  name: string
  reducerPath: string
  actions: Record<N, ActionRet<T>>
  // dispatch: (prm: ReducerProps) => any
  reducer: ReducerCall<T>
  caseReducers?: Record<N, ReducerCall<T>>
  getInitialState?: Function
  getSelectors?: Function
  injectInto?: Function
  selectSlice?: Function
  selectors?: any
}

type StoreProps<T> = {
  reducer: ReducerCall<T>
}

type StoreType<T> = {
  dispatch: (prm: ReducerProps) => any,
  subscribe: (fnc: Function) => any,
  getState: () => T,
  replaceReducer: () => any
}

type PersistConfig<T> = {
  key: string
  version?: number
  storage: StorageType
  blacklist?: Array<string>
  rootReducer: ReducerType<T>
}

type StorageType = {
  getItem: (k: string) => Promise<string>
  setItem: (k: string, v: string) => Promise<void>
  removeItem: (k: string) => Promise<void>
}

const storeCtx = {
  uidseq: 0,
  subscribers: {} as Record<string, any>,
  reducers: {} as any,
  states: {} as any,
  storage: {} as Record<string, StorageType>
}

const genId = () => String((storeCtx.uidseq = (storeCtx.uidseq + 1) % Number.MAX_SAFE_INTEGER))

const TYPE_INIT = '@@redux/INIT'
const TYPE_PERSIST = 'persist/PERSIST'
const TYPE_REHYDRATE = 'persist/REHYDRATE'

const createSlice: <T, N extends string>(p: SliceProps<T, N>) => SliceType<T, N> =
  <T, N extends string>(prm: SliceProps<T, N>) => {
  const mystate: any = storeCtx.states[prm.name] = { }
  const reducers: any = storeCtx.reducers[prm.name] = prm.reducers
  const ret: SliceType<T, N> = {
    name: prm.name,
    reducerPath: prm.name,
    actions: { }
  } as any
  for (const action in prm.reducers) {
    ret.actions[action] = (payload: any) => {
      return {
        type: `${prm.name}/${action}`,
        payload
      }
    }
  }
  ret.reducer = (state, action) => {
    let ret = mystate
    const actionType = String(action.type || '')
    if (!state || actionType === TYPE_INIT) {
      // console.log('INIT:', action.type)
      for (const k in prm.initialState) { ret[k] = prm.initialState[k] }
    } else if (actionType === TYPE_PERSIST) {
      // console.log('PERSIST:', action)
    } else if (actionType === TYPE_REHYDRATE) {
      /** FIXME: 우선은 TYPE_REHYDRATE 에 대한 코드를 강제 입력한다 (범용성 무시) */
      if (!action.payload) {
        action.payload = mystate
        action.payload._persist = { rehydrated: true }
      } else {
        Object.keys(action.payload).map(k => mystate[k] = action.payload[k])
      }
      // console.log('REHYDRATE:', mystate, state, action)
    } else {
      // console.log('REDUCE!!:', state, action)
      const names = actionType.split(/\//)
      if (reducers && reducers[names[1]]) {
        reducers[names[1]](mystate, action)
      } else {
        ret = state
      }
    }
    return ret
  }
  return ret
}

const combineReducers: <T extends Record<string, any>, R extends CombineResultType<T>>(p: T) => R = <T, R>(map: T) => {
  const rootState= {}
  const reducer: R = ((state: any, action: any) => {
    let ret: any
    if (!state) {
      ret = rootState
      for (const k1 in map) {
        const prm: any = map[k1]
        ret[k1] = prm(state, action)
        // console.log('COMBINE-PRM:', k1, prm, ret[k1])
      }
    } else {
      // console.log('REDUCE:', state, state == rootState, action)
      const names = String(action.type).split(/\//)
      const reducers: any = storeCtx.reducers[names[0]]
      const mystate: any = storeCtx.states[names[0]]
      if (reducers && reducers[names[1]]) {
        reducers[names[1]](mystate, action)
        ret = mystate
      }
    }
    return ret
  }) as any
  return reducer
}

const configureStore: <T>(p: StoreProps<T>) => StoreType<T> = <T>(prm: StoreProps<T>) => {
  const reducer = [prm.reducer]
  const state = reducer[0](undefined, { type: TYPE_INIT })
  const uid = genId()
  const subscribers = storeCtx.subscribers[uid] = { } as Record<string, Function>
  return {
    dispatch: (prm: ReducerProps) => {
      reducer[0](state, prm)
      for (const k in subscribers) {
        try {
          if (subscribers[k]) {
            subscribers[k]()
          } else {
            delete subscribers[k]
          }
        } catch (e) {
          delete subscribers[k]
        }
      }
      return prm
    },
    subscribe: (fnc: Function) => {
      const sid = genId()
      subscribers[sid] = fnc
      // log.debug('ADD-SUBSCRIBE:', Object.keys(subscribers).length)
      return () => {
        delete subscribers[sid]
        // log.debug('REMOVE-SUBSCRIBE:', Object.keys(subscribers).length)
      }
    },
    getState: () => state,
    replaceReducer: () => { }
  } as StoreType<T>
}

const persistReducer = <T>(config: any, reducer: ReducerType<T>) => {
  // console.log('CONFIG:', config)
  const write = debounce((v: any) => {
    let str = JSON.stringify(v || {})
    // console.log('WRITE:', str)
    config.storage.setItem(`persist:${config.key}`, str)
  }, 100)
  storeCtx.storage[config.key] = config.storage
  const ret = (state: any, action: any) => {
    let ret: T = undefined as any
    if (action.type === TYPE_PERSIST) {
      // console.log('REDUCE-TYPE:', state, action, config.key)
      /** FIXME: 임시코드 */
      action.register(config.key)
      ret = reducer(state, action)
    } else if (action.type === TYPE_REHYDRATE) {
      // console.log('REDUCE-TYPE:', state, action, config.key)
      /** FIXME: 임시코드 */
      ret = config.stateReconciler(action.payload, reducer(undefined as any, {}), state)
      ret = reducer(ret, action)
    } else {
      ret = reducer(state, action)
      write(ret)
    }
    // console.log('P_REDUCE:', state, action, ret, config)
    return ret
  }
  return ret 
}

const persistStore = async <T>(store: StoreType<T>) => {
  /** TODO: reduce(TYPE_INIT) -> reduce(TYPE_PERSIST) -> reduce(TYPE_REHYDRATE) 순서대로 수행 */
  const hyinf: any = { }
  let res: any
  const persi = {
    type: TYPE_PERSIST,
    register: (key: any) => { hyinf.key = key },
    rehydrate: (key: any, payload: any, err: any) => {
      hyinf.key = key
      hyinf.pay = payload
      hyinf.err = err
    }
  }
  const getData = async (key: string) => {
    let ret = undefined as any
    if (typeof window) {
      const ss = storeCtx.storage[key]
      // console.log('READ-STORAGE', key)
      const data = await ss.getItem(`persist:${key}`)
      // console.log('DATA:', `persist:${key}`, data)
      if (data) {
        ret = JSON.parse(data)
      }
    }
    return ret
  }
  res = store.dispatch(persi)
  const data = await getData(hyinf.key)
  // console.log('KEY:', hyinf.key, 'PAYLOAD:', data)
  res = store.dispatch({
    type: TYPE_REHYDRATE,
    payload: data,
    err: hyinf.err,
    key: hyinf.key
  })
  // console.log('DISPATCH-FINISHED')
  persi.rehydrate(hyinf.key, data, hyinf.err)
  // console.log('REHYDRATE-FINISHED')
}

const getPersistConfig = <T>(props: PersistConfig<T>) => {
  const ret = {
    key: props.key,
    storage: props.storage,
    version: props.version,
    stateReconciler: (inboundState: T, originalState: T, reducedState: T, config: PersistConfig<T>) => {
      /** FIXME: 우선 config 무시, state 는 readonly 이므로 직접 접근 불가 */
      let ret: any = {}
      if (!reducedState) { reducedState = {}  as any }
      ret = reducedState
      if (reducedState) {
        Object.keys(reducedState as any).map(k => ret[k] = (reducedState as any)[k])
      }
      if (originalState) {
        Object.keys(originalState as any).map(k => ret[k] = (originalState as any)[k])
      }
      if (inboundState) {
        Object.keys(inboundState as any).map(k => ret[k] = (inboundState as any)[k])
      }
      return ret
    },
    transforms: [],
  }
  return  ret
}

const createStorage: (s: Storage | false) => StorageType = (s: Storage | false) => {
  if (!s) {
    return {
      getItem: (k: string) => new Promise<string>(r => r(null as any)),
      setItem: (k: string, v: string) => new Promise<void>(r => r()),
      removeItem: (k: string) => new Promise<void>(r => r())
    }
  } else {
    return {
      getItem: (k: string) => new Promise<string>(r => r(s.getItem(k) as any)),
      setItem: (k: string, v: string) => new Promise<void>(r => r(s.setItem(k, v))),
      removeItem: (k: string) => new Promise<void>(r => r(s.removeItem(k)))
    }
  }
}

let createSessionStorage = () => createStorage(typeof window !== 'undefined' && window.sessionStorage)
let createLocalStorage = () => createStorage(typeof window !== 'undefined' && window.localStorage)

export {
  createSlice, configureStore, configureStore as createStore, persistStore, persistReducer,
  getPersistConfig, combineReducers, createLocalStorage, createSessionStorage
}