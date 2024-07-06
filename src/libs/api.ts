import * as C from '@/libs/constants'

const init = async (apicd: string, opt: any) => {
  const headers = {}
  const timeout = 0
  return { headers, timeout }
}

const processResult = async (apiType: string, apicd: string, result: Promise<any>, opt: any, resolve: Function, reject: Function) => {
}

const api = {
  async ping(opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { headers, timeout } = await init(``, opt)
      return resolve(true)
    })
  },
  async post(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { headers, timeout } = await init(apicd, opt)
      const result = new Promise<any>(() => { })
      return await processResult(C.POST, apicd, result, opt, resolve, reject)
    })
  },
  async get(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { headers, timeout } = await init(apicd, opt)
      const result = new Promise<any>(() => { })
      return await processResult(C.POST, apicd, result, opt, resolve, reject)
    })
  },
  async put(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { headers, timeout } = await init(apicd, opt)
      const result = new Promise<any>(() => { })
      return await processResult(C.POST, apicd, result, opt, resolve, reject)
    })
  },
  async delete(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const result = new Promise<any>(() => { })
      return await processResult(C.POST, apicd, result, opt, resolve, reject)
    })
  }
}

export { api }