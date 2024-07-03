'use client'
import _Checkbox, { CheckboxProps as _CheckboxProps } from '@mui/material/Checkbox'
import _Radio, { RadioProps as _RadioProps } from '@mui/material/Radio'
import { useRef, useState } from 'react'
import * as C from '@/libs/constants'
import app, { type ContextType } from '@/libs/app-context'

type CheckboxProps = _CheckboxProps & _RadioProps & {
  model?: any
  type?: 'checkbox' | 'radio'
}
type ItemType = {
  props: CheckboxProps
  elem: any
  checked: boolean
}

const { log, genId, copyExclude, copyRef, useUpdate, useLauncher, putAll, subscribe, defineComponent, modelValue } = app

const ctx: ContextType<ItemType> = { }
export default defineComponent((props: CheckboxProps, ref: CheckboxProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model'])
  const [id] = useState(genId())
  const elem: any = useRef()
  ctx[id] = putAll(ctx[id] || {}, { props, elem })
  useLauncher({
    async mounted() {
      copyRef(ref, elem)
      const { props, value } = modelValue(ctx[id])
      ctx[id].checked = props?.value == value
      subscribe((state: number, mode: number) => {
        if (mode && ctx[id]) {
          const { props, value } = modelValue(ctx[id])
          ctx[id].checked = props?.value == value
          update(app.state(1, 0))
        }
        update(state)
      })
      update(app.state(1))
    },
    async unmount() { delete ctx[id] }
  })
  const update = useUpdate()
  const onChange = async (e: any, v: any) => {
    const { props, setValue } = modelValue(ctx[id])
    setValue(v ? props?.value : '')
    update(app.state(1, 1))
  }
  return (
  <>
  { props.type === 'radio' ? (
    <_Radio
      ref={ elem }
      checked={ ctx[id]?.checked || false }
      onChange={ onChange }
      { ...pprops }
      />
    ) : (
    <_Checkbox
      ref={ elem }
      checked={ ctx[id]?.checked || false }
      onChange={ onChange }
      { ...pprops }
      />
    )
  }
  </>
  )
})