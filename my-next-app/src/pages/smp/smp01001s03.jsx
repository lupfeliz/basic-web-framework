/**
 * @File        : smp01001s03.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 통신 샘플
 * @Site        : https://devlog.ntiple.com
 **/
import app from '@/libs/app-context'
import api from '@/libs/api'
// import { createSlice, configureStore, combineReducers } from '@reduxjs/toolkit'
import { createSlice, configureStore, combineReducers } from '@/libs/simple-store'
import { persistStore, persistReducer } from 'redux-persist'
// import { persistStore, persistReducer } from '@/libs/simple-store'
import { getPersistConfig } from 'redux-deep-persist'
import storage from 'redux-persist/lib/storage/session'
import * as C from '@/libs/constants'
import crypto from '@/libs/crypto'
import { Button, Block, Container } from '@/components'
import userContext from '@/libs/user-context'

const { log, definePage, useSetup, goPage, getParameter, putAll, asType } = app

const slice1 = createSlice({
  name: 'slice1',
  initialState: {
    astate: 0,
    bstate: 0,
    cstate: 0,
  },
  reducers: {
    setState: (state, prm) => {
      log.debug('REDUCE1:', state, prm)
      const { payload } = prm
      payload.astate !== C.UNDEFINED && (state.astate = payload.astate)
      payload.bstate !== C.UNDEFINED && (state.bstate = payload.bstate)
      payload.cstate !== C.UNDEFINED && (state.cstate = payload.cstate)
    }
  }
})
const slice2 = createSlice({
  name: 'slice2',
  initialState: {
    dstate: 0,
    estate: 0,
    fstate: 0,
  },
  reducers: {
    setState: (state, { payload }) => {
      // log.debug('REDUCE2:', state, payload)
      payload.dstate !== C.UNDEFINED && (state.dstate = payload.dstate)
      payload.estate !== C.UNDEFINED && (state.estate = payload.estate)
      payload.fstate !== C.UNDEFINED && (state.fstate = payload.fstate)
    }
  }
})

log.debug('SLICE1:', slice1)

const wreducer = (...p) => {
  const ret = slice1.reducer(...p)
  log.debug('WREDUCER:', ...p, ' => ', ret)
  return ret
}

const config = getPersistConfig({
  key: 'persist',
  version: 1,
  storage,
  blacklist: [ ],
  rootReducer: wreducer,
  debug: true
})

const configwrap = asType(putAll({}, config), config)

configwrap.stateReconciler = putAll((...p) => {
  // log.debug('PERSIST-CONFIG:', config.stateReconciler, inboundState, originalState, reducedState)
  let ret
  if (config.stateReconciler) {
    try {
      ret = config.stateReconciler(...p)
    } catch (e) {
      log.debug('E:', ret, ...p)
      log.debug('E:', e)
    }
  }
  log.debug('STATERECONCILER:', ...p, ' => ', ret)
  return ret
})

const preducer = persistReducer(configwrap, wreducer)
const pwreducer = (...p) => {
  const ret = preducer(...p)
  log.debug('PWREDUCER:', ...p, ' => ', ret)
  return ret
}

const c = combineReducers({ c1: slice1.reducer, c2: slice2.reducer })
const A = (...p) => {
  const ret = c(...p)
  log.debug('COMBINED:', ...p, ' => ', ret)
  return ret
}
const store1 = configureStore({
  reducer: pwreducer,
  middleware: (middleware) => middleware({ serializableCheck: false })
})
  
const store2 = configureStore({ reducer: slice2.reducer })
const store3 = configureStore({ reducer: A })

const STORE1 = asType(putAll({}, store1), store1)

STORE1.dispatch = (...p) => {
  const ret = store1.dispatch(...p)
  log.debug('DISPATCH:', ...p, ' => ', ret)
  return ret
}
STORE1.subscribe = (...p) => {
  const ret = store1.subscribe(...p)
  log.debug('SUBSCRIBE:', ...p, ' => ', ret)
  return ret
}

STORE1.getState = (...p) => {
  const ret = store1.getState(...p)
  log.debug('GETSTATE:', ret)
  return ret
}

STORE1.replaceReducer = (...p) => {
  const ret = store1.replaceReducer(...p)
  log.debug('REPLACE-REDUCER:', ...p, ' => ', ret)
  return ret
}

persistStore(STORE1)

export default definePage((props) => {
  const self = useSetup({
    vars: {
    },
    async mounted() {
      STORE1.subscribe((v) => { update(C.UPDATE_SELF) })
      store2.subscribe((v) => { update(C.UPDATE_SELF) })
      store3.subscribe((v) => { update(C.UPDATE_SELF) })
      putAll(window, {
        SLICE1: slice1,
        SLICE2: slice2,
        STORE1: STORE1,
        STORE2: store2,
        STORE3: store3,
      })
    }
  })

  const { update, vars, ready } = self()
  const onClick = async (v) => {
    switch (v) {
    case 1: {
      STORE1.dispatch(slice1.actions.setState({ astate: Number(STORE1.getState().astate || 0) + 1 }))
    } break
    case 2: {
      STORE1.dispatch(slice1.actions.setState({ bstate: Number(STORE1.getState().bstate|| 0) + 1 }))
    } break
    case 3: {
      store2.dispatch(slice2.actions.setState({ dstate: Number(store2.getState().dstate || 0) + 1 }))
    } break
    case 4: {
      store2.dispatch(slice2.actions.setState({ estate: Number(store2.getState().estate || 0) + 1 }))
    } break
    default: }
  }
  return (
  <Container>
    <section className='title'>
      <h2>STORE샘플</h2>
    </section>
    <hr/>
    <section>
      <Block>
        { ready() && (
        <>
        [ASTATE: {STORE1.getState().astate} / BSTATE: {STORE1.getState().bstate}]
        [DSTATE: {store2.getState().dstate} / ESTATE: {store2.getState().estate}]
        </>
        ) }
      </Block>
      <Block>
        <Button
          onClick={ () => onClick(1) }
          >
          CLICK1
        </Button>
        <Button
          onClick={ () => onClick(2) }
          >
          CLICK2
        </Button>
        <Button
          onClick={ () => onClick(3) }
          >
          CLICK3
        </Button>
        <Button
          onClick={ () => onClick(4) }
          >
          CLICK4
        </Button>
      </Block>
    </section>
  </Container>
  )
})