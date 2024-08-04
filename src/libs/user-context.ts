import { createSlice, configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { getPersistConfig } from 'redux-deep-persist'
import storage from 'redux-persist/lib/storage/session'

import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import api from '@/libs/api'

const { log, clone } = app

/** 사용자 정보 */
const schema = {
  userInfo: {
    userId: '',
    userNm: '',
    accessToken: { value: '', expireTime: 0 },
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false
  }
}

const slice = createSlice({
  name: 'user',
  initialState: schema,
  reducers: {
    setUserInfo: (state, action) => {
      const p: any = action.payload
      for (const k in p) { (state.userInfo as any)[k] = p[k] }
    }
  }
})

const persistConfig = getPersistConfig({
  key: 'user',
  version: 1,
  storage,
  blacklist: [ ],
  rootReducer: slice.reducer
})

const userStore = configureStore({
  reducer: persistReducer(persistConfig, slice.reducer),
  /** serialize 경고 방지용 */
  middleware: (middleware) => middleware({ serializableCheck: false })
})

const persistor = persistStore(userStore)

const userProps = {
  timerHandle: C.UNDEFINED as any
}


const userContext = {
  setUserInfo(info: any) {
    userStore.dispatch(slice.actions.setUserInfo(info))
  },
  getUserInfo() {
    return (userStore.getState().userInfo) as typeof schema.userInfo
  },
  async tokenRefresh() {
    // try {
    //   await api.tokenRefresh()
    // } catch (e) {
    //   log.debug('E:', e)
    // }
  },
  async checkExpire() {
    if (userProps.timerHandle) { clearTimeout(userProps.timerHandle) }
    const current = new Date().getTime()
    const userInfo = userContext.getUserInfo()
    let accessToken = userInfo.accessToken
    let refreshToken = userInfo.refreshToken
    let expired = false
    /** 액세스토큰 조회 */
    if ((accessToken?.expireTime || 0) > current) {
      const diff = Math.floor((accessToken.expireTime - current) / 1000)
      const minute = Math.floor(diff / 60)
      const mod = diff - (minute * 60)
      if (mod % 10 == 0) { log.debug(`DIFF: ${minute} min ${mod} sec / ${diff} / ${current} / ${app.getConfig().auth?.expiry}`) }
    }
    if (refreshToken?.value && refreshToken?.expireTime < (current - C.EXTRA_TIME)) {
      log.debug('REFRESH-TOKEN EXPIRED')
      /** TODO: REFERESH 토큰 만료처리 */
    }
    // log.debug('CHECK:', Math.floor((accessToken.expireTime - (current + C.EXPIRE_NOTIFY_TIME - C.EXTRA_TIME)) / 1000))
    if ((accessToken?.value && accessToken?.expireTime <
      (current + C.EXPIRE_NOTIFY_TIME - C.EXTRA_TIME)) && !userInfo?.notifyExpire
      ) {
      // dialog.authModal({ visible: true })
    }
    if (accessToken?.value && accessToken?.expireTime < (current - C.EXTRA_TIME)) {
      log.debug('ACCESS-TOKEN EXPIRED')
      if (accessToken.value && accessToken?.expireTime >= 0) {
        expired = true
        userContext.logout()
      }
    }

    accessToken = clone(userInfo.accessToken)
    userStore.dispatch(slice.actions.setUserInfo({ accessToken }))
    if (!expired) {
      userProps.timerHandle = setTimeout(userContext.checkExpire, 1000)
    }
  },
  async logout(notify: boolean = true) {
    userStore.dispatch(slice.actions.setUserInfo(
      clone(schema.userInfo)))
    // dialog.authModal({ visible: false })
    // if (notify) {
    //   await dialog.alert('로그아웃 되었어요')
    // }
    // app.getRouter().push(C.MAI01001S01)
  },
  subscribe(fnc: any) {
    userStore.subscribe(fnc)
  },
}

export { userStore, persistor }
export default userContext