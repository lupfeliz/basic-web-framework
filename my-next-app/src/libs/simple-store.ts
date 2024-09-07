/**
 * @File        : simple-store.ts
 * @Author      : 정재백
 * @Since       : 2024-09-07
 * @Description : redux 대체용 으로 간단하게 사용할 수 있는 store
 * @Site        : https://devlog.ntiple.com/795
 **/
import log from './log'

type ReducerProps = {
  type?: string
  payload?: any
}

type ReducerType<T> = (state: T, prm: ReducerProps) => any

type ReducerCall<T> = (state: T | undefined, action: ReducerProps) => T

type SliceProps<T, N extends keyof any> = {
  name: string,
  initialState: T
  reducers: Record<N, ReducerType<T>>
}

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
  dispatch: (prm: ReducerProps) => T,
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

const configureStore: <T>(prm: StoreProps<T>) => StoreType<T> = <T>(prm: StoreProps<T>) => {
  const reducer = [prm.reducer]
  const state = reducer[0](undefined, {})
  const uid = genId() 
  const subscribers = storeCtx.subscribers[uid] = { } as Record<string, Function>
  return {
    dispatch: (prm: ReducerProps) => {
      let ret = reducer[0](state, prm)
      for (const k in subscribers) { subscribers[k](prm) }
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
  }
}

const persistReducer = (config: any, reducer: any) => {
}

const persistStore = () => {
}

export { createSlice, configureStore, persistStore, persistReducer } 