/**
 * @File        : i18n.ts
 * @Author      : 정재백
 * @Since       : 2024-04-18
 * @Description : 다국어 유틸
 * @Site        : https://devlog.ntiple.com
 **/
import 'intl-pluralrules'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import * as C from '@/libs/constants'
import values from '@/libs/values'

let lngdef = C.KO
let languages = [lngdef, C.EN]
let nsdef = 'common'

function getOptions (lng = lngdef, ns: any = nsdef) {
  return {
    supportedLngs: languages,
    fallbackLng: lngdef,
    lng,
    fallbackNS: nsdef,
    defaultNS: nsdef,
    ns
  }
}

const initI18next = async (ns: string[] | string, lng: string) => {
  const inst = createInstance()
  let messages: any = { }
  await inst
    .use(initReactI18next)
    .use(resourcesToBackend((lng: string, _: string) => {
      const ret = new Promise<any>(async (resolve) => {
        /** 네임스페이스는 initI18next 에서 받은 인자로 인식한다. */
        if (ns instanceof Array) {
          for (let itm of ns) {
            try {
              messages = values.putAll(messages, (await import(`@/locales/${lng}/${itm}`)).default)
            } catch (ignore) { }
          }
        } else {
          try {
            messages = (await import(`@/locales/${lng}/${ns}`)).default
          } catch (ignore) { }
        }
        return resolve(messages)
      })
      return ret
    }))
    /** 메시지를 한번에 가져오기 위해 최초 네임스페이스만 인식한다. */
    .init(getOptions(lng, ns instanceof Array ? ns[0] : ns))
  return inst
}

async function getTranslation(ns: string[] | string, lng?: string, opt: any = {}) {
  if (!lng) { lng = lngdef }
  const inst = await initI18next(ns, lng)
  fnc = inst.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, opt.keyPrefix)
  return { t: fnc, i18n: inst }
}

var fnc: any = (_: any) => ''
var $t: any = (v: string) => {
  return fnc(v) || C.UNDEFINED
}

$t.init = async (ns: string[] | string, lng?: string) => { await getTranslation(ns, lng) }

export default $t