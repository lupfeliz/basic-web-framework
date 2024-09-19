/**
 * @File        : proc.ts
 * @Author      : 정재백
 * @Since       : 2023-09-08
 * @Description : 실행제어 모듈
 * @Site        : https://devlog.ntiple.com
 **/

import log from './log'
import values from './values'

const ctxProc = {
  debounceMap: { } as any,
  throttleMap: { } as any,
} as any

const proc = {
  /** 함수 호출 Wrapper */
  call(fnm: string, fnc: Function, self: any, errproc?: boolean, ...args: any[]) {
    let ret:any = undefined
    let argstr = ''
    log.trace('FNC:', fnc)
    try {
      if (self !== undefined) {
        ret = fnc.call(self, ...args)
      } else {
        ret = fnc(...args)
      }
      if (ret instanceof Promise) {
        ret.then(() => {
          log.trace('THEN:', fnm)
        })
        ret.catch((err) => {
          log.trace('ERROR:', err)
          if (self && self.$err) {
            self.$err.handle.call(self, fnm, err)
          }
          if (errproc) { throw err; }
        })
      }
    } catch (err) {
      log.debug('ERROR:', err)
      if (self && self.$err) {
        self.$err.handle.call(self, fnm, err)
      }
      if (errproc) { throw err; }
    }
    if (ret != undefined) {
      return ret
    }
  },

  exec(obj: any, mtd: string, ...args: any[]) {
    let ret = undefined
    obj = values.val(obj)
    if (obj && obj[mtd] && obj[mtd] instanceof Function) {
      ret = obj[mtd](...args)
    }
    return ret
  },

  waitmon(check: () => any, opt?: any) {
    if (opt === undefined) { opt = { } }
    const ctx = {
      __max_check: opt.maxcheck || 100,
      __interval: opt.interval || 100
    }
    return new Promise<any>((resolve, _reject) => {
      const fnexec = function() {
        /** 조건을 만족시키면 */
        if (check()) {
            resolve(true)
        } else if (ctx.__max_check > 0) {
          ctx.__max_check--
          setTimeout(fnexec, ctx.__interval)
        }
      }
      fnexec()
    })
  },

  /** SLEEP (ms) */
  async sleep(time: number) {
    return new Promise((resolve, _reject) => {
      log.trace('SLEEP', time)
      setTimeout(() => {
        log.trace('SLEEP DONE!')
        resolve(null)
      }, time)
    })
  },

  /** debounce with hash */
  debouncePromise(hash: string, callback: Function, time?: number) {
    log.trace('TRYING DEBOUNCE HASH:', hash)
    let ret = new Promise<any>((resolve, reject) => {
      if (time === undefined) { time = 300; }
      if (!ctxProc.debounceMap[hash]) {
        ctxProc.debounceMap[hash] = {
          handle: false as any,
          resolveArr: [ ] as Function[],
          rejectArr: [ ] as Function[]
        } as any
      }
      const map = ctxProc.debounceMap[hash]
      if (map?.handle) {
        log.trace('DEBOUNCE FUNCTION WITH HASH:', hash)
        clearTimeout(map.handle)
      }
      map.handle = setTimeout(() => {
        try {
          const res = callback()
          log.trace('RES:', res)
          for (const resolveOne of map.resolveArr) { resolveOne(res); }
        } catch (e) {
          log.debug('ERROR:', e)
          for (const rejectOne of map.rejectArr) { rejectOne(e); }
        }
        /** 프로세스가 종료되었으므로 모두 해제해 준다. */
        clearTimeout(map.handle)
        map.handle = undefined
        delete ctxProc.debounceMap[hash]
      }, time)
      map.resolveArr.push(resolve)
      map.rejectArr.push(reject)
    })
    return ret
  },

  /** throttle with hash */
  throttlePromise(hash: string, callback: Function, failproc: Function, time?: number) {
    log.trace('TRYING THROTTLE HASH:', hash)
    let ret = new Promise<any>(async (resolve, reject) => {
      if (time === undefined) { time = 300; }
      if (!ctxProc.throttleMap[hash]) {
        ctxProc.throttleMap[hash] = {
          handle: false as any,
          complete: true as any,
          result: undefined as any,
          error: undefined as any,
        } as any
      }
      /** 1. throttleMap 에서 handle 작성 */
      const map = ctxProc.throttleMap[hash]
      if (!(map?.handle)) {
        /** 이전에 걸린 throttle 이 있다면 대기. */
        if (!map?.complete) { await proc.waitmon(() => map.complete); }
        map.complete = false
        map.handle = setTimeout(() => { map.handle = undefined }, time)
        try {
          /**
           * 2. 최초프로세스는 throttleMap 에 result 남김
           * 3. 이후 프로세스는 handle free 되기전 까지 무시
           **/
          let res = map.result = callback()
          if (res && res instanceof Promise) {
            await res.then(r => { resolve(map.result = r) }, e => { reject(map.error = e) })
          } else {
            resolve(res)
          }
          log.trace('RES:', res)
        } catch (e) {
          map.error = e
          log.debug('ERROR:', e)
        }
        map.complete = true
      } else {
        if (failproc && failproc instanceof Function) { failproc(); }
        log.trace('THROTTLE FUNCTION CANCELED WITH HASH:', hash)
        await proc.waitmon(() => map.complete)
        if (map.error) {
          reject(map.error)
        } else {
          resolve(map.result)
        }
      }
    })
    return ret
  }
}

export default proc