/**
 * @File        : common-codes.ts
 * @Author      : 정재백
 * @Since       : 2024-10-27
 * @Description : 공통코드 관련 유틸
 *                우선은 인터페이스 까지만 갖추고 하드코딩
 * @Site        : https://devlog.ntiple.com
 **/

import { getLogger } from "./log"

const LIBNAME = 'common-codes'
const log = getLogger(LIBNAME)

const vars = {
  codes: {
    cmn01: {
      '001': [
        'gmail.com',
        'naver.com',
        'daum.net',
        'kakao.com',
        'hotmail.com',
        'icloud.com',
      ]
    },
  }
}

const commonCodes = {
  /** TODO: 실제로는 api 를 통해 백엔드 통신 및 캐싱하여 사용 */
  async get(ns: string, code?: string, inx?: number) {
    let ret: any = undefined
    let o: any
    if (!ns) { return ret }
    if ((o = vars.codes) && (o = o[ns])) { ret = o }
    if (ret && code && ret[code]) {
      ret = ret[code]
      if (inx !== undefined) { ret = ret[inx] }
    }
    log.trace('RET:', ns, code, inx, ret)
    return ret
  }
}

export default commonCodes