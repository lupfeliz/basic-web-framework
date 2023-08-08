import { log } from '@/libs/commons/log'

const values = {
  clear(obj: any) {
    if (obj instanceof Array) {
      obj.splice(0, obj.length)
    } else {
      for (const k in obj) {
        delete obj[k]
      }
    }
  },
  range(st: any, ed?: number) {
    let ret = []
    if (st instanceof Array && ed === undefined) {
      ed = Number(st[1])
      st = Number(st[0])
    } else {
      st = Number(st)
      ed = Number(ed)
      if (isNaN(st)) { st = 0 }
      if (isNaN(ed)) { ed = st }
    }
    st = Number(st)
    ed = Number(ed)
    if (st < ed) {
      for (let inx = st; inx <= ed; inx++) {
        ret.push(inx)
      }
    } else {
      for (let inx = st; inx >= ed; inx--) {
        ret.push(inx)
      }
    }
    return ret
  }
}

export { values }