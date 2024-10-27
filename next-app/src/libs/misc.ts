/**
 * @File        : misc.ts
 * @Author      : 정재백
 * @Since       : 2024-10-27
 * @Description : 각종 사소한 유틸들
 * @Site        : https://devlog.ntiple.com
 **/

const misc = {
  isServer: () => typeof window === 'undefined',
  isClient: () => typeof window !== 'undefined',
  asAny: (v: any) => v as any,
  asType: <T>(v: any, _: T) => v as T,
  window: () => (misc.isServer() ? {} : window) as typeof window & Record<string, any>,
  px2rem(v: any, el?: any) {
    v = Number(String(v).replace(/[^0-9^.]+/g, ''))
    if (isNaN(v)) { v = 0 }
    if (!el) { el = document.documentElement }
    return v / parseFloat(getComputedStyle(el).fontSize)
  },
  rem2px(v: any, el?: any) {
    v = Number(String(v).replace(/[^0-9^.]+/g, ''))
    if (isNaN(v)) { v = 0 }
    if (!el) { el = document.documentElement }
    return v * parseFloat(getComputedStyle(el).fontSize)
  },
  getText: <T extends HTMLElement>(element: T) => element ? $(element).text() : '',
  getFrom: (v: any, k: string) => v && v[k],
  strm: (v?: any) => String(v || '').replace(/[ ]+/g, ' ').trim(),
}

export default misc