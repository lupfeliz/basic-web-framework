/**
 * @File        : format.ts
 * @Author      : 정재백
 * @Since       : 2023-09-08
 * @Description : 공통 형변환 모듈
 * @Site        : https://devlog.ntiple.com
 **/

import log from './log'
import * as C from './constants'
import values from './values'
import moment from 'moment'

const format = {
  dateStrFormat(v: any, of?: string, nf?: string) {
    if (!v) { return v }
    return moment(format.parseDate(v), nf || C.DATE_FORMAT_CODE).format(of)
  },
  dateExt(v: Date | string) {
    let ret: any = { }
    let d = (v instanceof Date) ? v : format.parseDate(v)
    ret.y = format.pad(d.getFullYear(), 4, '0')
    ret.m = format.pad(d.getMonth() + 1, 2, '0')
    ret.d = format.pad(d.getDate(), 2, '0')
    ret.h = format.pad(d.getHours(), 2, '0')
    ret.i = format.pad(d.getMinutes(), 2, '0')
    ret.s = format.pad(d.getSeconds(), 2, '0')
    return ret
  },
  formatDate(v: any, f?: string) {
    const date = format.parseDate(v)
    if (date) { return moment(v).format(f || C.DATE_FORMAT_NORM) }
    return ''
  },
  parseDate(v: any, f?: string) {
    let ret: Date
    if (v instanceof Date) {
      return v
    } else if (typeof(v) == C.STRING) {
      /** TODO: 기호는 무작정 치환하지 않고 자릿수 커팅을 먼저 시도하도록 */
      v = v.replace(/[^0-9]+/g, '')
      if (!f) { f = C.DATE_FORMAT_CODE }
    } else if (typeof(v) == C.NUMBER) {
      v = new Date(v)
    }
    if (f === undefined) {
      ret = moment(v).toDate()
    } else {
      ret = moment(v, f || C.DATE_FORMAT_CODE).toDate()
    }
    return ret
  },
  date(
    y?: string | number, m?: string | number, d?: string | number,
    h?: string | number, i?: string | number, s?: string | number
    ) {
    let ret = new Date(0)
    let t: number
    for (let inx = 0; inx < 2; inx ++) {
      if ((t = Number(y)) >= 1) { ret.setFullYear(t) }
      if ((t = Number(m)) >= 1) { ret.setMonth(t - 1) }
      if ((t = Number(d)) >= 1) { ret.setDate(t) }
      if ((t = Number(h)) >= 0) { ret.setHours(t) }
      if ((t = Number(i)) >= 0) { ret.setMinutes(t) }
      if ((t = Number(s)) >= 0) { ret.setSeconds(t) }
    }
    // log.debug(`FORMAT-DATE:${y || ''}-${m || ''}-${d || ''} / ${h || ''}:${i || ''}:${s || ''}`, ret)
    return ret
  },
  parsePhone(v: any) {
    let d1 = ''
    let d2 = ''
    let d3 = ''
    if (/-/.test(v)) {
      const data = String(v).split(/-/g)
      if (data && data.length > 0) { d1 = data[0] }
      if (data && data.length > 1) { d2 = data[1] }
      if (data && data.length > 2) { d3 = data[2] }
    } else if (v) {
      switch (v.length) {
      case 12:
        /** 4-4-4 */
        d1 = v.substring(0, 4)
        d2 = v.substring(4, 8)
        d3 = v.substring(8, 12)
        break
      case 11:
        /** 3-4-4 */
        d1 = v.substring(0, 3)
        d2 = v.substring(3, 7)
        d3 = v.substring(7, 11)
        break
      case 10:
        if (/^02/.test(v)) {
          /** 2-4-4 */
          d1 = v.substring(0, 2)
          d2 = v.substring(2, 6)
          d3 = v.substring(6, 10)
        } else {
          /** 3-3-4 */
          d1 = v.substring(0, 3)
          d2 = v.substring(3, 6)
          d3 = v.substring(6, 10)
        }
        break
      case 9:
        /** 2-3-4 */
          d1 = v.substring(0, 2)
          d2 = v.substring(2, 5)
          d3 = v.substring(5, 9)
        break
      }
    }
    return [d1, d2, d3]
  },
  formatPhone(v: any) {
    const d: any = this.parsePhone(v)
    return `${d[0]}-${d[1]}-${d[2]}`
  },
  pad(v: string | number, ln: number, d?: string) {
    let ret = String(v)
    if (!ln || ln < 1) { ln = 1 }
    if (ret.length >= ln) { return ret }
    if (!d || d.length == 0) { d = ' ' }
    while (ret.length < ln) {
      ret = d + ret
    }
    return ret
  },
  pattern(t: string, v?: any) {
    let ret: any 
    switch(t) {
    case C.NUMBER:
      ret = /^([\+\-]{0,1})[0-9]+$/
      break
    case C.NUMERIC:
      ret = /^([\+\-]{0,1})[0-9]+(\,[0-9]{3})*(\.[0-9]+){0,1}$/
      break
    case C.ALPHA:
      ret = /^[a-zA-Z]+$/
      break
    case C.ALPHASPC:
      ret = /^[\sa-zA-Z]+$/
      break
    case C.ALPHANUM:
      ret = /^[a-zA-Z0-9]+$/
      break
    case C.ALPHANUMSPC:
      ret = /^[\sa-zA-Z0-9]+$/
      break
    case C.ALPHASTART:
      ret = /^[a-zA-Z].*$/
      break
    case C.ASCII:
      ret = /^[\x00-\x7F]+$/
      break
    case C.DATE:
      ret = /^([0-9]{4}[-]{0,1}[0-9]{2}[-]{0,1}[0-9]{2})([ ]{0,1}[0-9]{2}[:]{0,1}[0-9]{2}[:]{0,1}[0-9]{2}(.[0-9]{1,3}){0,1}){0,1}$/
      break
    case C.EMAIL:
      // ret = /^(?<id>([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))\@(?<host>(\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ret = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))\@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      break
    case C.PASSWORD:
      /** Minimum eight characters, at least one letter and one number: */
      // ret = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
      /** Minimum eight characters, at least one letter, one number and one special character: */
      // ret = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      /** Minimum eight characters, at least one uppercase letter, one lowercase letter and one number: */
      // ret = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
      /** Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character: */
      // ret = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ret = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/
      break
    }
    if (v !== undefined) {
      return ret.test(String(v).trim())
    }
    return ret
  },
  numeric(str: any): string {
    str = String(str || '').trim()
    let minus: boolean = /^[-]/.test(str)
    let dpoint = ''
    // str = str.replace(/^[0.]+/g, '')
    if (!str) { str = '' }
    /** 앞자리 0 제거 */
    if (str.length > 1) { str = str.replace(/^[0]+([1-9]+)/g, '$1') }
    /** 소숫점 떼기 */
    {
      let d = str.split(/\./)
      if (d.length > 1) { dpoint = d[1] }
      str = d[0]
    }
    /** 공백이라면 0 으로 치환 */
    if (str.length == 0) { str = '0' }
    let ret: string = ''
    let len: number = str.length
    let digit: string = ''
    for (let inx: number = 0; inx < len; inx++) {
      digit = str.substring(len - inx - 1, len - inx)
      if (inx > 0 && inx % 3 == 0) {
        ret = digit + ',' + ret
      } else {
        ret = digit + ret
      }
    }
    if (minus) { ret = `-${ret}` }
    if (dpoint) { ret = `${ret}.${dpoint}`}
    return ret
  },
  picklink(v: any) {
    /** 문장 중 링크가 발견되면 a태그 덧씌움 */
    let ret = String(v)
    /** 하이퍼텍스트 링크 */
    ret = v.replace(/(http[s]{0,1}\:\/\/[a-zA-Z0-9._\/\|?=\&-]+)/g,
      `<a target=\"_blank\" href=\"$1\">$1</a>`)
    /** 이메일 링크 */
    ret = v.replace(/((([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))\@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))/g,
      `<a target=\"_blank\" href=\"mailto:$1\">$1</a>`)
    return ret
  },
  getLink(v: string, map?: any) {
    /** 링크 간편화 */
    let url = v
    let link = url
    let ret = url
    let mat: any
    let found = false
    url = url.replace(/\\/g, '/')
    if (!found && /([a-zA-Z0-9_-]+[.]){0,1}instagram.com\//.test(url)) {
      mat = /(([a-zA-Z0-9_-]+[.]){0,1}instagram.com\/[a-zA-Z0-9_.\/-]+)/g.exec(url)
      url = mat[1]
      url = url.replace(/^www[.]/ig, '')
      url = url.replace(/\/$/g, '')
      link = `https://www.${url}`
      ret = `<a target="_blank" href="${link}">${url}</a>`
      found = true
    }
    if (!found && /([a-zA-Z0-9_-]+[.]){0,1}(in[star]{1,4}gram).com\//.test(url)) {
      mat = /(([a-zA-Z0-9_-]+[.]){0,1}(in[star]{1,4}gram).com\/[a-zA-Z0-9_.\/-]+)/g.exec(url)
      /** instgram 으로 운영되는 오타 포워딩 사이트가 존재함 */
      url = mat[1]
      url = url.replace(/^www[.]/ig, '')
      url = url.replace(/\/$/g, '')
      url = url.replace(/^(in[star]{1,4}gram).com/g, 'instagram.com')
      link = `https://www.${url}`
      ret = `<a target="_blank" href="${link}">${url}</a>`
      found = true
    }
    if (!found && /^[@][a-zA-Z0-9_.\/-]+/.test(url)) {
      mat = /^[@]([a-zA-Z0-9_.\/-]+)/g.exec(url)
      /** instgram 식 표기법 포워딩 */
      url = `instagram.com/${mat[1]}`
      url = url.replace(/\/$/g, '')
      link = `https://www.${url}`
      ret = `<a target="_blank" href="${link}">${url}</a>`
      found = true
    }
    if (!found && /([a-zA-Z0-9_-]+[.]){0,1}facebook.com\//.test(url)) {
      mat = /(([a-zA-Z0-9_-]+[.]){0,1}facebook.com\/[a-zA-Z0-9_.\/-]+)/g.exec(url)
      url = mat[1]
      url = url.replace(/^www[.]/ig, '')
      url = url.replace(/\/$/g, '')
      link = `https://www.${url}`
      ret = `<a target="_blank" href="${link}">${url}</a>`
      found = true
    }
    if (!found && /([a-zA-Z0-9_-]+[.]){0,1}naver.com\//.test(url)) {
      mat = /(([a-zA-Z0-9_-]+[.]){0,1}naver.com\/[a-zA-Z0-9_.\/-]+)/g.exec(url)
      url = mat[1]
      url = url.replace(/\/$/g, '')
      link = `https://${url}`
      ret = `<a target="_blank" href="${link}">${url}</a>`
      found = true
    }
    if (!found && /([a-zA-Z0-9_-]+[.]){0,1}(modoo.at)\/[a-zA-Z0-9_.\/-]*/.test(url)) {
      mat = /(([a-zA-Z0-9_-]+[.]){0,1}(modoo.at)\/[a-zA-Z0-9_.\/-]*)/g.exec(url)
      url = mat[1]
      url = url.replace(/\/$/g, '')
      link = `https://${url}`
      ret = `<a target="_blank" href="${link}">${url}</a>`
      found = true
    }
    if (!found && /([a-zA-Z0-9_-]+[.]){1,3}(com|net|co.kr|kr)/.test(url)) {
      mat = /(([a-zA-Z0-9_-]+[.]){1,3}(com|net|co.kr|kr)(\/[a-zA-Z0-9_.\/-]+)*)/g.exec(url)
      url = mat[1]
      url = url.replace(/\/$/g, '')
      if (/^www\./ig.test(url)) {
        url = url.replace(/^www\./ig, '')
        link = `http://www.${url}`
      } else {
        link = `http://${url}`
      }
      ret = `<a target="_blank" href="${link}">${url}</a>`
      found = true
    }
    if (map) { values.putAll(map, { url, link, html: ret }) }
    return ret
  },
  hrsize(v: any) {
    let ret = v
    let unit = C.BYTES
    /** bytes */
    if (v > (1024 * 1024 * 1024)) {
      /** g-bytes */
      ret = Math.floor(v / 1024 / 1024 / 1024 * 10) / 10
      unit = C.GBYTES
    } else if (v > (1024 * 1024)) {
      /** m-bytes */
      ret = Math.floor(v / 1024 / 1024 * 10) / 10
      unit = C.MBYTES
    } else if (v > 1024) {
      /** k-bytes */
      ret = Math.floor(v / 1024 * 10) / 10
      unit = C.KBYTES
    }
    return `${format.numeric(ret)} ${unit}`
  }
}

const $f = (t: string, v: any) => {
  let ret = v
  if (!v) { return '' }
  switch (t) {
  case 'dt':
    ret = format.dateStrFormat(v, C.DATE_FORMAT_YMD)
    break
  case 'dth':
    ret = format.dateStrFormat(v, C.DATE_FORMAT_DTH)
    break
  case 'dthm':
    ret = format.dateStrFormat(v, C.DATE_FORMAT_DTHM)
    break
  case 'dttm':
    ret = format.dateStrFormat(v, C.DATE_FORMAT_NORM)
    break
  case 'phone':
    ret = format.formatPhone(v)
  }
  return ret
}

export { format, $f }