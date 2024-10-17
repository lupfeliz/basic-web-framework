/**
 * @File        : server.ts
 * @Author      : 정재백
 * @Since       : 2024-10-12
 * @Description : vite-plugin-legacy 를 지원하기 위한 source-modifier
 * @Site        : https://devlog.ntiple.com
 **/
import path, { dirname } from 'path'
import { existsSync, cpSync } from 'fs'

const log = { debug: console.log }
const env: any = process.env
const baseURL = env.BASE_URL
// const dir = dirname(dirname(dirname(__filename)))
// const distdir = path.join(dir, 'dist')
const nd1 = `<script type="module" src="${baseURL}/_nuxt/`
const nd2 = '" crossorigin></script>'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, e) => {
    // if (!env.SYSTEMJS) {
    //   if (!existsSync(`${env.BASE_DIR}/dist/systemjs.min.js`)) {
    //     log.debug('SYSTEMJS:', existsSync(`${env.BASE_DIR}/dist/_nuxt/system.min.js`))
    //     cpSync(`${env.BASE_DIR}/node_modules/systemjs/dist/system.min.js`, `${env.BASE_DIR}/dist/_nuxt/system.min.js`)
    //     env.SYSTEMJS = true
    //   }
    // }
    /** 스크립트 import 위치 확인 필요 */
    // html.head.splice(0, 0, `<script src="${env.BASE_URL}/_nuxt/system.min.js"></script>`)
    // html.head.push( `<script></script>`,)
  })
  /** FIXME: 현재 극히일부 상황에 대한 처리만 하였으므로 더 테스트가 필요함 */
  nitroApp.hooks.hook('render:response', (resp, e) => {
    if (/(^$|^[a-zA-Z0-9_-]+$|\/[a-zA-Z0-9_-]+$|\.html$)/.test(String(e?.event?.context?.params?._))) {
      let st = 0, ed = 0
      let html = String(resp.body)
      let nth = 0
      let fname = '', tag = ''
      // console.log('MODIFY-PATH:', e?.event?.context?.params?._)
      LOOP1: for (let inx = 0; inx < 999; inx++) {
        st = html.indexOf(nd1, ed)
        ed = html.indexOf(nd2, st + nd1.length)
        /** entrypoint 스크립트인 경우 처리 */
        if (st != -1 && ed != -1 && (ed - st - nd1.length) < 30) {
          fname = html.substring(st + nd1.length, ed)
          if (fname == '@vite/client') { break LOOP1 }
          if (nth === 0) {
            tag = `<script type="systemjs-module" src="${baseURL}/_nuxt/${fname}" crossorigin></script>`
            html = `${html.substring(0, st)}${tag}${html.substring(ed + nd2.length)}`
            ed = st + tag.length
          } else if (!fname.endsWith('-legacy.js')) {
            html = `${html.substring(0, st)}${html.substring(ed + nd2.length)}`
            ed = st 
          }
          // console.log('SCRIPT:', fname, tag)
          nth += 1
        } else {
          break
        }
      }
      if (nth > 0) { resp.body = html }
    }
  })
})