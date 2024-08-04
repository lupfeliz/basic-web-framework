'use client'
import _TextField, { TextFieldProps as _TextFieldProps } from '@mui/material/TextField'
import { useRef } from 'react'
import $ from 'jquery'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'

type InputProps = _TextFieldProps & {
  model?: any
  onEnter?: Function
}

const { copyExclude, copyRef, useSetup, defineComponent, modelValue } = app
export default defineComponent((props: InputProps, ref: InputProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'onEnter'])
  const elem: any = useRef()
  const self = useSetup({
    name: 'input',
    props: { props },
    vars: { },
    async mounted() {
      copyRef(ref, elem)
      $(elem?.current).find('input').val(modelValue(self())?.value || '')
    },
    async updated(mode) {
      if (mode && vars) {
        $(elem?.current).find('input').val(modelValue(self())?.value || '')
      }
    }
  })
  const { vars, update } = self()
  const onChange = async (e: any) => {
    const { setValue } = modelValue(self())
    const v = $(elem?.current).find('input').val()
    /** 변경시 데이터모델에 값전달 */
    setValue(v, () => update(C.UPDATE_FULL))
    if (props.onChange) { props.onChange(e as any) }
  }
  const onKeyDown = async (e: any) => {
    const keycode = e?.keyCode || 0
    switch (keycode) {
    case 13: {
      if (props.onEnter) { props.onEnter(e) }
    } break
    }
  }
  return (
  <_TextField ref={ elem }
    onChange={ onChange }
    onKeyDown={ onKeyDown }
    { ...pprops }
    />
  )
})