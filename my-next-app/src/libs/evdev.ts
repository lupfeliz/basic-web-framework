/**
 * @File        : evdev.ts
 * @Author      : 정재백
 * @Since       : 2023-10-10
 * @Description : 이벤트 디바이스 유틸
 * @Site        : https://devlog.ntiple.com
 **/

import values from '@/libs/values'
const { put } = values

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

const _KEYCODE_TABLE = {
  /**
   * 특수문자 키보드   [PC, ANDROID, IOS, CHAR]
   * Android 에서 CODE 는 물리키보드인 경우에서만 표시됨
   * 대다수의 경우 Android 에서는 229 (가상키눌림) 리턴
   * IOS 는 물리키보드와 동일
   * 키코드 참고 : https://www.toptal.com/developers/keycode/table
   **/
  Semicolon           : [ 59, 229, 186,  ';'],
  Equal               : [ 61, 229, 186,  '='],
  Comma               : [188, 229, 188,  ','],
  Minus               : [189, 229, 189,  '-'],
  Period              : [190, 229, 190,  '.'],
  Slash               : [191, 229, 191,  '/'],
  Backquote           : [192, 229, 192,  '`'],
  BracketLeft         : [219, 229, 219,  '['],
  Backslash           : [220, 229, 220, '\\'],
  BracketRight        : [221, 229, 221,  ']'],
  Quote               : [222, 229, 222, '\''],
  /** 동작키보드 (화살표, 엔터키 등) */
  Esc                 : [ 27,  27,  27,    U],
  Enter               : [ 13,  13,  13,    U],
  /** IOS 에서는 'Delete' 가 아닌 'Undefined' */
  Delete              : [ 46,  46,  46,    U],
  /** IOS 에서는 'Insert' 이벤트 자체가 없음 */
  Insert              : [ 45,  45,   U,    U],
  Tab                 : [  9,   9,   9,    U],
  Backspace           : [  8,   8,   8,    U],
  Space               : [ 32, 229,  32,  ' '],
  ArrowLeft           : [ 37,  37,  37,    U],
  ArrowRight          : [ 39,  39,  39,    U],
  ArrowUp             : [ 38,  38,  38,    U],
  ArrowDown           : [ 40,  40,  40,    U],
  Home                : [ 36,  36,  36,    U],
  End                 : [ 35,  35,  35,    U],
  PageUp              : [ 33,  33,  33,    U],
  PageDown            : [ 34,  34,  34,    U],
  /** 메타키보드 */
  ShiftLeft           : [ 16,  16,  16,    U],
  ShiftRight          : [ 16,  16,  16,    U],
  ControlLeft         : [ 17,  17,  17,    U],
  ControlRight        : [ 17,  17,  17,    U],
  AltLeft             : [ 18,  18,  18,    U],
  AltRight            : [ 18,  18,  18,    U],
  MetaLeft            : [ 91,  91,  91,    U],
  MetaRight           : [ 91,  91,  91,    U],
  /** 숫자키 */
  Digit0              : [ 48, 229,  48,  '0'],
  Digit1              : [ 49, 229,  49,  '1'],
  Digit2              : [ 50, 229,  50,  '2'],
  Digit3              : [ 51, 229,  51,  '3'],
  Digit4              : [ 52, 229,  52,  '4'],
  Digit5              : [ 53, 229,  53,  '5'],
  Digit6              : [ 54, 229,  54,  '6'],
  Digit7              : [ 55, 229,  55,  '7'],
  Digit8              : [ 56, 229,  56,  '8'],
  Digit9              : [ 57, 229,  57,  '9'],
  /** 키패드 */
  Numpad0             : [ 96, 229,  96,  '0'],
  Numpad1             : [ 97, 229,  97,  '1'],
  Numpad2             : [ 98, 229,  98,  '2'],
  Numpad3             : [ 99, 229,  99,  '3'],
  Numpad4             : [100, 229, 100,  '4'],
  Numpad5             : [101, 229, 101,  '5'],
  Numpad6             : [102, 229, 102,  '6'],
  Numpad7             : [103, 229, 103,  '7'],
  Numpad8             : [104, 229, 104,  '8'],
  Numpad9             : [105, 229, 105,  '9'],
  KeyA                : [ 65, 229,  65,  'a'],
  KeyB                : [ 66, 229,  66,  'b'],
  KeyC                : [ 67, 229,  67,  'c'],
  KeyD                : [ 68, 229,  68,  'd'],
  KeyE                : [ 69, 229,  69,  'e'],
  KeyF                : [ 70, 229,  70,  'f'],
  KeyG                : [ 71, 229,  71,  'g'],
  KeyH                : [ 72, 229,  72,  'h'],
  KeyI                : [ 73, 229,  73,  'i'],
  KeyJ                : [ 74, 229,  74,  'j'],
  KeyK                : [ 75, 229,  75,  'k'],
  KeyL                : [ 76, 229,  76,  'l'],
  KeyM                : [ 77, 229,  77,  'm'],
  KeyN                : [ 78, 229,  78,  'n'],
  KeyO                : [ 79, 229,  79,  'o'],
  KeyP                : [ 80, 229,  80,  'p'],
  KeyQ                : [ 81, 229,  81,  'q'],
  KeyR                : [ 82, 229,  82,  'r'],
  KeyS                : [ 83, 229,  83,  's'],
  KeyT                : [ 84, 229,  84,  't'],
  KeyU                : [ 85, 229,  85,  'u'],
  KeyV                : [ 86, 229,  86,  'v'],
  KeyW                : [ 87, 229,  87,  'w'],
  KeyX                : [ 88, 229,  88,  'x'],
  KeyY                : [ 89, 229,  89,  'y'],
  KeyZ                : [ 90, 229,  90,  'z'],
  /** Android 전용 가상키눌림 */
  Virtual             : [229, 229, 229,    U],
}

