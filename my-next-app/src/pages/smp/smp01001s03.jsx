/**
 * @File        : smp01001s03.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 통신 샘플
 * @Site        : https://devlog.ntiple.com
 **/
import app from '@/libs/app-context'
import api from '@/libs/api'
import { createSlice, configureStore, combineReducers } from '@reduxjs/toolkit'
// import { createSlice, configureStore } from '@/libs/simple-store'
import * as C from '@/libs/constants'
import crypto from '@/libs/crypto'
import { Button, Block, Container } from '@/components'
import userContext from '@/libs/user-context'

const { log, definePage, useSetup, goPage, getParameter } = app

const slice = createSlice({
  name: 'appContext',
  initialState: {
    astate: 0,
    bstate: 0,
    cstate: 0,
  },
  reducers: {
    setState: (state, { payload }) => {
      payload.astate !== C.UNDEFINED && (state.astate = payload.astate)
      payload.bstate !== C.UNDEFINED && (state.bstate = payload.bstate)
      payload.cstate !== C.UNDEFINED && (state.cstate = payload.cstate)
    }
  }
})
const reducer = slice.reducer
const c = combineReducers({ c1: slice.reducer })
const store = configureStore({ reducer: reducer })

export default definePage((props) => {
  const self = useSetup({
    vars: {
    },
    async mounted() {
      store.subscribe((v) => {
        log.debug('SUBSCRIBED:', v, store.getState())
        // update(C.UPDATE_SELF)
      })
    }
  })
  const { update, vars, ready } = self()
  const onClick = async (v) => {
    switch (v) {
    case 1: {
      log.debug('STATE:', store.getState())
      store.dispatch(slice.actions.setState({ astate: Number(store.getState().astate || 0) + 1 }))
    } break
    case 2: {
      log.debug('STATE:', store.getState())
      store.dispatch(slice.actions.setState({ bstate: Number(store.getState().bstate || 0) + 1 }))
    } break
    case 3: {
      log.debug('STATE:', store.getState())
      slice.actions.setState({ astate: Number(store.getState().astate || 0) + 1 })
      // store.getState().astate += 1
    } break
    case 4: {
      log.debug('STATE:', store.getState())
      slice.actions.setState({ bstate: Number(store.getState().bstate || 0) + 1 })
      // store.getState().bstate += 1
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
        [ASTATE: {store.getState().astate} / BSTATE: {store.getState().bstate}]
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