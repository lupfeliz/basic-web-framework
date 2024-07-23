import * as C from '@/libs/constants'
import app from './app-context'
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
  } else if (String(headers[C.CONTENT_TYPE]).startsWith(C.CTYPE_GRAPHQL)) {
    body = data || ''
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
        log.trace('AUTH:', decval)
        // if (decval && decval.length > 5) {
        //   /** 로그인 인경우 */
        //   userContext.setUserInfo({
        //     userId: decval[0],
        //     userNm: decval[1],
        //     accessToken: {
        //       value: decval[2],
        //       expireTime: current + Number(decval[4])
        //     },
        //     refreshToken: {
        //       value: (decval[3] !== '_' ? decval[3] : C.UNDEFINED),
        //       expireTime: current + Number(decval[3] !== '_' ? decval[5] : 0)
        //     },
        //     authType: res?.data?.restyp
        //   })
        //   userContext.checkExpire()
        // } else if (decval && decval.length > 3) {
        //   /** 로그인 연장 인경우 */
        //   userContext.setUserInfo({
        //     userId: decval[0],
        //     userNm: decval[1],
        //     accessToken: {
        //       value: decval[2],
        //       expireTime: current + Number(decval[3])
        //     },
        //     authType: res?.data?.restyp
        //   })
        //   userContext.checkExpire()
        // }
      } catch (e) {
        // if ([C.LOCAL, C.DEV].indexOf(app.getAppInfo().profile) !== -1) {
        //   log.debug('E:', values.val(e, 'message'))
        // }
      }
    }
  }
  switch (hdrs.get('content-type')) {
  case 'application/json': {
    ret = await resp.json()
  } }
  return opt?.resolve && opt.resolve(ret)
}

const api = {
  async ping(opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      const apicd = `cmn00000`
      if (opt?.noping) { return resolve(true) }
      const { method, headers, signal, url } = await init(C.GET, apicd, opt)
      const r = fetch(url, { method, headers, signal, keepalive })
      return await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
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