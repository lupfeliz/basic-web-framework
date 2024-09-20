/**
 * @File        : hangul.ts
 * @Author      : 정재백
 * @Since       : 2023-04-23
 * @Description : 한글 조사어미 분석 모듈
 * @Site        : https://devlog.ntiple.com
 **/

import log from './log'

/**
 * 유니코드 조합공식
 * (초성) * 588 + (중성) * 28 + (종성) + 44302
 */
const BASE_CODE = 44032
const BLANK = '　'

/** 3벌(초,중,종성) 테이블 */
const TB_CJJ = [
  /** 19개 초성 자음 */
  ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
  /** 21개 중성 모음 */
  ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'],
  /** 16개 종성 자음 (27칸) */
  ['　', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅌ', 'ㅍ', 'ㅎ'],
]

/** 사용하는 조사만 간추림. */
const LST_JOSA = [
  ['을', '를'],
  ['은', '는'],
  ['이', '가'],
  ['의', '의'],
  ['에', '에'],
]

class Hangul {
  /** 1글자의 초, 중, 종성을 분리한다. */
  extract = (ch: string) => {
    const ret: any[] = ['', '', '']
    if (ch && ch.length == 1) {
      const code = String(ch).charCodeAt(0)
      let mod = code - BASE_CODE
      /** 초성분리 */
      for (let inx = TB_CJJ[0].length - 1; inx >= 0; inx--) {
        if (mod >= (inx * 588)) {
          mod = mod - inx * 588
          ret[0] = TB_CJJ[0][inx]
          break
        }
      }
      log.trace('MOD-1:', mod, ret)
      /** 중성분리 */
      for (let inx = TB_CJJ[1].length - 1; inx >= 0; inx--) {
        if (mod >= (inx * 28)) {
          mod = mod - inx * 28
          ret[1] = TB_CJJ[1][inx]
          break
        }
      }
      log.trace('MOD-2:', mod, ret)
      /** 종성분리 (사실 종성 자체는 이 시점에서 바로 mod 값임, 로직 정리를 위해 아래 코드 기재) */
      for (let inx = TB_CJJ[2].length - 1; inx >= 0; inx--) {
        if (TB_CJJ[2][inx] === BLANK) { continue }
        if (mod >= inx) {
          mod = mod - inx
          ret[2] = TB_CJJ[2][inx]
          break
        }
      }
      log.trace('MOD-3:', mod, ret)
      /** mod 는 여기서 0 이어야 한다. */
    }
    return ret
  }

  /**
   * 조사판단.
   * xx (을/를) 입력해주세요 -> 이름을 입력해주세요 / 번호를 입력해주세요
   * detectJosa('이름', '을') => '이름을'
   * detectJosa('번호', '을') => '번호를'
   * detectJosa('이름', '은') => '이름을'
   * detectJosa('번호', '은') => '번호는'
   * detectJosa('이름', '이') => '이름이'
   * detectJosa('번호', '이') => '번호가'
   */
  detectJosa = (str: string, josa: string, wrap?: string) => {
    if (str) { str = str.trim() }
    let ret = [str, josa]
    if (!str || str.length <= 1 || !josa) { return '' }
    let josaSet: any[] = [ ]
    LOOP1:
    for (const set of LST_JOSA) {
      for (const str of set) {
        if (str == josa) {
          josaSet = set
          break LOOP1
        }
      }
    }
    /** 찾는 조사SET 이 없으면 바로 종료 */
    if (josaSet.length == 0) { return `${ret[0]}${ret[1]}` }
    let lch = str.charAt(str.length - 1)
    const ext = hangul.extract(lch)
    if (ext[2]) {
      /** 받침이 있는 경우 */
      ret[1] = josaSet[0]
    } else {
      /** 받침이 없는 경우 */
      switch (lch.toLowerCase()) {
        case 'l': case 'm': case 'n': case 'r':
        case '1': case '3': case '6': case '7':
        case '8': case '0':
          ret[1] = josaSet[0]
          break
        default:
          ret[1] = josaSet[1]
          break
      }
    }
    if (wrap) {
      if (wrap.length > 1) {
        return `${wrap[0]}${ret[0]}${wrap[1]}${ret[1]}`
      } else {
        return `${wrap}${ret[0]}${wrap}${ret[1]}`
      }
    } else {
      return `${ret[0]}${ret[1]}`
    }
  }

  /**
   * 이름{term -> replace} 을{josa} 입력해주세요{str}
   */
  replaceWithJosa = (term: any, replace: string, josa: string, str: string) => {
    let ret = str
    ret = str.replace(term, hangul.detectJosa(replace, josa))
    return ret
  }
}

const hangul = new Hangul()

export default hangul
export { TB_CJJ }