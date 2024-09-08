import { ResultTypeFrom } from "@reduxjs/toolkit/query"

/**
 * @File        : simple-store.ts
 * @Author      : 정재백
 * @Since       : 2024-09-07
 * @Description : redux 대체용 으로 간단하게 사용할 수 있는 store
 * @Site        : https://devlog.ntiple.com
 **/
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
type ReducerProps = {
  type?: string
  payload?: any
}

type ReducerType<T> = (state: T, prm: ReducerProps) => any

type ReducerCall<T> = (state: T | undefined, action: ReducerProps) => T

type CombineResultType<T extends Record<string, any>> = ReducerCall<Record<keyof T, ReturnType<T[keyof T]>>>

type SliceProps<T, N extends keyof any> = {
  name: string,
  initialState: T
  reducers: Record<N, ReducerType<T>>
}

type CombineType<T> = (reducers: T) => T

type ActionRet<T>  = (prm: T) => ReducerProps

type SliceType<T, N extends keyof any> = {
  name: string
  reducerPath?: string
  actions: Record<N, ActionRet<T>>
  dispatch: (prm: ReducerProps) => any
  reducer: ReducerCall<T>
  caseReducers?: Function
  getInitialState?: Function
  getSelectors?: Function
  injectInto?: Function
  selectSlice?: Function
  selectors?: Function
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

const sliceCtx: Record<string, any> = {
}
const storeCtx = {
  uidseq: 0,
  subscribers: {} as Record<string, any>
}

const genId = () => String((storeCtx.uidseq = (storeCtx.uidseq + 1) % Number.MAX_SAFE_INTEGER))

const createSlice: <T, N extends string>(p: SliceProps<T, N>) => SliceType<T, N> =
  <T, N extends string>(prm: SliceProps<T, N>) => {
  sliceCtx[prm.name] = { }
  const ret: SliceType<T, N> = {
    name: prm.name,
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
    let ret = undefined as T
    if (!state) {
      ret = {} as any
      for (const k in prm.initialState) { ret[k] = prm.initialState[k] }
    } else {
      const names = String(action.type).split(/\//)
      prm && (prm.reducers as any)[names[1]](state, { payload: action.payload })
      ret = state
    }
    return ret
  }
  return ret
}

const combineReducers: <T extends Record<string, any>, R extends CombineResultType<T>>(p: T) => R = <T, R>(p: T) => {
  const ret = undefined as any as R
  return ret
}

const configureStore: <T>(prm: StoreProps<T>) => StoreType<T> = <T>(prm: StoreProps<T>) => {
  const reducer = [prm.reducer]
  const state = reducer[0](undefined, {})
  const uid = genId()
  const subscribers = storeCtx.subscribers[uid] = { } as Record<string, Function>
  return {
    dispatch: async (prm: ReducerProps) => {
      let ret = reducer[0](state, prm)
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
      return ret
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

const persistReducer = (config: any, reducer: any) => {

/**
////////////////////////////////////////////////////////////////////////////////
{
type: "persist/PERSIST"
register: function register(key)​
rehydrate: function rehydrate(key, payload, err)
}
=>
{
_persist: Object { version: 1, rehydrated: false }
userInfo: Object { userId: "", lastAccess: 0, notifyExpire: false, … }
}
////////////////////////////////////////////////////////////////////////////////
{
type: "persist/REHYDRATE"​
err: undefined
key: "user"
payload: Object { userInfo: {…}, _persist: {…} }
}
=>
{
_persist: Object { version: 1, rehydrated: true }
userInfo: Object { userId: "", lastAccess: 0, notifyExpire: false, … }
}
////////////////////////////////////////////////////////////////////////////////
REDUCE: undefined { type: '@@redux/INITm.n.p.t.n' } {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  }
}
REDUCE:{
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  }
} {
  type: 'persist/PERSIST',
  register: [Function: register],
  rehydrate: [Function: rehydrate]
} {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  },
  _persist: { version: 1, rehydrated: false }
}
REDUCE: {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  },
  _persist: { version: 1, rehydrated: false }
} {
  type: 'persist/REHYDRATE',
  payload: undefined,
  err: undefined,
  key: 'user'
} {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  },
  _persist: { version: 1, rehydrated: true }
}
////////////////////////////////////////////////////////////////////////////////
**/
}

const persistStore = () => {
}

const getPersistConfig = () => {
/**
key: "user"
stateReconciler: function autoMergeDeep(inboundState, originalState, reducedState)​
storage: Object { getItem: getItem(key), setItem: setItem(key, item), removeItem: removeItem(key)
}
transforms: Array []
version: 1



CHECK: {
  version: 1,
  key: 'user',
  storage: {
    getItem: [Function: getItem],
    setItem: [Function: setItem],
    removeItem: [Function: removeItem]
  },
  transforms: [],
  stateReconciler: [Function: autoMergeDeep]
}
REDUCE: undefined { type: '@@redux/INIT7.5.g.3.u.e' } {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  }
}
REDUCE: {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  }
} {
  type: 'persist/PERSIST',
  register: [Function: register],
  rehydrate: [Function: rehydrate]
} {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  }
}
REDUCE: {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  }
} {
  type: 'persist/REHYDRATE',
  payload: undefined,
  err: undefined,
  key: 'user'
} {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  }
}  

////////////////////////////////////////////////////////////////////////////////

P_REDUCE: undefined { type: '@@redux/INITo.b.w.2.9' } {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  }
}
P_REDUCE: {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  }
} {
  type: 'persist/PERSIST',
  register: [Function: register],
  rehydrate: [Function: rehydrate]
} {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  },
  _persist: { version: 1, rehydrated: false }
}
P_REDUCE: {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  },
  _persist: { version: 1, rehydrated: false }
} {
  type: 'persist/REHYDRATE',
  payload: undefined,
  err: undefined,
  key: 'user'
} {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  },
  _persist: { version: 1, rehydrated: true }
}

P_REDUCE: 
Object { userInfo: {…}, _persist: {…} }
  _persist: Object { version: 1, rehydrated: true }
  userInfo: Object { userId: "lupfeliz", userNm: "정재백", lastAccess: 0, … }
  <prototype>: Object { … }
Object { type: "user/setUserInfo", payload: {…} }
  type: "user/setUserInfo"
  payload: Object { timelabel: "30:01" }
  <prototype>: Object { … }
Object { userInfo: {…}, _persist: {…} }
  _persist: Object { version: 1, rehydrated: true }
  userInfo: Object { userId: "lupfeliz", userNm: "정재백", lastAccess: 0, … }
  <prototype>: Object { … }
  __defineGetter__: function __defineGetter__()
  __defineSetter__: function __defineSetter__()
  __lookupGetter__: function __lookupGetter__()
  __lookupSetter__: function __lookupSetter__()
  __proto__: 
  constructor: function Object()
  hasOwnProperty: function hasOwnProperty()
  isPrototypeOf: function isPrototypeOf()
  propertyIsEnumerable: function propertyIsEnumerable()
  toLocaleString: function toLocaleString()
  toString: function toString()
  valueOf: function valueOf()
  <get __proto__()>: function __proto__()
  <set __proto__()>: function __proto__()
**/
}

// const slice = createSlice({ name: 'abcd', initialState: { astate: 0, bstate: 0, cstate: 0, }, reducers: { setState: (state, { payload }) => { } } })
// const reducer1 = slice.reducer
// const reducer2 = combineReducers({ c1: slice.reducer })
// const store = configureStore({ reducer: reducer2 })
// store.getState().c1.astate;

export { createSlice, configureStore, configureStore as createStore, persistStore, persistReducer, getPersistConfig, combineReducers }