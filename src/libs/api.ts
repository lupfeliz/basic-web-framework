import * as C from '@/libs/constants'
import app from './app-context'
import userContext from './user-context'
import crypto from './crypto'

type OptType = {
  method?: String
  apicd?: String
  resolve?: Function
  reject?: Function
}

const { putAll, getConfig, log } = app
const keepalive = true

const init = async (method: string, apicd: string, data?: any, opt?: any) => {
  const headers = putAll({}, opt?.headers || {})
  const timeout = opt?.timeout || getConfig()?.api?.timeout || 1000
  const signal = AbortSignal.timeout(timeout)
  const url = api.mkuri(apicd)
  
  let body: any = ''
  if (!headers[C.CONTENT_TYPE]) {
    headers[C.CONTENT_TYPE] = C.CTYPE_JSON
  }
  if (String(headers[C.CONTENT_TYPE]).startsWith(C.CTYPE_JSON)) {
    body = JSON.stringify(data || {})
  } 
  const user = userContext.getUserInfo()
  if (user && user?.accessToken?.value) {
    switch (opt?.authtype) {
    case undefined: {
      /** 일반적인 경우 */
      headers[C.AUTHORIZATION] = `${C.BEARER} ${user.accessToken?.value}`
    } break
    case C.TOKEN_REFRESH: {
      /** 추가 헤더가 필요한 경우 */
      headers[C.AUTHORIZATION] = `${C.BEARER} ${user.refreshToken?.value}`
    } break
    }
  }
  return { method, url, body, headers, signal }
}

const mkres = async (r: Promise<Response>, opt?: OptType) => {
  let ret = { }
  let t: any = ''
  const resp = await r
  const hdrs = resp?.headers || { get: (v: any) => {} }
  if ((t = hdrs.get(C.AUTHORIZATION.toLowerCase()))) {
    const auth: string[] = String(t).split(' ')
    if (auth.length > 1 && auth[0] === C.BEARER) {
      try {
        const current = new Date().getTime()
        const decval = String(crypto.aes.decrypt(auth[1]) || '').split(' ')
        log.debug('AUTH:', decval)
        if (decval && decval.length > 5) {
          /** 로그인 인경우 */
          userContext.setUserInfo({
            userId: decval[0],
            userNm: decval[1],
            accessToken: {
              value: decval[2],
              expireTime: current + Number(decval[4])
            },
            refreshToken: {
              value: (decval[3] !== '_' ? decval[3] : C.UNDEFINED),
              expireTime: current + Number(decval[3] !== '_' ? decval[5] : 0)
            }
          })
          log.debug('CHECK:', decval[3].length, decval[3])
          userContext.checkExpire()
        } else if (decval && decval.length > 3) {
          /** 로그인 연장 인경우 */
          userContext.setUserInfo({
            userId: decval[0],
            userNm: decval[1],
            accessToken: {
              value: decval[2],
              expireTime: current + Number(decval[3])
            }
          })
          userContext.checkExpire()
        }
      } catch (e) {
        log.debug('E:', e)
      }
    }
  }
  switch (hdrs.get('content-type')) {
  case 'application/json': {
    ret = await resp.json()
  } break
  case 'application/octet-stream': {
    ret = await resp.blob()
  } break
  default: }
  if (opt?.resolve) { opt.resolve(ret) }
  return ret
}

const api = {
  nextping: 0,
  async ping(opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      const apicd = `cmn00000`
      const curtime = new Date().getTime()
      if (opt?.noping) { return resolve(true) }
      if (curtime < api.nextping) { return resolve(true) }
      const { method, headers, signal, url } = await init(C.GET, apicd, opt)
      const r = fetch(url, { method, headers, signal, keepalive })
      const res: any = await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
      /** 다음 ping 은 10초 이후 */
      api.nextping = curtime + (1000 * 10)
      // res?.rescd === '0000'
      return res
    })
  },
  async post(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { method, url, body, headers, signal } = await init(C.POST, apicd, data, opt)
      const r = fetch(url, { method, body, headers, signal, keepalive })
      return await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
    })
  },
  async get(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { method, url, headers, signal } = await init(C.GET, apicd, data, opt)
      const r = fetch(url, { method, headers, signal, keepalive })
      return await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
    })
  },
  async put(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { method, url, body, headers, signal } = await init(C.PUT, apicd, data, opt)
      const r = fetch(url, { method, body, headers, signal, keepalive })
      return await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
    })
  },
  async delete(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { method, headers, signal, url } = await init(C.DELETE, apicd, data, opt)
      const r = fetch(url, { method, headers, signal, keepalive })
      return await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
    })
  },
  mkuri(apicd: string) {
    const mat: any = apicd && /^([a-z]+)[0-9a-zA-Z]+$/g.exec(apicd) || {}
    if (mat && mat[1]) {
      return `/api/${mat[1]}/${mat[0]}`
    } else {
      return apicd
    }
  }
}

export default api