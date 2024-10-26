/**
 * @File        : js-loader.ts
 * @Version     : $Rev$
 * @Author      : 정재백
 * @History     : 2024-06-09 최초 작성
 * @Site        : https://gitlab.ntiple.com/developers
 * @Description : 
 * 동적로딩을 위해 필요한 스크립트
 **/

import $ from 'jquery'
import { getLogger } from './log'
import app from '@/libs/app-context'

const LIBNAME = 'js-loader'
const { basepath } = app
const log = getLogger(LIBNAME)

const loader = {
  load: (src: string, opt: any = {}) => {
    if (!opt) { opt = {} }
    if (!src) { return }
    src = basepath(src)
    let timeid: any = Number(new Date().getTime())
    timeid = timeid - (timeid % 5000)
    /** cache 유효 시간은 5초단위, 기본적으로는 cache 하지 않도록 */
    if (!opt.cache) {
      if (/[?]/.test(src)) {
        timeid = `&${timeid}`
      } else {
        timeid = `?${timeid}`
      }
    } else {
      timeid = ''
    }
    if (/[.]scss$/.test(src)) { opt.type = 'scss' }
    return new Promise(async (resolve, reject) => {
      let include = ''
      /** SCSS 등은 문서가 완료되고 나서 시작해야 한다. */
      // if (opt.type === 'scss') {
      //   $(document).ready(async () => {
      //     try {
      //       const res = await axios.get(`${src}${timeid}`, {
      //         headers: {}, responseType: 'text', responseEncoding: 'utf-8',
      //         transformRequest: [ (data, headers) => { return data }   ],  
      //         transformResponse: [ (data, headers) => { return data }   ],  
      //       })  
      //       Sass.compile(res?.data, (e) => {
      //         $(document.body).append(`<style>${e.text}</style>`)
      //         resolve(true)
      //       })  
      //     } catch (e) { reject(e) }
      //   }) 
      // } else
      log.debug('IS-READY?', window?.document?.readyState)
      if (window && window.document && window.document.readyState == 'complete') {
        log.debug('LOAD-TYPE-1', opt.type)
        try {
          switch (opt.type) {
          // case 'umd': {
          //   include = `<script data-plugins="transform-modules-umd" type="text/babel" data-presets="react" data-type="module" src="${src}${timeid}"></script>`
          // } break
          case undefined: case '': default: {
            include = `<script async src="${src}${timeid}"></script>`
          } break }
          // if (include) {
            const $include = $(include)
            $(document.body).append($include)
          //   Babel.transformScriptTags()
          //   setTimeout($include.remove, 100)
          // }
        } catch (e) { log.debug('E:', e) }
        log.debug('RESOURCE-LOADED!')
        resolve(true)
      } else {
        log.debug('LOAD-TYPE-2', opt.type)
        switch (opt.type) {
        // case 'umd': {
        //   include = `<script data-plugins="transform-modules-umd" type="text/babel" data-presets="react" data-type="module" src="${src}${timeid}"></script>`
        // } break
        case undefined: case '': default: {
          include = `<script src="${src}${timeid}"></script>`
        } break }
        if (include) { document.write(include) }
        log.debug('RESOURCE-LOADED!')
        resolve(true)
      }
    })
  }
}

export default loader