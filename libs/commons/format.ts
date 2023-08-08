import { log } from '@/libs/commons/log'
import moment from 'moment'

const DF_DEF = 'YYYYMMDDhhmmss'

const format = {
  dateStrFormat(v: string, of?: string, nf?: string) {
    return moment(v, nf || DF_DEF).format(of)
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
  formatDate(v: Date, f?: string) {
    return moment(v).format(f || DF_DEF)
  },
  parseDate(v: string, f?: string) {
    return moment(v, f || DF_DEF).toDate()
  },
  date(
    y?: string | number, m?: string | number, d?: string | number,
    h?: string | number, i?: string | number, s?: string | number
    ) {
    let ret = new Date()
    if (y || Number(y) >= 1) { ret.setFullYear(Number(y)) }
    if (m || Number(m) >= 1) { ret.setMonth(Number(m) - 1) }
    if (d || Number(d) >= 1) { ret.setDate(Number(d)) }
    if (h || Number(h) >= 0) { ret.setHours(Number(h)) }
    if (i || Number(i) >= 0) { ret.setMinutes(Number(i)) }
    if (s || Number(s) >= 0) { ret.setSeconds(Number(s)) }
    return ret
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
  }
}

const $f = (t: string, v: string) => {
  let ret = v
  switch (t) {
  case 'dt':
    ret = format.dateStrFormat(v, 'YYYY-MM-DD')
    break
  }
  return ret
}

export { format, $f }