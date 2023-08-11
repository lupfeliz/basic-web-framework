import { log } from '@/libs/commons/log'
import * as C from '@/libs/commons/constants'
import { dialog } from '@/libs/commons/dialog'

import axios, { AxiosRequestConfig } from 'axios'

let API_BASE = ''
const headers = JSON.parse(`{ "${C.CONTENT_TYPE}": "${C.CTYPE_JSON}; ${C.CHARSET}=${C.UTF8}" }`)
const timeout = 30 * 1000
const dconf = {
  headers,
  responseType: C.JSONV,
  responseEncoding: C.UTF8,
  timeout: timeout
} as AxiosRequestConfig<string>

const errproc = async (e: any, opt: any) => {
  if (!opt?.noerr) {
    log.debug('ERROR:', e)
    let msg = '통신오류가 발생하였습니다.'
    switch (e?.response?.status) {
    case 403:
      msg = '접근 권한이 없습니다.'
      break
    case 404:
      msg = '잘못된 요청입니다.'
      break
    case 500:
      msg = '처리중 오류가 발생했습니다.'
      break
    }
    await dialog.alert(msg)
    return e
  }
}

const apiPost = async (prm: any, opt?: any) => {
  try {
    let ret
    ret = await axios.post(`${API_BASE}/api/${prm.act}`, JSON.stringify(prm.data), dconf) 
    return ret
  } catch (e) {
    return await errproc(e, opt)
  }
}

const apiPut = async (prm: any, opt?: any) => {
  try {
    let ret = await axios.put(`${API_BASE}/api/${prm.act}`, JSON.stringify(prm.data), dconf) 
    return ret
  } catch (e) {
    return await errproc(e, opt)
  }
}

const apiGet = async (prm: any, opt?: any) => {
  try {
    let ret = await axios.get(`${API_BASE}/api/${prm.act}`, dconf) 
    return ret
  } catch (e) {
    return await errproc(e, opt)
  }
}

const apiDel = async (prm: any, opt?: any) => {
  try {
    let ret = await axios.delete(`${API_BASE}/api/${prm.act}`, dconf) 
    return ret
  } catch (e) {
    return await errproc(e, opt)
  }
}

export { apiPost, apiGet, apiPut, apiDel }