type KEYCODE_TABLE_TYPE<T extends Record<string, any>> = Record<keyof T, any> 

const KEYCODE_TABLE = {
  PC: {} as KEYCODE_TABLE_TYPE<typeof _KEYCODE_TABLE>,
  ANDROID: {} as KEYCODE_TABLE_TYPE<typeof _KEYCODE_TABLE>,
  IOS: {} as KEYCODE_TABLE_TYPE<typeof _KEYCODE_TABLE>,
  CHAR: {} as KEYCODE_TABLE_TYPE<typeof _KEYCODE_TABLE>
}

const KEYCODE_REV_TABLE = {
  PC: {} as Record<number, string>,
  ANDROID: {} as Record<number, string>,
  IOS: {} as Record<number, string>,
  CHAR: {} as Record<string, string>,
}

for (const k in _KEYCODE_TABLE) {
  put(KEYCODE_TABLE.PC, k, (_KEYCODE_TABLE as any)[k][0])
  put(KEYCODE_TABLE.ANDROID, k, (_KEYCODE_TABLE as any)[k][1])
  put(KEYCODE_TABLE.IOS, k, (_KEYCODE_TABLE as any)[k][2])
  put(KEYCODE_TABLE.CHAR, k, (_KEYCODE_TABLE as any)[k][3])
}

LOOP1: for (const k in KEYCODE_TABLE) {
  for (const k2 in (KEYCODE_TABLE as any)[k]) {
    const v = (KEYCODE_TABLE as any)[k][k2]
    if (k == 'ANDROID' && v == 229) { continue LOOP1 }
    if (v !== U) { put((KEYCODE_REV_TABLE as any)[k], v, k2) }
  }
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

export { KEYCODES, KEYRVCODES, KEYCODE_TABLE, KEYCODE_REV_TABLE, INPUT_TYPES, cancelEvent, isEvent }