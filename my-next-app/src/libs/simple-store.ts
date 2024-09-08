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

type ActionRet<T>  = (prm: T) => ReducerProps

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
  storage: Storage
  blacklist?: Array<string>
  rootReducer: ReducerType<T>
}

const storeCtx = {
  uidseq: 0,
  subscribers: {} as Record<string, any>,
  reducers: {} as any,
  states: {} as any,
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
  const ret = (state: any, action: any) => {
    let ret: T = undefined as any
    if (action.type === TYPE_PERSIST) {
      console.log('REDUCE-TYPE:', state, action)
      /** FIXME: 임시코드 */
      // action.rehydrate = (key: any, payload: any, err: any) => {
      //   let inb = {} as T
      //   let org = {} as T
      //   let red = {} as T
      //   inb = { astate: 10, bstate: 0, cstate: 0 } as T
      //   red = config.stateReconciler(inb, org, red)
      //   ret = state
      // }
      action.register(config.key)
      action.rehydrate(config.key, state, undefined)
      // action.register(key)
      // action.rehydrate(key, payload, err)
    } else if (action.type === TYPE_REHYDRATE) {
      console.log('REDUCE-TYPE:', state, action)
      // err: undefined
      // key: "persist"
      // payload: Object { astate: 6, bstate: 8, cstate: 0, … }
      /** FIXME: 임시코드 */
      config.stateReconciler({ astate: 5, bstate: 0, cstate: 0 }, {}, state)
      ret = state
    } else {
      ret = reducer(state, action)
    }
    console.log('P_REDUCE:', state, action, ret, config)
    return ret
  }
  return ret 

/**
sessionStorage['persist:persist'] = '{"astate":"2","bstate":"1","cstate":"0","_persist":"{\\"version\\":1,\\"rehydrated\\":true}"}'
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

const persistStore = <T>(store: StoreType<T>) => {
  /** TODO: reduce(TYPE_INIT) -> reduce(TYPE_PERSIST) -> reduce(TYPE_REHYDRATE) 순서대로 수행 */

  // store.dispatch({ type: TYPE_PERSIST, register: (key) => {}, rehydrate: (key, payload, err) => {} })
  const hyinf: any = { }
  let res: any
  res = store.dispatch({
    type: TYPE_PERSIST,
    register: (key: any) => { },
    rehydrate: (key: any, payload: any, err: any) => {
      hyinf.key = key
      hyinf.pay = payload
      hyinf.err = err
    }
  })
  console.log('KEY:', hyinf.key, 'PAYLOAD:', hyinf.pay)
  res = store.dispatch({
    type: TYPE_REHYDRATE,
    payload: hyinf.pay,
    err: hyinf.err,
    key: hyinf.key
  })
  
}

const getPersistConfig = <T>(props: PersistConfig<T>) => {
  const ret = {
    key: "user",
    storage: props.storage,
    version: props.version,
    stateReconciler: (inboundState: T, originalState: T, reducedState: T, config: PersistConfig<T>) => {
      /** FIXME: 우선 config 무시 */
      Object.keys(originalState as any).map(k => (reducedState as any)[k] = (originalState as any)[k])
      Object.keys(inboundState as any).map(k => (reducedState as any)[k] = (inboundState as any)[k])
      return reducedState
    },
    transforms: [],
  }
  return  ret
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