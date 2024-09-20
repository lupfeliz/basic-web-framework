/**
 * @File        : app-context.ts
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 통합기능모듈
 *                APP 구동시 빈번하게 사용되는 기능들의 복합체, values 등 유틸들이 mixin 되어 있다
 * @Site        : https://devlog.ntiple.com
 **/
/* eslint-disable react-hooks/exhaustive-deps */
import { Function1, Function2, debounce } from 'lodash'
import * as C from '@/libs/constants'
import log from '@/libs/log'

/** 전역 일반객체 저장소 (non-serializable 객체) */
const appvars = {
  astate: 0,
  gstate: 0,
  tstate: {} as any,
  uidseq: 0,
  router: {} as any,
  entrypoint: '',
  config: {
    app: { profile: '', basePath: '' },
    api: [{ base: '', alter: '', server: '', timeout: 0 }],
    auth: { expiry: 0 },
    security: {
      key: { rsa: { public: '', private: '' } }
    },
    // serverRuntimeConfig,
    // publicRuntimeConfig
  }
}
if (typeof window !== 'undefined') {
  log.debug('USE-PLUGINS...', location.pathname, history.state)
  appvars.entrypoint = location.pathname
}
const app = {
  async onload(props: any) {
    if (appvars.astate == C.APPSTATE_INIT) {
      appvars.astate = C.APPSTATE_START
      try {
        log.debug('CHECK-URL:', location.pathname, history.state, useRouter().resolve(appvars.entrypoint))
        if (appvars.entrypoint != location.pathname) {
          history.replaceState({}, '', appvars.entrypoint)
        }
        log.debug('CHECK-URL:', location.pathname, history.state, useRouter(), useRoute())
        const api = (await import('@/libs/api')).default
        const crypto = (await import('@/libs/crypto')).default
        // const userContext = (await import('@/libs/user-context')).default
        // const conf = decryptAES(encrypted(), C.CRYPTO_KEY)
        // const clitime = new Date().getTime()
        // app.putAll(appvars.config, conf)
        // log.setLevel(conf.log.level)
        // log.debug('CONF:', conf)
        // const cres = await api.get(`cmn01001`, {})
        // await crypto.rsa.init(app.getConfig().security.key.rsa.public, C.PUBLIC_KEY)
        // const kobj = JSON.parse(crypto.rsa.decrypt(cres?.check || '{}'))
        // const svrtime = Number(kobj?.t || 0)
        // /** TODO: 서버시간과 동기화 */
        // log.debug('SERVER-TIME:', svrtime)
        // const aeskey = kobj?.k || ''
        // await crypto.aes.init(aeskey)
        // /** TODO: 워크 페이지별 다국어 적재 */
        // await $t.init(['commons', 'mai'])
        // appvars.astate = C.APPSTATE_ENV
        // const userInfo = userContext.getUserInfo()
        // if (userInfo?.userId && (userInfo.accessToken?.expireTime || 0) > clitime) { userContext.checkExpire() }
        // appvars.astate = C.APPSTATE_USER
      } catch (e) {
        appvars.astate = C.APPSTATE_ERROR
        log.debug('E:', e)
      }
      appvars.astate = C.APPSTATE_READY
    }
  }
}

export default app