/**
 * @File        : input.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 입력 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import _TextField, { TextFieldProps as _TextFieldProps } from '@mui/material/TextField'
import $ from 'jquery'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
import { KEYCODES, isEvent, cancelEvent } from '@/libs/evdev'

type InputProps = _TextFieldProps & {
  model?: any
  onEnter?: Function
  maxLength?: number
  minLength?: number
  maxValue?: number
  minValue?: number
  type?: string
  pattern?: string
}

const { copyExclude, useRef, copyRef, useSetup, defineComponent, modelValue } = app
export default defineComponent((props: InputProps, ref: InputProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'onEnter', 'minLength', 'maxLength', 'minValue', 'maxValue', 'pattern'])
  const iprops = copyExclude(props?.slotProps?.htmlInput || {}, []) as any
  const elem: any = useRef()
  const self = useSetup({
    name: 'input',
    props,
    vars: {
      itype: props.type
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
  const { vars, update } = self()
  if (pprops?.type === 'number') { pprops.type = 'text' }

  const inputVal = (v: any = C.UNDEFINED) => v === C.UNDEFINED ? $(elem?.current).find('input').val() : $(elem?.current).find('input').val(v) && v

  /** 입력컴포넌트 변경이벤트 처리 */
  const onChange = async (e: any) => {
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
  const onKeyDown = async (e: any) => {
    const props = self().props
    const { setValue } = modelValue(self())
    if (props?.onKeyDown instanceof Function) { props.onKeyDown(e) }
    const kcode = Number(e?.keyCode || 0)

    /** 이벤트가 존재하면 */
    if (isEvent(e)) {
      /** 허용키 : ctrl+c ctrl+v 방향키 bs delete tab enter space */
      if (vars?.itype === 'number') {
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
          let v = Number(inputVal() || 0) - 1
          const minv = Number(props?.minValue)
          if (props?.minValue !== C.UNDEFINED && v < minv) { v = minv }
          setValue(inputVal(v))
          cancelEvent(e)
        } break
        case KEYCODES.DOWN: {
          let v = Number(inputVal() || 0) + 1
          const maxv = Number(props?.maxValue)
          if (props?.maxValue !== C.UNDEFINED && v > maxv) { v = maxv }
          setValue(inputVal(v))
          cancelEvent(e)
        } break
        default: {
          if (
            (kcode >= KEYCODES.KP0 && kcode <= KEYCODES.KP9) ||
            (kcode >= KEYCODES.NK0 && kcode <= KEYCODES.NK9) ) {
            /** NO-OP */
          } else if ((
            /** Ctrl+C, Ctrl+V 허용 */
            (kcode == KEYCODES['C'] || kcode == KEYCODES['V']) &&
            e.ctrlKey)) {
            /** NO-OP */
          } else {
            cancelEvent(e)
          }
        } }
      }
      if (e?.keyCode === KEYCODES.ENTER && props?.onEnter instanceof Function) { props.onEnter(e) }
    }
    // update(C.UPDATE_FULL)
  }
  return (
  <_TextField ref={ elem }
    onChange={ onChange }
    onKeyDown={ onKeyDown }
    hiddenLabel
    slotProps={{
      htmlInput: {
        maxLength: props?.maxLength || iprops?.maxLength,
        type: pprops?.type || iprops?.type,
        pattern: props?.pattern || iprops?.pattern
      }
    }}
    { ...pprops }
    />
  )
})