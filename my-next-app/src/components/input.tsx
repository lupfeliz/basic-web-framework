/**
 * @File        : input.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 입력 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
// import _TextField, { TextFieldProps as _TextFieldProps } from '@mui/material/TextField'
import { ChangeEvent, ComponentPropsWithRef, KeyboardEvent, FocusEvent } from 'react'
import $ from 'jquery'
import app from '@/libs/app-context'
import format from '@/libs/format'
import proc from '@/libs/proc'
import values from '@/libs/values'
import * as C from '@/libs/constants'
import { KEYCODES, isEvent, cancelEvent } from '@/libs/evdev'
import { Function1 } from 'lodash'

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
  type: '' as string,
  pattern: '' as string
}

// type InputProps = _TextFieldProps & typeof InputPropsSchema
type InputProps = ComponentPropsWithRef<'input'> & Record<string, any> & Partial<typeof InputPropsSchema>

const { merge } = values
const { log, copyExclude, useRef, copyRef, useSetup, defineComponent, modelValue } = app
export default defineComponent((props: InputProps, ref: InputProps['ref'] & any) => {
  const pprops = copyExclude(props, merge(Object.keys(InputPropsSchema), []))
  // const iprops = copyExclude(props?.slotProps?.htmlInput || {}, merge([])) as any
  const elem = useRef<any>()
  const equeue = [] as any[]
  const self = useSetup({
    name: 'input',
    props,
    vars: {
      itype: props.type,
      avail: true
    },
    async mounted() {
      copyRef(ref, elem)
      /** 최초상태 화면반영 */
      inputVal(modelValue(self())?.value || '')
    },
    async updated(mode: any) {
      if (mode && vars) {
        /** 화면 강제 업데이트 발생시 화면반영 */
        inputVal(modelValue(self())?.value || '')
      }
    }
  })
  const { uid, vars, update, ready } = self()
  if (props?.type === 'number') {
    pprops.type = 'text'
    pprops.pattern = '[0-9]*'
    pprops.inputMode = 'numeric'
  } else {
    pprops.type = props.type
    pprops.pattern = props.pattern
    pprops.inputMode = props.inputMode
  }

  // const inputVal = (v: any = C.UNDEFINED) => v === C.UNDEFINED ? $(elem?.current).find('input').val() : $(elem?.current).find('input').val(v) && v
  const inputVal = (v: any = C.UNDEFINED) => v === C.UNDEFINED ? $(elem?.current).val() : $(elem?.current).val(v) && v

  /** 입력컴포넌트 변경이벤트 처리 */
  const onChange = async (e: ChangeEvent) => {
    const { setValue } = modelValue(self())
    /** 변경시 데이터모델에 값전달 */
    setValue(inputVal(), () => update(C.UPDATE_FULL))
    if (props.onChange) { props.onChange(e as any) }
  }
  /** 입력컴포넌트 키입력 이벤트 처리 */
  // const onKeyDown = async (e: any) => {
  //   const keycode = e?.keyCode || 0
  //   switch (keycode) {
  //   case 13: {
  //     if (props.onEnter) { props.onEnter(e) }
  //   } break
  //   }
  // }
  const onKeyDown = async (e: KeyboardEvent) => {
    // equeue.push(e)
    // cancelEvent(e)
    log.debug('ON-KEY-DOWN:', e)
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
    if (vars?.itype === 'number') {
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
    // const e = equeue.pop()
    vars.avail = false
    const props = self().props
    const { setValue } = modelValue(self())
    if (props?.onKeyDown instanceof Function) { props.onKeyDown(e) }
    const cdnm = e.code
    const kcode = Number(e?.keyCode || 0)

    /** 이벤트가 존재하면 */
    if (isEvent(e)) {
      /** 허용키 : ctrl+c ctrl+v 방향키 bs delete tab enter space */
      if (vars?.itype === 'number') {
        let v = 0
        switch (kcode) {
        case KEYCODES.ESC:
        case KEYCODES.ENTER:
        case KEYCODES.DEL:
        case KEYCODES.INSERT:
        case KEYCODES.TAB:
        case KEYCODES.BS:
        case KEYCODES.LEFT:
        case KEYCODES.RIGHT:
        case KEYCODES.HOME:
        case KEYCODES.END:
        case KEYCODES.PGUP:
        case KEYCODES.PGDN:
        case KEYCODES.SUPER: { /** NO-OP */ } break
        case C.UNDEFINED: { /** NO-OP */ } break
        case KEYCODES.UP: {
          v = Number(inputVal() || 0) - 1
          setValue(inputVal(v))
          cancelEvent(e)
        } break
        case KEYCODES.DOWN: {
          v = Number(inputVal() || 0) + 1
          setValue(inputVal(v))
          cancelEvent(e)
        } break
        default: {
          if (
            (kcode >= KEYCODES.KP0 && kcode <= KEYCODES.KP9) ||
            (kcode >= KEYCODES.NK0 && kcode <= KEYCODES.NK9) ||
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
            ([KEYCODES['A'], KEYCODES['C'], KEYCODES['V'], KEYCODES['R']].indexOf(kcode) !== -1) &&
            e.ctrlKey)) {
            /** NO-OP */
          } else {
            cancelEvent(e)
          }
        } }
      }
      // const el = $(elem.current).find('input')[0]
      const el = $(elem.current)[0]
      let v = el.value
      setTimeout(async () => {
        // const sel = document.getSelection()
        // if (Number(sel?.rangeCount) > 0) {
        //   const range = sel?.getRangeAt(0)
        //   const st = range?.startOffset || -1
        //   const ed = range?.endOffset || -1
        //   log.debug('CHECK:', sel?.anchorNode, range, st, ed, sel?.anchorOffset)
        //   if (st != -1 && ed != -1) {
        //   }
        // }
        {
          let st = Number(el.selectionStart || 1)
          let ed = Number(el.selectionEnd || 1)
          let ch = String(v).substring(st - 1, ed)
          log.debug('CHAR:', `'${ch}'`, st, ed, kcode, v)
          if (vars?.itype === 'number') {
            /** FIXME: formatter 테스트 */
            v = format.numeric(el.value)
            const l1 = String(el.value).length
            const l2 = v.length
            el.value = v
            await proc.sleep(1)
            /** TODO 기존에 선택상태였는지 체크, 삭제의 경우, 붙여넣기의 경우 */
            if (l2 > l1) {
              st ++;
              ed ++;
            }
            el.selectionStart = st
            el.selectionEnd = ed
            setValue(inputVal(v))
          }
        }
        if (e?.keyCode === KEYCODES.ENTER && props?.onEnter instanceof Function) { props.onEnter(e) }
        update(C.UPDATE_FULL)
        vars.avail = true
      }, 10)
    }
  }
  return (
  <>
  {/*
  <_TextField ref={ elem }
    hiddenLabel
    slotProps={{
      htmlInput: {
        maxLength: props?.maxLength || iprops?.maxLength,
        type: pprops?.type || iprops?.type,
        inputMode: pprops?.inputMode || iprops?.inputMode,
        pattern: pprops?.pattern || iprops?.pattern,
      }
    }}
    { ...pprops }
    onChange={ onChange }
    onKeyUp={ onKeyUp }
    onBlur={ onBlur }
    onFocus={ onFocus }
    onKeyDown={ onKeyDown }
    /> 
  */}
  <div
    // className='form-floating form-floating-outlined'
    >
    <input
      ref={ elem }
      className='form-control'
      { ...pprops }
      id={ ready() ? uid : C.UNDEFINED }
      maxLength={ props?.maxLength }
      type={ pprops?.type }
      inputMode={ pprops.inputMode }
      pattern={ pprops.pattern }
      onChange={ onChange }
      onKeyUp={ onKeyUp }
      onBlur={ onBlur }
      onFocus={ onFocus }
      onKeyDown={ onKeyDown }
      />
    {/* <label htmlFor={ uid }></label> */}
  </div>
  </>
  )
})