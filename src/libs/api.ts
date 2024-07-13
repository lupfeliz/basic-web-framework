import * as C from '@/libs/constants'
import log from './log'
import values from './values'
import http from 'http'
import https from 'https'

type OptType = {
  method?: String
  apicd?: String
  resolve?: Function
  reject?: Function
}

const { putAll } = values
const keepalive = true

const init = async (method: string, apicd: string, data?: any, opt?: any) => {
  const headers = putAll({}, opt?.headers || {})
  const timeout = opt?.timeout || 1000
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
  return { method, url, body, headers, timeout, signal }
}

const mkres = async (result: Promise<any>, opt?: OptType) => {
  const res = await result
  const hdrs = res?.headers || { get: (v: any) => {} }
  switch (hdrs.get('content-type')) {
  case 'application/json': {
    return opt?.resolve && opt.resolve(await res.json())
  } break
  }
  // const body = res?.body?.getReader && await res.body.getReader().read() || {}
  // const data = URL.createObjectURL(await new Response(body?.value).blob())
  return opt?.resolve && opt.resolve({})
}

const api = {
  async ping(opt?: any) {
    // return new Promise<any>(async (resolve, reject) => {
    //   const apicd = `cmn00000`
    //   const { method, headers, signal, url } = await init(C.GET, apicd, opt)
    //   const r = fetch(url, { method, headers, signal, keepalive })
    //   return await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
    // })
    return
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