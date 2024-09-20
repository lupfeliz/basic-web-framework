/**
 * @File        : evdev.ts
 * @Author      : 정재백
 * @Since       : 2023-10-10
 * @Description : 이벤트 디바이스 유틸
 * @Site        : https://devlog.ntiple.com
 **/

type KeycodeType = typeof _KEYCODES & {
  [name: string]: number
}
type KeyRevcodeType = typeof _KEYCODES & {
  [name: number]: string
}

const _KEYCODES = {
  /** 특수문자 키보드 */
  SEMICOLON           : 186,
  EQUAL               : 187,
  COMMA               : 188,
  HYPHEN              : 189,
  PERIOD              : 190,
  SLASH               : 192,
  ACCENT              : 192,
  BRACKETOPEN         : 219,
  BACKSLASH           : 220,
  BRACKETCLOSE        : 221,
  APOSTROPHE          : 222,
  /** 동작키보드 (화살표, 엔터키 등) */
  ESC                 : 27,
  ENTER               : 13,
  DEL                 : 46,
  INSERT              : 45,
  TAB                 : 9,
  BS                  : 8,
  SPACE               : 32,
  LEFT                : 37,
  RIGHT               : 39,
  UP                  : 38,
  DOWN                : 40,
  HOME                : 36,
  END                 : 35,
  PGUP                : 33,
  PGDN                : 34,
  /** 메타키보드 */
  SHIFT               : 16,
  CTRL                : 17,
  ALT                 : 18,
  SUPER               : 91,
  /** 숫자키 */
  NK0                 : 48,
  NK1                 : 49,
  NK2                 : 50,
  NK3                 : 51,
  NK4                 : 52,
  NK5                 : 53,
  NK6                 : 54,
  NK7                 : 55,
  NK8                 : 56,
  NK9                 : 57,
  /** 키패드 */
  KP0                 : 96,
  KP1                 : 97,
  KP2                 : 98,
  KP3                 : 99,
  KP4                 : 100,
  KP5                 : 101,
  KP6                 : 102,
  KP7                 : 103,
  KP8                 : 104,
  KP9                 : 105,
}
const KEYCODES = _KEYCODES as KeycodeType

const INPUT_TYPES = {
  deleteContentBackward      : 'deleteContentBackward',
  deleteContentForward       : 'deleteContentForward',
}

/** A ~ Z 까지 키코드 */
for (let inx = 'A'.charCodeAt(0); inx <= 'Z'.charCodeAt(0); inx++) {
  KEYCODES[String.fromCharCode(inx)] = inx;
}
/** 0 ~ 9 까지 키코드 */
for (let inx = '0'.charCodeAt(0); inx <= '9'.charCodeAt(0); inx++) {
  KEYCODES[String.fromCharCode(inx)] = inx;
}

/** 키코드 -> 코드명 역색인 */
const KEYRVCODES = {} as KeyRevcodeType
for (const key in KEYCODES) KEYRVCODES[KEYCODES[key]] = key;

const isEvent = (e: any) => {
  return e && e.preventDefault && e.stopPropagation
}

const cancelEvent = (e: any) => {
  e.preventDefault()
  e.stopPropagation()
}

export { KEYCODES, KEYRVCODES, INPUT_TYPES, cancelEvent, isEvent }