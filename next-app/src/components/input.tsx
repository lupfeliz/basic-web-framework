/**
 * @File        : input.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 입력 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { ChangeEvent, ComponentPropsWithRef, KeyboardEvent, FocusEvent } from 'react'
import $ from 'jquery'
import app from '@/libs/app-context'
import format from '@/libs/format'
import proc from '@/libs/proc'
import values from '@/libs/values'
import * as C from '@/libs/constants'
import { KEYCODE_TABLE, isEvent, cancelEvent } from '@/libs/evdev'
import { Function1 } from 'lodash'
import { registForm } from '@/components/form'

const InputPropsSchema = {
  model: {} as any,
  onEnter: (() => '') as Function1<any, any>,
  onChange: (() => '') as Function1<any, any>,
  onKeyDown: (() => '') as Function1<any, any>,
  onKeyUp: (() => '') as Function1<any, any>,
  onFocus: (() => '') as Function1<any, any>,
  onBlur: (() => '') as Function1<any, any>,
  maxLength: 0 as number,
  minLength: 0 as number,
  maxValue: 0 as number,
  minValue: 0 as number,
  formatter: ((v: any) => v) as Function1<any, any>,
  type: '' as string,
  pattern: '' as string,
}

type InputProps = ComponentPropsWithRef<'input'> & Record<string, any> & Partial<typeof InputPropsSchema>

const { merge } = values
const { log, copyExclude, useRef, copyRef, useSetup, defineComponent, modelValue, isServer, until, strm } = app
export default defineComponent((props: InputProps, ref: InputProps['ref'] & any) => {
  const pprops = copyExclude(props, merge(Object.keys(InputPropsSchema), []))
  const self = useSetup({
    name: 'input',
    props,
    vars: {
      itype: props.type,
      avail: true,
      material: false,
      elem: useRef<any>(),
      wrap: useRef<any>(),
      valid: {
        error: false,
        isvalidated: false,
        isvalid: C.UNDEFINED,
        message: C.UNDEFINED,
      }
    },
    async mounted() {
      copyRef(ref, vars?.elem)
      log.debug('INPUT MOUNTED')
      registForm(self, () => vars?.elem)
      /** 최초상태 화면반영 */
      inputVal(modelValue(self()).value || '')
    },
    async updated(mode: any) {
      if (mode && vars) {
        /** 화면 강제 업데이트 발생시 화면반영 */
        inputVal(modelValue(self()).value || '')
      }
    }
  })
  const { uid, vars, update, ready } = self()
  if (!isServer() && !vars.material) {
    vars.material = true
    setTimeout(async () => {
      await until(() => app.ready(C.APPSTATE_LIBS), { maxcheck: 1000, interval: 10 })
      app.MaterialStyle((v) => {
        new v.TextField(vars?.elem.current)
        setTimeout(() => {
          /** FIXME: placeholder 가 아닌 label 로 적용할것 */
          if (!props.placeholder) {
            $(vars.wrap.current).find('.m-notch-between').css({ display: 'none' })
          } else {
            $(vars.wrap.current).find('.m-notch-between').css({ display: 'inherit' })
          }
        }, 100)
      })
      update(C.UPDATE_SELF)
    }, 1)
  }
  if (props?.type === 'number' || props?.type == 'numeric') {
    pprops.type = 'text'
    pprops.pattern = '[0-9]*'
    pprops.inputMode = 'numeric'
  } else {
    pprops.type = props.type
    pprops.pattern = props.pattern
    pprops.inputMode = props.inputMode
  }

  const inputVal = (v: any = C.UNDEFINED) => v === C.UNDEFINED ? $(vars?.elem?.current).val() : $(vars?.elem?.current).val(v) && v

  const toNumber = (v: any) => {
    if (!v) { return v }
    let s = 1
    v = String(v)
    if (v[0] == '-') {
      s = -1
      v = v.substring(1)
    } else if (v[0] == '+') {
      v = v.substring(1)
    }
    v = v.replace(/[^0-9]+/g, '')
    return Number(v) * s
  }

  /** 입력컴포넌트 변경이벤트 처리 */
  const onChange = async (e: ChangeEvent) => {
    const { setValue } = modelValue(self())
    /** 변경시 데이터모델에 값전달 */
    setValue(inputVal(), () => update(C.UPDATE_FULL))
    if (props.onChange) { props.onChange(e as any) }
  }
  /** 입력컴포넌트 키입력 이벤트 처리 */
  const onKeyDown = async (e: KeyboardEvent) => {
    if (vars.avail) {
      onKeyDownProc(e)
      if (props?.onKeyDown) { props.onKeyDown(e) }
    } else {
      cancelEvent(e)
    }
  }
  const onKeyUp = async (e: KeyboardEvent) => {
    if (vars.avail) {
      if (props?.onKeyUp) { props.onKeyUp(e) }
    } else {
      cancelEvent(e)
    }
  }
  const onFocus = async (e: FocusEvent) => {
    if (props?.onFocus) { props.onFocus(e) }
  }
  const onBlur = async (e: FocusEvent) => {
    const { setValue } = modelValue(self())
    if (vars?.itype === 'number' || vars?.itype === 'numeric') {
      let v = inputVal()
      const minv = Number(props?.minValue)
      const maxv = Number(props?.maxValue)
      if (props?.minValue !== C.UNDEFINED && v < minv) { v = minv }
      if (props?.maxValue !== C.UNDEFINED && v > maxv) { v = maxv }
      setValue(inputVal(v))
      update(C.UPDATE_FULL)
    }
    if (props?.onBlur) { props.onBlur(e) }
  }
  const onKeyDownProc = (e: KeyboardEvent) => {
    vars.avail = false
    const { props, setValue, value: vprev } = modelValue(self())
    if (props?.onKeyDown instanceof Function) { props.onKeyDown(e) }
    const cdnm = e.code
    const kcode = Number(e?.keyCode || 0)
    // log.debug('E:', e.code, e.keyCode)
    /** 이벤트가 존재하면 */
    if (isEvent(e)) {
      /** 허용키 : ctrl+c ctrl+v 방향키 bs delete tab enter space */
      if (vars?.itype === 'number' || vars?.itype === 'numeric') {
        let v = 0
        switch (kcode) {
        case KEYCODE_TABLE.PC.Esc:
        case KEYCODE_TABLE.PC.Enter:
        case KEYCODE_TABLE.PC.Delete:
        case KEYCODE_TABLE.PC.Backspace:
        case KEYCODE_TABLE.PC.Insert:
        case KEYCODE_TABLE.PC.Tab:
        case KEYCODE_TABLE.PC.Backslash:
        case KEYCODE_TABLE.PC.ArrowLeft:
        case KEYCODE_TABLE.PC.ArrowRight:
        case KEYCODE_TABLE.PC.Home:
        case KEYCODE_TABLE.PC.End:
        case KEYCODE_TABLE.PC.PageUp:
        case KEYCODE_TABLE.PC.PageDown:
        case KEYCODE_TABLE.PC.MetaLeft: 
        case KEYCODE_TABLE.PC.MetaRight: { /** NO-OP */ } break
        case C.UNDEFINED: { /** NO-OP */ } break
        case KEYCODE_TABLE.PC.ArrowUp: {
          v = Number(toNumber(inputVal()) || 0) - 1
          if (props?.formatter) {
            setValue(inputVal(props.formatter(v)))
          } else {
            setValue(inputVal(v))
          }
          cancelEvent(e)
        } break
        case KEYCODE_TABLE.PC.ArrowDown: {
          v = Number(toNumber(inputVal()) || 0) + 1
          if (props?.formatter) {
            setValue(inputVal(props.formatter(v)))
          } else {
            setValue(inputVal(v))
          }
          cancelEvent(e)
        } break
        default: {
          if (
            (kcode >= KEYCODE_TABLE.PC.Digit0 && kcode <= KEYCODE_TABLE.PC.Digit9) ||
            (kcode >= KEYCODE_TABLE.PC.Numpad0 && kcode <= KEYCODE_TABLE.PC.Numpad9) ||
            ( cdnm === 'Key1' || cdnm === 'Key2' || cdnm === 'Key3' ||
              cdnm === 'Key4' || cdnm === 'Key5' || cdnm === 'Key6' ||
              cdnm === 'Key7' || cdnm === 'Key8' || cdnm === 'Key9' ||
              cdnm === 'Key0') ||
            ( cdnm === 'Digit1' || cdnm === 'Digit2' || cdnm === 'Digit3' ||
              cdnm === 'Digit4' || cdnm === 'Digit5' || cdnm === 'Digit6' ||
              cdnm === 'Digit7' || cdnm === 'Digit8' || cdnm === 'Digit9' ||
              cdnm === 'Digit0')) {
            /** NO-OP */
          } else if ((
            /** Ctrl+C, Ctrl+V, Ctrl-A, Ctrl+R 허용 */
            ([KEYCODE_TABLE.PC.KeyA, KEYCODE_TABLE.PC.KeyC, KEYCODE_TABLE.PC.KeyV, KEYCODE_TABLE.PC.KeyR].indexOf(kcode) !== -1) &&
            e.ctrlKey)) {
            /** NO-OP */
          } else {
            cancelEvent(e)
          }
        } }
      }
      const el = $(vars?.elem.current)[0]
      setTimeout(async () => {
        {
          if ([KEYCODE_TABLE.PC.Backspace, KEYCODE_TABLE.PC.Delete].indexOf(kcode) !== -1) {
            /** 삭제키인(backspace, delete) 경우 별도처리 */
            let v1, v2, l1, l2
            let st = Number(el.selectionStart || 0)
            let ed = Number(el.selectionEnd || 0)
            v1 = props?.formatter ? props.formatter(vprev) : vprev
            v2 = props?.formatter ? props.formatter(el.value) : el.value
            if (el.value === '') {
              setValue('')
              return vars.avail = true
            }
            LOOP: while(true) {
              l1 = v1.length
              l2 = v2.length
              // log.debug('LENGTH:', l1, l2, v1, v2, st, ed, el.value)
              if (l2 === l1) {
                // if (st > 1 && kcode === KEYCODE_TABLE.PC.Backspace)
                if (kcode === KEYCODE_TABLE.PC.Backspace) {
                  v2 = `${v2.substring(0, st - 1)}${v2.substring(st)}`
                  v2 = props?.formatter ? props.formatter(v2) : v2
                  l2 --
                  st --
                  ed --
                // } else if (ed < l2 && kcode === KEYCODE_TABLE.PC.Delete) {
                } else if (kcode === KEYCODE_TABLE.PC.Delete) {
                  v2 = `${v2.substring(0, st)}${v2.substring(st + 2)}`
                  v2 = props?.formatter ? props.formatter(v2) : v2
                  l2 --
                }
              }
              if (st < 0) { st = 0 }
              if (ed < 0) { ed = 0 }
              // log.debug('CHECK:', l1, l2, st, ed, v2)
              el.value = v2
              await proc.sleep(1)
              el.selectionStart = st
              el.selectionEnd = ed
              setValue(inputVal(v2))
              break LOOP
            }
          }  else {
            /** 일반키인경우 처리 */
            let v = el.value
            let st = Number(el.selectionStart || 0)
            let ed = Number(el.selectionEnd || 0)
            let ch = String(v).substring(st - 1, ed)
            // log.debug('CHAR:', `'${ch}'`, st, ed, v.length, kcode, v)
            if (vars?.itype === 'number' || vars?.itype === 'numeric') {
              v = props?.formatter ? props.formatter(el.value) : v
              if (props?.maxLength && v.length > props.maxLength) {
                v = props?.formatter ? props.formatter(vprev) : vprev
                st--
                ed--
              }
              const l1 = String(el.value).length
              const l2 = v.length
              el.value = v
              await proc.sleep(1)
              /** TODO 기존에 선택상태였는지 체크, 삭제의 경우, 붙여넣기의 경우 */
              if (l2 > l1) {
                st ++
                ed ++
              }
              el.selectionStart = st
              el.selectionEnd = ed
              setValue(inputVal(v))
            }
          }
        }
        if (e?.keyCode === KEYCODE_TABLE.PC.Enter && props?.onEnter instanceof Function) { props.onEnter(e) }
        update(C.UPDATE_FULL)
        vars.avail = true
      }, 50)
    }
  }
  return (
  <>
  <div
    ref={ vars?.wrap }
    >
    <input
      ref={ vars?.elem }
      className={ strm(`form-control`) }
      { ...pprops }
      id={ app.ready() ? uid : C.UNDEFINED }
      maxLength={ props?.maxLength }
      type={ pprops?.type }
      inputMode={ pprops.inputMode }
      pattern={ pprops.pattern }
      onChange={ onChange }
      onKeyUp={ onKeyUp }
      onBlur={ onBlur }
      onFocus={ onFocus }
      onKeyDown={ onKeyDown }
      placeholder={ pprops.placeholder }
      />
  </div>
  </>
  )
})