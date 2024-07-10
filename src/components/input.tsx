'use client'
import _TextField, { TextFieldProps as _TextFieldProps } from '@mui/material/TextField'
import { useRef, useState } from 'react'
import $ from 'jquery'
import app, { type ContextType } from '@/libs/app-context'

type InputProps = _TextFieldProps & {
  model?: any
  onEnter?: Function
}
type ItemType = {
  props: InputProps
  elem: any
}

const { copyExclude, genId, copyRef, useUpdate, useLauncher, putAll, subscribe, defineComponent, modelValue } = app
const ctx: ContextType<ItemType> = { }
export default defineComponent((props: InputProps, ref: InputProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'onEnter'])
  const [id] = useState(genId())
  const elem: any = useRef()
  ctx[id] = putAll(ctx[id] || {}, { props, elem })
  useLauncher({
    async mounted() {
      copyRef(ref, elem)
      $(elem?.current).find('input').val(modelValue(ctx[id])?.value || '')
      subscribe((state: number, mode: number) => {
        if (mode && ctx[id]) {
          $(elem?.current).find('input').val(modelValue(ctx[id])?.value || '')
          update(app.state(1, 0))
        }
        update(state)
      })
      update(app.state(1))
    },
    async unmount() { delete ctx[id] }
  })
  const update = useUpdate()
  const onChange = async (e: any) => {
    const { setValue } = modelValue(ctx[id])
    const v = $(elem?.current).find('input').val()
    /** 변경시 데이터모델에 값전달 */
    setValue(v, () => update(app.state(1)))
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