import log from '@/libs/log'
import * as C from '@/libs/constants'
import { dialog } from '@/libs/dialog'
import axios, { AxiosRequestConfig } from 'axios'

const API_PREFIX = '/api/'
const API_BASE = ''

const headers = JSON.parse(`{ "${C.CONTENT_TYPE}": "${C.CTYPE_JSON}; ${C.CHARSET}=${C.UTF8}" }`)
const dconf = {
  headers,
  responseType: 'json',
  responseEncoding: C.UTF8,
  timeout: C.REQUEST_TIMEOUT,
  maxRedirects: 0
} as AxiosRequestConfig<string>

const errproc = async (e: any, opt: any) => {
  log.debug('ERROR:', e)
  if (!opt?.noerr) {
    let msg = '통신오류가 발생하였습니다.'
    switch (e?.response?.status) {
    case C.SC_FORBIDDEN:
      msg = '접근 권한이 없습니다.'
      break
    case C.SC_NOT_FOUND:
    case C.SC_METHOD_NOT_ALLOWD:
    case C.SC_BAD_GATEWAY:
      msg = '잘못된 요청입니다.'
      break
    case C.SC_BAD_REQUEST:
      msg = '잘못된 요청입니다.'
      break
    case C.SC_INTERNAL_SERVER_ERROR:
      msg = '처리중 오류가 발생했습니다.'
      if (e?.response?.data?.message) {
        msg = e?.response?.data?.message
      }
      break
    }
    await afterproc(opt)
    await dialog.alert(msg)
  } else {
    await afterproc(opt)
    return e?.response
  }
}

const postproc = async (opt?: any) => {
  if (!opt?.noprogress) {
    dialog.overlay(true)
  }
}
const afterproc = async (opt?: any) => {
  try {
    const { useUserInfo } = await import('@/store/commons/userinfo')
    useUserInfo().expandTimeout()
  } catch (ignore) { }
  if (!opt?.noprogress) {
    dialog.overlay(false)
  }
}

const apiPost = async (prm: any, opt?: any) => {
  try {
    await postproc(opt)
    const ret = await axios.post(`${API_BASE}${API_PREFIX}${prm.act}`, JSON.stringify(prm.data), dconf) 
    await afterproc(opt)
    return ret
  } catch (e) {
    return await errproc(e, opt)
  }
}

const apiPut = async (prm: any, opt?: any) => {
  try {
    await postproc(opt)
    const ret = await axios.put(`${API_BASE}${API_PREFIX}${prm.act}`, JSON.stringify(prm.data), dconf) 
    await afterproc(opt)
    return ret
  } catch (e) {
    return await errproc(e, opt)
  }
}

const apiGet = async (prm: any, opt?: any) => {
  try {
    await postproc(opt)
    const ret = await axios.get(`${API_BASE}${API_PREFIX}${prm.act}`, dconf) 
    await afterproc(opt)
    return ret
  } catch (e) {
    return await errproc(e, opt)
  }
}

const apiDel = async (prm: any, opt?: any) => {
  try {
    await postproc(opt)
    const ret = await axios.delete(`${API_BASE}${API_PREFIX}${prm.act}`, dconf) 
    await afterproc(opt)
    return ret
  } catch (e) {
    return await errproc(e, opt)
  }
}

export { apiPost, apiGet, apiPut, apiDel }