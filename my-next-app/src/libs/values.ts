/**
 * @File        : values.ts
 * @Author      : 정재백
 * @Since       : 2023-08-09
 * @Description : 각종 데이터 유틸 모음
 * @Site        : https://devlog.ntiple.com
 **/
import * as C from './constants'
import log from './log'

type PutAllOptType = {
  deep?: boolean
  root?: any
}

const values = {
  clone<T>(v: T) {
    let ret:T = C.UNDEFINED
    try {
      ret = JSON.parse(JSON.stringify(v))
    } catch(e) { log.debug('E:', e) }
    return ret
  },
  toJSON(obj: any) {
    if (!obj) { return obj }
    let ret: any = { }
    if (typeof(obj) === C.STRING) {
      try {
        ret = JSON.parse(obj)
      } catch (e) {
        /** JS식 JSON인 경우. */
        try {
          ret = JSON.parse(values.toString(eval(`(${obj})`)))
        } catch (ignore) { }
      }
    } else if (obj instanceof Array) {
      ret = JSON.parse(values.toString(obj))
    } else if (typeof(obj) === C.OBJECT) {
      let tmp: any = {}
      for (const k in obj) {
        let v = obj[k]
        if (v instanceof Function) {
          continue
        } else if (v === null) {
          tmp[k] = null
        } else if (values.find(typeof (v), [C.STRING, C.NUMBER, C.BOOLEAN]) >= 0) {
          tmp[k] = v
        } else {
          tmp[k] = values.toJSON(v)
          if (Object.keys(tmp[k]).length == 0) {
            tmp[k] = ''
          }
        }
      }
      ret = JSON.parse(values.toString(tmp))
    }
    return ret
  },
  /** remove circler reference object */
  toString(val: any, replacer?: any, spc?: number) {
    let cache: any[] = []
    const ret = JSON.stringify(val, (k, v) => {
      if (replacer && replacer instanceof Function) {
        v = replacer(k, v)
      }
      if (typeof v === C.OBJECT && v) {
        if (cache.includes(v)) {
          return undefined
        } else {
          cache.push(v)
          return v
        }
      }
      return v
    }, spc)
    values.clear(cache)
    return ret
  },
  /** 모든 배열값을 복사. */
  pushAll<T extends Array<any>>(array: T, source: Array<any>, tpos?: number, spos? : number) {
    let target: any[] = array
    if (target == null) { return target }
    if (source == null) { return target }
    if (target === source) { return target }
    if (tpos === undefined) { tpos = target.length }
    if (spos === undefined) { spos = 0 }
    for (let inx = 0; inx < (source.length - spos); inx++) {
      target.splice(tpos + inx, 0, source[spos + inx])
    }
    return target
  },
  /** source객체의 모든 속성을 target 객체에 입력한다 (첫번째 인자가 target), deep 옵션을 줄경우 요소마다 재귀호출한다 */
  putAll<T>(_target: T, source: any, opt: PutAllOptType = C.UNDEFINED) {
    let target: any = _target
    if (target == null || source == null || target === source ) { return target }
    if (!opt) { opt = { root: target } }
    for (const k in source) {
      const titem = target[k]
      const sitem = source[k]
      if (titem !== undefined && titem !== null) {
        if (typeof (titem) === C.STRING) {
          target[k] = source[k]
        } else if ((opt?.deep) && titem instanceof Array && sitem instanceof Array) {
          values.putAll(titem, sitem, opt)
        } else if ((opt?.deep) && typeof(titem) === C.OBJECT && typeof(sitem) === C.OBJECT) {
          values.putAll(titem, sitem, opt)
        } else {
          /** 타입이 다르다면 무조건 치환. */
          target[k] = source[k]
        }
      } else {
        target[k] = source[k]
      }
    }
    return target
  },
  /** target 에서 exclude 나열된 것들을 제외한 모든 요소를 복제한 객체 생성 */
  copyExclude<T>(target: T, excludes: any[] = []) {
    let ret: any = { }
    const keys = Object.keys(target as any)
    for (const key of keys) {
      if (excludes.indexOf(key) !== -1) { continue }
      ret[key] = (target as any)[key]
    }
    return ret as T
  },
  /** 목표객체(target) 의 key 값을 가지는 내용만 복사. */
  copyExists(target: any, source: any, keys?: string[]) {
    if (target == null) { return }
    if (source == null) { return  }
    if (keys !== undefined) {
      for (const k of keys) {
        target[k] = source[k]
      }
    } else {
      for (const k in target) {
        target[k] = source[k]
      }
    }
    return target
  },
  /** 다수개 배열을 새로운 배열로 합쳐 반환 */
  merge(...params: any[]) {
    let ret: any = undefined
    for (const item of params) {
      if (item instanceof Array) {
        if (ret === undefined) { ret = [ ] }
        values.pushAll(ret, item)
      } else {
        if (ret === undefined) { ret = { } }
        values.putAll(ret, item)
      }
    }
    return ret
  },

  equals(target: any, source: any) {
    let ret = false
    if (target instanceof Array) {
      if (!(source instanceof Array)) { return false }
      if (target.length != source.length) { return false }
      ret = true
      for (let inx = 0; inx < target.length; inx++) {
        if (target[inx] !== source[inx]) { return false }
      }
    } else if (typeof target === C.OBJECT) {
      if (Object.keys(target).length != Object.keys(source).length) { return false }
      ret = true
      for (const k in target) {
        if (target[k] !== source[k]) { return false }
      }
    } else {
      ret = target == source
    }
    return ret
  },

  equalsIgnoreCase(v1: string, v2: string) {
    let ret = false
    if (typeof v1 != C.STRING) { return ret }
    if (typeof v2 != C.STRING) { return ret }
    if (!v1 && !v2) { return true }
    if (!v1 || !v2) { return ret }
    v1 = v1.toLowerCase()
    v2 = v2.toLowerCase()
    ret = v1 == v2
    return ret
  },

  remove(arr: any[], v: any) {
    if (arr === undefined) { return }
    const inx = arr.indexOf(v)
    if (inx !== -1) { arr.splice(inx, 1) }
  },

  /** JSON 키값을 변경한다. */
  replaceKey(obj: any, k1: any, k2: string) {
    if (!obj) { return obj }
    if (typeof(obj) !== 'object') { return obj }
    if (k1 instanceof RegExp) {
      /** 정규식치환 */
      log.trace('REPLACE KEY BY REGEX', k1, k2)
      for (const k in obj) {
        if (k1.test(k)) {
          obj[k.replace(k1, k2)] = obj[k]
          delete obj[k]
        }
      }
    } else if (typeof(k1) === 'string') {
      /** 문자열치환 */
      log.trace('REPLACE KEY BY STRING', k1, k2)
      for (const k in obj) {
        let pos = undefined
        if ((pos = k.indexOf(k1)) != -1) {
          obj[k.replace(k1, k2)] = obj[k]
          delete obj[k]
        }
        // log.debug('POS:', pos, k1, k2, k, k.replace(k1, k2))
      }
    } else {
      /** 객체인경우 치환하지 않는다. (추후 다른방향으로 생각해 볼것.) */
    }
    log.trace('REPLACED:', obj)
    return obj
  },
  /** target 객체 내부의 모든 요소 삭제 */
  clear<T>(target: T) {
    if (target instanceof Array) {
      target.splice(0, target.length)
    } else if (target) {
      for (const k in target) {
        const v = target[k]
        if (v instanceof Array) {
          values.clear(v)
        } else if (typeof v === C.OBJECT) {
          values.clear(v)
        } else {
          delete target[k]
        }
      }
    }
    return target
  },
  /** 최소(min)~최대(max)값 사이의 난수 생성, 최소값을 입력하지 않을경우 자동으로 0 으로 지정됨 */
  getRandom(max: number, min: number = C.UNDEFINED) {
    if (min == C.UNDEFINED) { min = 0 }
    if (max < 0) { max = max * -1 }
    const ret = min + Math.floor(Math.random() * max)
    return ret
  },
  /** 단일문자 난수 */
  randomChar(c = 'a', n = 26) {
    return String.fromCharCode(Number(c.charCodeAt(0)) + values.getRandom(n))
  },
  /** 난수로 이루어진 문자열, number / alpha / alphanum 의 3가지 타입으로 생성가능 */
  randomStr (length: number, type: 'number' | 'alpha' | 'alphanum' = C.UNDEFINED) {
    let ret = ''
    switch (type) {
    case undefined:
    /** 숫자   */
    case 'number': {
      for (let inx = 0; inx < length; inx++) {
        ret += String(values.getRandom(10))
      }
    } break
    /** 문자   */
    case 'alpha': {
      for (let inx = 0; inx < length; inx++) {
        switch(values.getRandom(2)) {
        case 0: /** 소문자 */ { ret += values.randomChar('a', 26) } break
        case 1: /** 대문자 */ { ret += values.randomChar('A', 26) } break
        }
      }
    } break
    /** 영숫자 */
    case 'alphanum': {
      for (let inx = 0; inx < length; inx++) {
        switch(values.getRandom(3)) {
        case 0: /** 숫자   */ { ret += String(values.getRandom(10)) } break
        case 1: /** 소문자 */ { ret += values.randomChar('a', 26) } break
        case 2: /** 대문자 */ { ret += values.randomChar('A', 26) } break
        }
      }
      break
    } }
    return ret
  },
  delete(v: any, key: any) {
    if (!v) { return v }
    if (!key) { return v }
    if (typeof key === C.STRING) {
      delete v[key]
    } else if (key instanceof Array) {
      for (const k of key) { delete v[k] }
    } else {
      for (const k in key) { delete v[k] }
    }
    return v
  },
  min(array: Array<any>) {
    let ret = undefined
    try {
      for (const v of array) {
        if (ret === undefined) { ret = v; continue }
        if (v < ret) { ret = v }
      }
    } catch (ignore) { }
    return ret
  },
  max(array: Array<any>) {
    let ret = undefined
    try {
      for (const v of array) {
        if (ret === undefined) { ret = v; continue }
        if (v > ret) { ret = v }
      }
    } catch (ignore) { }
    return ret
  },
  near(search: number | string, list: number[] | string[], minv?: number, maxv?: number) {
    let ret = undefined
    let dif = Number.MAX_VALUE
    if (!list || !list.length) { return ret }
    const v1 = Number(search)
    if (isNaN(v1)) { return ret }
    for (let inx = 0; inx < list.length; inx++) {
      const v2 = Number(list[inx])
      if (isNaN(v2)) { continue }
      if (minv !== undefined && !isNaN(minv) && v2 < minv) { continue }
      if (maxv !== undefined && !isNaN(maxv) && v2 > maxv) { continue }
      const cif = Math.abs(v1 - v2)
      if (cif < dif) {
        dif = cif
        ret = list[inx]
      }
    }
    return ret
  },
  find(search: ((e: any) => boolean) | Array<any> | any, list: any[]) {
    let ret: number = -1
    if (!list || !list.length) { return ret }
    FIND_LOOP:
    for (let inx = 0; inx < list.length; inx++) {
      let item = list[inx]
      if (search instanceof Function) {
        try {
          if (search(item)) {
            ret = inx
            break FIND_LOOP
          }
        } catch (e) { }
      } else if (search instanceof Array) {
        for (let match of search) {
          if (item === match) {
            ret = inx
            break FIND_LOOP
          }
        }
      } else {
        if (item === search) {
          ret = inx
          break FIND_LOOP
        }
      }
    }
    return ret
  },
  sort(arr: any[], ...keys: any[]) {
    if (!arr) { return arr }
    if (!keys) { return arr }
    arr.sort((a: any, b: any) => {
      for (const itm of keys) {
        if (typeof itm === C.STRING) {
          const key = itm
          if (a[key] == b[key]) { continue }
          else if (a[key] > b[key]) { return 1 }
          else if (a[key] < b[key]) { return -1 }
        } else {
          const key = itm.key
          const sig = itm.odr === C.DESCENDING ? -1 : 1
          if (a[key] == b[key]) { continue }
          else if (a[key] > b[key]) { return 1 * sig }
          else if (a[key] < b[key]) { return -1 * sig }
        }
      }
      return 0
    })
    return arr
  },
  hierarchy<T extends Array<any>>(list: T, idKey: string, parentKey: string, subListKey: string, sortKey?: string, extmap?: any) {
    const ret: T = [ ] as any as T
    const map: any = extmap || { }
    if (!list) { return ret }
    const olist = values.clone(list)
    /** 1차 LOOP 맵생성 */
    for (const item of olist) {
      const cid = item[idKey]
      map[cid] = item
    }
    /** 2차 LOOP 부모찾아 배열하기 */
    for (const item of olist) {
      const pid = item[parentKey]
      if (map[pid]) {
        const parent = map[pid]
        if (!parent[subListKey]) {
          parent[subListKey] = [ ]
        }
        parent[subListKey].push(item)
      } else {
        /** 부모노드가 없다면 루트아이템으로 인식. */
        ret.push(item)
      }
    }
    /** 정렬. */
    if (sortKey !== undefined) {
      const doSort = (slist: any[], depth: number) => {
        slist.sort((a, b) => a[sortKey] - b[sortKey])
        for (const item of slist) {
          const subList = item[subListKey]
          if (subList && subList.length > 0) {
            log.trace('SUBLIST:', subList)
            doSort(subList, depth + 1)
          }
        }
      }
      doSort(ret, 0)
    }
    return ret
  },
  strreduce(v: string, len: number) {
    let ret = v || ''
    if (!v) { return ret }
    if (!len) { return ret }
    if (ret.length <= len) { return ret }
    ret = `${String(ret).substring(0, len)}...`
    return ret
  },
  item(a: any[] | undefined, i: number, v?: any) {
    if (a && i !== undefined && i >= 0 && a[i]) {
      if (v) { a[i] = v }
      return a[i]
    }
    return v
  },
  concat(delim: string, nth: number, ...arg: any[]) {
    const list: any[] = []
    LOOP:
    for(let inx = 0; inx < arg.length; inx++) {
      if (!arg[inx]) { continue }
      const arr = String(arg[inx] || '').split(delim)
      for (const itm of arr) {
        if (itm !== null && itm !== undefined) { list.push(itm) }
        if (nth && list.length >= nth) {
          break LOOP
        }
      }
    }
    let ret = ''
    for (const itm of list) {
      if (ret) { ret = `${ret}${delim}` }
      if (itm !== null && itm !== undefined) { ret = `${ret}${itm}` }
    }
    if (ret && delim) {
      ret = ret.replace(new RegExp(`^[${delim}]+`, 'g'), '')
      ret = ret.replace(new RegExp(`[${delim}]+$`, 'g'), '')
      ret = ret.trim()
    }
    return ret
  },
  val(o: any, k?: string, v?: any) {
    let r = o
    if (o && k !== undefined && o[k]) {
      if (v) { o[k] = v }
      r = o[k]
    }
    return (r instanceof Function) ? r() : r
  },
  nval(o: any, def?: any) {
    if (!def) { def = undefined }
    switch (o) {
    case null:
    case undefined:
      o = def
      break
    default: break
    }
    return o
  },
  trim(value: any) {
    if (!value) { return value }
    for (const k in value) {
      const v = value[k]
      if (!v) { continue }
      if (typeof v === C.STRING) {
        value[k] = String(v).trim()
      } else {
        value[k] = values.trim(v)
      }
    }
    return value
  },
  num(v: any, d?: number) {
    let ret: number = d as any as number
    if (v && !isNaN(v = Number(v))) {
      ret = v
    }
    return ret
  },
  lpad(v: string | number, len: number, pad: string) {
    if (pad.length > len) {
      // log.debug('오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다')
      return v
    }
    v = String(v)
    pad = String(pad)
    while (v.length < len) { v = pad + v }
    v = v.length >= len ? v.substring(0, len) : v
    return v
  },
  rpad(v: string, len: number, pad: string) {
    if (pad.length > len) {
      // console.log('오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다')
      return v + ''
    }
    v = String(v)
    pad = String(pad)
    while (v.length < len) { v += pad }
    v = v.length >= len ? v.substring(0, len) : v
    return v
  },
  removeByKey<T>(obj: T, ptn: string[] | RegExp[], ctx?: any) {
    let ret: any = obj
    let ptns: RegExp[] = ptn as RegExp[]
    if (!obj) { return ret }
    if (!ctx) { ctx = { } }
    if (!ctx.regexParsed) {
      ctx.regexParsed = true
      for (let inx = 0; inx < ptn.length; inx++) {
        let itm = ptn[inx]
        let regex: RegExp
        if (typeof itm === C.STRING) {
          regex = RegExp(`${itm}`)
        } else {
          regex = itm as RegExp
        }
        ptns[inx] = regex
      }
    }
    let prntkey = ctx.prntkey || ''
    if (ret instanceof Array) {
      for (let inx = 0; inx < ret.length; inx++) {
        ctx.prntkey = `${prntkey}${prntkey ? '.' : ''}${inx}`
        let pass = true
        for (const regex of ptns) {
          // log.debug('CHECK:', ctx.prntkey, regex.test(ctx.prntkey))
          if (regex.test(ctx.prntkey)) {
            pass = false
            break
          }
        }
        if (!pass) {
          ret[inx] = undefined
          ret.splice(inx, 1)
          inx--
        } else {
          ret[inx] = values.removeByKey(ret[inx], ptns, ctx);
        }
      }
    } else if (ret instanceof Object) {
      for (const k in ret) {
        ctx.prntkey = `${prntkey}${prntkey ? '.' : ''}${k}`
        let pass = true
        for (const regex of ptns) {
          // log.debug('CHECK:', ctx.prntkey, regex.test(ctx.prntkey))
          if (regex.test(ctx.prntkey)) {
            pass = false
            break
          }
        }
        if (!pass) {
          ret[k] = undefined
          delete ret[k]
        } else {
          ret[k] = values.removeByKey(ret[k], ptns, ctx)
        }
      }
    }
    return ret as T
  },
  // encodeB64(v: any) {
  //   let ret: string = ''
  //   ret = v.toString(C.BASE64)
  //   return ret
  // },
  // decodeB64(v: string) {
  //   return Uint8Array.from(atob(v.replace(/^data[^,]+,/, '')), v => v.charCodeAt(0))
  // },
  pathvars(uri: string, path: string) {
    const PTN1 = /\[([a-zA-Z0-9_$-]+)\]/g
    let ret: any = {}
    let o: any
    if (!uri || !path) { return ret }
    uri = uri.split(/[?]/g)[0]
    const moduri = uri.split(/[/]/g)
    const modpath = path.split(/[/]/g)
    log.trace('PATHVARS:', moduri.length, modpath.length)
    if (moduri.length != modpath.length) { return ret }
    for (let inx = 0; inx < moduri.length; inx++) {
      let itm1 = moduri[inx]
      let itm2 = modpath[inx]
      if (!itm1 || !itm2) { continue }
      log.trace('ITM:', itm1, itm2)
      if (!!(o = PTN1.exec(itm2))) {
        log.trace(`PATH-VARS[${o[1]}]=${itm1}`)
        ret[o[1]] = itm1
      }
    }
    return ret
  },
  matcher(v: any, def: any, ...arg: any[]) {
    let ret = C.UNDEFINED
    let defval = C.UNDEFINED
    let vlst = v
    if (!arg) { return ret }
    if (!(vlst instanceof Array)) { vlst = [vlst] }
    for (let inx = 0; inx < arg.length; inx += 2) {
      let alst = arg[inx]
      if (!(alst instanceof Array)) { alst = [alst] }
      for (const aitm of alst) {
        for (const vitm of vlst) {
          if (vitm === aitm) {
            ret = arg[inx + 1]
            break
          }
          if (aitm === def) { defval = arg[inx + 1] }
        }
      }
    }
    if (ret === C.UNDEFINED) { ret = defval }
    return ret
  },
  /** react의 ref 객체끼리 복제 할 때 사용 (useRef), 기본적으로는 putAll 과 동일 */
  copyRef(target: any, source: any, opt?: any) {
    if (target && source && target.hasOwnProperty('current')) {
      values.putAll(target, source)
      if (opt) { values.putAll(target, opt) }
    }
    return target
  },
  getByPath(obj: any, name: string | string[]) {
    let ret: any = C.UNDEFINED
    let o: any
    let klst: string[] = []
    if (name instanceof Array) {
      klst = name
    } else if (typeof name === C.STRING) {
      klst = name.split(/[.]/)
    }
    o = obj
    KLOOP: for (let inx = 0; inx < klst.length; inx++) {
      let k: any = klst[inx]
      if (o instanceof Array) {
        k = Number(k)
        if (!isNaN(k)) {
          o = o[k]
        } else {
          o = C.UNDEFINED
          break KLOOP
        }
      } else if (typeof o === C.OBJECT) {

      } else {

      }
    }
    return ret
  }
}

export default values