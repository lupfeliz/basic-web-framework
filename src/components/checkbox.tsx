'use client'
import _Checkbox, { CheckboxProps as _CheckboxProps } from '@mui/material/Checkbox'
import _Radio, { RadioProps as _RadioProps } from '@mui/material/Radio'
import { useRef } from 'react'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'

type CheckboxProps = _CheckboxProps & _RadioProps & {
  model?: any
  type?: 'checkbox' | 'radio'
}

const { log, copyExclude, copyRef, useSetup, defineComponent, modelValue } = app

export default defineComponent((props: CheckboxProps, ref: CheckboxProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model'])
  const elem: any = useRef()
  const self = useSetup({
    name: 'checkbox',
    props,
    vars: {
      checked: false,
    },
    async mounted() {
      copyRef(ref, elem)
      const { props, value } = modelValue(self())
      vars.checked = props?.value == value
      log.debug('SEND FROM CHECKBOX..')
    },
    async updated() {
      const { props, value } = modelValue(self())
      vars.checked = props?.value == value
    }
  })
  const { vars, update } = self()
  const onChange = async (e: any, v: any) => {
    const { props, setValue } = modelValue(self())
    setValue(v ? props?.value : '')
    vars.checked = v
    update(C.UPDATE_FULL)
  }
  return (
  <>
  { props.type === 'radio' ? (
    <_Radio ref={ elem } checked={ vars.checked || false } onChange={ onChange } { ...pprops } />
  ) : (
    <_Checkbox ref={ elem } checked={ vars.checked || false } onChange={ onChange } { ...pprops } />
  ) }
  </>
  )
})