/**
 * @File        : i18n.ts
 * @Author      : 정재백
 * @Since       : 2024-04-18
 * @Description : 다국어 유틸
 * @Site        : https://devlog.ntiple.com
 **/
import 'intl-pluralrules'
import { createInstance, type i18n } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import * as C from '@/libs/constants'
import values from '@/libs/values'
import { getLogger } from '@/libs/log'
import misc from '@/libs/misc'
import lodash from 'lodash'

const LIBNAME = 'i18n'
const log = getLogger(LIBNAME)
const { asAny } = misc

let lngdef = C.KO
let nsdef = 'common'
let languages = [C.KO, C.EN]
let nscur: string[] | string = nsdef
let lngcur = lngdef

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
  if (!inst) {
    inst = createInstance()
    await inst
      .use(initReactI18next)
      .use(resourcesToBackend((lng: string, _: string) => {
        log.trace('RESOURCE:', lng, ns)
        const ret = new Promise<any>(async (resolve) => {
          let messages: any = { }
          /** 네임스페이스는 initI18next 에서 받은 인자로 인식한다. */
          if (ns instanceof Array) {
            for (let itm of ns) {
              try {
                log.trace('GET-RESOURCE:', lng, itm)
                messages = values.putAll(messages, (await import(`@/locales/${lng}/${itm}`)).default)
              } catch (e) {
                log.trace('E:', asAny(e).message)
              }
            }
          } else {
            try {
              log.trace('GET-RESOURCE:', lng, ns)
              messages = (await import(`@/locales/${lng}/${ns}`)).default
            } catch (e) {
              log.trace('E:', asAny(e).message)
            }
          }
          log.trace('MESSAGES:', lng, messages)
          return resolve(messages)
        })
        return ret
      }))
      /** 메시지를 한번에 가져오기 위해 최초 네임스페이스만 인식한다. */
      .init(getOptions(lng, ns instanceof Array ? ns[0] : ns))
  }
  return inst
}

function getPersistedLang() {
  let lng = C.UNDEFINED
  let o: any
  if (typeof localStorage !== 'undefined') {
    if ((o = localStorage.getItem(C.RUNTIME)) && (o = JSON.parse(o))) {
      if (o?.lang) { lng = o.lang }
    }
  }
  return lng
}

var setPersistedLang = lodash.debounce((lng: string) => {
  let o: any
  if (typeof localStorage !== 'undefined') {
    if (!(o = localStorage.getItem(C.RUNTIME))) {
      localStorage.setItem(C.RUNTIME, '{}')
    }
    if ((o = localStorage.getItem(C.RUNTIME)) && (o = JSON.parse(o))) {
      o.lang = lng
      localStorage.setItem(C.RUNTIME, JSON.stringify(o))
    }
  }
}, 100)

function persist(lng?: string) {
  if (lng === undefined) {
    lng = getPersistedLang()
  } else {
    setPersistedLang(lng)
  }
  return lng
}

async function getTranslation(ns: string[] | string, lng?: string, opt: any = {}) {
  if (!lng) {
    lng = getPersistedLang()
  } else {
    setPersistedLang(lng)
  }
  if (!lng) { lng = lngdef }
  if (!ns) { ns = nsdef }
  log.trace('GET-TRANSLATION:', ns, lng, opt)
  nscur = ns
  lngcur = lng
  if (!inst) { inst = await initI18next(ns, lng) }
  await inst.changeLanguage(lngcur)
  fnc = inst.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, opt.keyPrefix)
  return { t: fnc, i18n: inst }
}

var inst = C.UNDEFINED as i18n
var fnc: any = (_: any) => ''
var $t: any = (v: string) => {
  // log.trace('I18N-GET:', nscur, lngcur, v, fnc(v))
  return fnc(v) || C.UNDEFINED
}

const initI18N = async (ns: string[] | string, lng?: string) => { await getTranslation(ns, lng) }
const changeLang = async (lng: string) => { await getTranslation(nscur, lng) }
$t.init = initI18N
$t.lang = changeLang
$t.persist = persist
$t.languages = languages
$t.current = () => lngcur

export default $t as typeof $t & {
  init: typeof initI18N
  lang: typeof changeLang
  persist: typeof persist
  languages: typeof languages
  current: Function
}