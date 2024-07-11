import * as C from './constants'
import log from './log'

type PutAllOptType = {
  deep?: boolean
  root?: any
}

const { UNDEFINED } = C

const values = {
  putAll<T>(target: T, source: any, opt: PutAllOptType = UNDEFINED) {
    let obj: any = target
    if (obj == null) { return obj }
    if (source == null) { return obj }
    if (obj === source) { return obj }
    if (!opt) { opt = { root: obj } }
    for (const k in source) {
      const titem = obj[k]
      const sitem = source[k]
      if (titem !== undefined) {
        if (typeof (titem) === C.STRING) {
          obj[k] = source[k]
        } else if ((opt?.deep) && titem instanceof Array && sitem instanceof Array) {
          values.putAll(titem, sitem, opt)
        } else if ((opt?.deep) && typeof(titem) === C.OBJECT && typeof(sitem) === C.OBJECT) {
          values.putAll(titem, sitem, opt)
        } else {
          /** 타입이 다르다면 무조건 치환. */
          obj[k] = source[k]
        }
      } else {
        obj[k] = source[k]
      }
    }
    return target
  },
  copyExclude<T>(props: T, excludes: any[] = []) {
    let ret: any = { }
    const keys = Object.keys(props as any)
    for (const key of keys) {
      if (excludes.indexOf(key) !== -1) { continue }
      ret[key] = (props as any)[key]
    }
    return ret as T
  },
  copyRef(ref: any, elem: any, opt?: any) {
    if (ref && elem && ref.hasOwnProperty('current')) {
      values.putAll(ref, elem)
      if (opt) { values.putAll(ref, opt) }
    }
    return ref
  },
  clear<T>(obj: T) {
    if (obj instanceof Array) {
      obj.splice(0, obj.length)
    } else if (obj) {
      for (const k in obj) {
        const v = obj[k]
        if (v instanceof Array) {
          values.clear(v)
        } else if (typeof v === C.OBJECT) {
          values.clear(v)
        } else {
          delete obj[k]
        }
      }
    }
    return obj
  },
  getRandom(max: number, min: number = C.UNDEFINED) {
    if (min == C.UNDEFINED) { min = 0 }
    if (max < 0) { max = max * -1 }
    const ret = min + Math.floor(Math.random() * max)
    return ret
  },
  randomChar(c = 'a', n = 26) {
    return String.fromCharCode(Number(c.charCodeAt(0)) + values.getRandom(n))
  },
  randomStr (length: number, type: string = C.UNDEFINED) {
    let ret = ''
    switch (type) {
    case undefined:
    case 'number':
      for (let inx = 0; inx < length; inx++) {
        ret += String(values.getRandom(10))
      }
      break
    case 'alpha':
      for (let inx = 0; inx < length; inx++) {
        switch(values.getRandom(2)) {
        case 0:
          /** 소문자 */
          ret += values.randomChar('a', 26)
          break
        case 1:
          /** 대문자 */
          ret += values.randomChar('A', 26)
          break
        }
      }
      break
    case 'alphanum':
      for (let inx = 0; inx < length; inx++) {
        switch(values.getRandom(3)) {
        case 0:
          /** 숫자 */
          ret += String(values.getRandom(10))
          break
        case 1:
          /** 소문자 */
          ret += values.randomChar('a', 26) 
          break
        case 2:
          /** 대문자 */
          ret += values.randomChar('A', 26)
          break
        }
      }
      break
    }
    return ret
  },
}

export default values