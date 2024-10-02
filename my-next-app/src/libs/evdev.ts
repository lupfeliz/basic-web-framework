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

const U = undefined

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
  VKBD                : 229,
}

const _KEYCODES2 = {
  /**
   * 특수문자 키보드   [PC, ANDROID, IOS, CODE, CHAR]
   * Android 에서 CODE 는 물리키보드인 경우에서만 표시됨
   * 대다수의 경우 Android 에서는 229 (가상키눌림) 리턴
   * IOS 는 물리키보드와 동일
   * 키코드 참고 : https://www.toptal.com/developers/keycode/table
   **/
  SEMICOLON           : [ 59, 229, 186, 'Semicolon', ';'],
  EQUAL               : [ 61, 229, 186, 'Equal', '='],
  COMMA               : [188, 229, 188, 'Comma', ','],
  HYPHEN              : [189, 229, 189, 'Minus', '-'],
  PERIOD              : [190, 229, 190, 'Period', '.'],
  SLASH               : [191, 229, 191, 'Slash', '/'],
  ACCENT              : [192, 229, 192, 'Backquote', '`'],
  BRACKETOPEN         : [219, 229, 219, 'BracketLeft', '['],
  BACKSLASH           : [220, 229, 220, 'Backslash', '\\'],
  BRACKETCLOSE        : [221, 229, 221, 'BracketRight', ']'],
  APOSTROPHE          : [222, 229, 222, 'Quote', '\''],
  /** 동작키보드 (화살표, 엔터키 등) */
  ESC                 : [ 27, 27, 27, 'Esc', U],
  ENTER               : [ 13, 13, 13, 'Enter', U],
  /** IOS 에서는 'Delete' 가 아닌 'Undefined' */
  DEL                 : [ 46, 46, 46, 'Delete', U],
  /** IOS 에서는 'Insert' 이벤트 자체가 없음 */
  INSERT              : [ 45,  45,   U, 'Insert', U],
  TAB                 : [  9,   9,   9, 'Tab', U],
  BS                  : [  8,   8,   8, 'Backspace', U],
  SPACE               : [ 32, 229,  32, 'Space', ' '],
  LEFT                : [ 37,  37,  37, 'ArrowLeft', U],
  RIGHT               : [ 39,  39,  39, 'ArrowRight', U],
  UP                  : [ 38,  38,  38, 'ArrowUp', U],
  DOWN                : [ 40,  40,  40, 'ArrowDown', U],
  HOME                : [ 36,  36,  36, 'Home', U],
  END                 : [ 35,  35,  35, 'End', U],
  PGUP                : [ 33,  33,  33, 'PageUp', U],
  PGDN                : [ 34,  34,  34, 'PageDown', U],
  /** 메타키보드 */
  SHIFT               : [ 16,  16,  16, 'ShiftLeft', U],
  CTRL                : [ 17,  17,  17, 'ControlLeft', U],
  ALT                 : [ 18,  18,  18, 'AltLeft', U],
  SUPER               : [ 91,  91,  91, 'MetaLeft', U],
  /** 숫자키 */
  NK0                 : [ 48,  48,  48, 'Digit0', '0'],
  NK1                 : [ 49,  49,  49, 'Digit1', '1'],
  NK2                 : [ 50,  50,  50, 'Digit2', '2'],
  NK3                 : [ 51,  51,  51, 'Digit3', '3'],
  NK4                 : [ 52,  52,  52, 'Digit4', '4'],
  NK5                 : [ 53,  53,  53, 'Digit5', '5'],
  NK6                 : [ 54,  54,  54, 'Digit6', '6'],
  NK7                 : [ 55,  55,  55, 'Digit7', '7'],
  NK8                 : [ 56,  56,  56, 'Digit8', '8'],
  NK9                 : [ 57,  57,  57, 'Digit9', '9'],
  /** 키패드 */
  KP0                 : [ 96,  96,  96, 'Numpad0', '0'],
  KP1                 : [ 97,  97,  97, 'Numpad1', '1'],
  KP2                 : [ 98,  98,  98, 'Numpad2', '2'],
  KP3                 : [ 99,  99,  99, 'Numpad3', '3'],
  KP4                 : [100, 100, 100, 'Numpad4', '4'],
  KP5                 : [101, 101, 101, 'Numpad5', '5'],
  KP6                 : [102, 102, 102, 'Numpad6', '6'],
  KP7                 : [103, 103, 103, 'Numpad7', '7'],
  KP8                 : [104, 104, 104, 'Numpad8', '8'],
  KP9                 : [105, 105, 105, 'Numpad9', '9'],
  /** Android 전용 가상키눌림 */
  VKBD                : [229, 229, 229, U, U],
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