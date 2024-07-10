import * as C from '@/libs/constants'
import log from './log'

const init = async (apicd: string, opt: any) => {
  const headers = {}
  const timeout = 1000
  const signal = AbortSignal.timeout(timeout)
  return { headers, timeout, signal }
}

const mkres = async (apiType: string, apicd: string, result: Promise<any>, opt: any, resolve: Function, reject: Function) => {
  const res = await result
  const hdrs = res?.headers || { get: (v: any) => {} }
  switch (hdrs.get('content-type')) {
  case 'application/json': {
    return resolve(await res.json())
  } break
  }
  // const body = res?.body?.getReader && await res.body.getReader().read() || {}
  // const data = URL.createObjectURL(await new Response(body?.value).blob())
  return resolve({})
}

const api = {
  async ping(opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      const apicd = `cmn00000`
      const { headers, signal } = await init(apicd, opt)
      const r = fetch(api.mkuri(apicd), { method: C.GET, headers, signal })
      return await mkres(C.GET, apicd, r, opt, resolve, reject)
    })
  },
  async post(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { headers, signal } = await init(apicd, opt)
      const r = fetch(api.mkuri(apicd), { method: C.POST, headers, signal })
      return await mkres(C.POST, apicd, r, opt, resolve, reject)
    })
  },
  async get(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { headers, signal } = await init(apicd, opt)
      const r = fetch(api.mkuri(apicd), { method: C.GET, headers, signal })
      return await mkres(C.GET, apicd, r, opt, resolve, reject)
    })
  },
  async put(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { headers, signal } = await init(apicd, opt)
      const r = fetch(api.mkuri(apicd), { method: C.PUT, headers, signal })
      return await mkres(C.PUT, apicd, r, opt, resolve, reject)
    })
  },
  async delete(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { headers, signal } = await init(apicd, opt)
      const r = fetch(api.mkuri(apicd), { method: C.DELETE, headers, signal })
      return await mkres(C.DELETE, apicd, r, opt, resolve, reject)
    })
  },
  mkuri(apicd: string) {
    const mat: any = apicd && /^([a-z]+)[0-9a-zA-Z]+$/g.exec(apicd) || {}
    const ret = `/api/${mat[1]}/${mat[0]}`
    return ret 
  }
}

export default api