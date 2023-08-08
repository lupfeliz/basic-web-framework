import { log } from '@/libs/commons/log'
import * as C from '@/libs/commons/constants'

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

const apiPost = async (prm: any, opt?: any) => {
  const ret = await axios.post(`${API_BASE}/api/${prm.act}`, JSON.stringify(prm.data), dconf) 
  return ret
}

const apiPut = async (prm: any, opt?: any) => {
  const ret = await axios.put(`${API_BASE}/api/${prm.act}`, JSON.stringify(prm.data), dconf) 
  return ret
}

const apiGet = async (prm: any, opt?: any) => {
  const ret = await axios.get(`${API_BASE}/api/${prm.act}`, dconf) 
  return ret
}

const apiDel = async (prm: any, opt?: any) => {
  const ret = await axios.delete(`${API_BASE}/api/${prm.act}`, dconf) 
  return ret
}

export { apiPost, apiGet, apiPut, apiDel }