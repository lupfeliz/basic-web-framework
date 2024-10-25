/**
 * @File        : macro-loader.js
 * @Author      : 정재백
 * @Since       : 2024-10-25
 * @Description : 빌드시 소스코드를 가로채어 변화시켜주는 웹팩 플러그인
 *                미리 만들어놓은 매크로를 사용해 소스를 변조해 준다.
 *                주의! 매크로는 반드시 1줄단위로 변조해 주어야 소스 라인수가 서로 맞는다.
 * @Site        : https://devlog.ntiple.com
 **/
const PTN_IMPORT = /\/\*[ \t]*#MACRO-DEFINE#[ \t]*.*\*\//
const REPLACES = `
import app from '@/libs/app-context';
const { getLogger, definePage, useSetup, goPage, getParameter, asType, useRef } = app;
`.replace(/[ \r\n\t]+/gm, ' ').trim()
module.exports = function(source) {
  // console.log('SRCPATH:', this.resourcePath)
  let result = String(source || '')
  let mat
  /** 치환데이터 저장소를 초기화 한다 */
  /** 소스코드에서 // #MACRO-IMPORTS# 가 발견되면 1회 치환한다 */
  if (PTN_IMPORT.test(result)) {
    // console.log('SRCPATH:', this.resourcePath)
    result = result.replace(PTN_IMPORT, REPLACES)
  }
  return result
}
/** 치환데이터 저장소 */
const BUILD_STORE = { $INITIALIZED: false }