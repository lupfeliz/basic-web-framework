'use client'
import _Select, { SelectProps as _SelectProps } from '@mui/material/Select'
import _MenuItem from '@mui/material/MenuItem'
import { useRef, useState } from 'react'
import * as C from '@/libs/constants'
import app, { type ContextType } from '@/libs/app-context'

type OptionType = {
  name?: string
  value?: any
  selected?: boolean
}
type InputProps = _SelectProps & {
  model?: any
  options?: OptionType[]
}
type ItemType = {
  props: InputProps
  elem: any
  index?: number
  value?: string
  options?: OptionType[]
}

const { log, copyExclude, clear, genId, copyRef, useUpdate, useLauncher, putAll, subscribe, defineComponent, modelValue } = app

const ctx: ContextType<ItemType> = { }
export default defineComponent((props: InputProps, ref: InputProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'onEnter'])
  const [id] = useState(genId())
  const elem: any = useRef()
  ctx[id] = putAll(ctx[id] || { index: 0, options: [] }, { props, elem })

  if (props?.options && props?.options instanceof Array && ctx[id]?.options) {
    const options: any = ctx[id].options
    clear(ctx[id].options)
    const { value: mvalue } = modelValue(ctx[id])
    for (let inx = 0; inx < props.options.length; inx++) {
      const item: any = props.options[inx]
      let value = typeof item === C.STRING ? item : item?.value || ''
      let name = item?.name || value
      if (value == mvalue) {
        ctx[id].index = inx
        ctx[id].value = value
      }
      options.push({ name: name, value: value, selected: value == mvalue })
    }
    if (mvalue === undefined) { ctx[id].index = 0 }
  }

  useLauncher({
    async mounted() {
      copyRef(ref, elem)
      update(app.state(1))
    },
    async unmount() { delete ctx[id] }
  })
  const update = useUpdate()
  const onChange = async (e: any, v: any) => {
    if (ctx[id]?.options !== undefined) {
      const { setValue } = modelValue(ctx[id])
      let options: OptionType[] = ctx[id].options as any
      const inx = v?.props?.value || 0
      setValue(options[inx].value, () => update(app.state(1)))
      /** 변경시 데이터모델에 값전달 */
      if (props.onChange) { props.onChange(e as any, v) }
    }
  }
  return (
  <_Select
    ref={ elem }
    onChange={ onChange }
    value={ ctx[id]?.index || 0 }
    { ...pprops }
    >
    { ctx[id]?.options ? ctx[id]?.options?.map((itm, inx) => (
    <_MenuItem
      key={ inx }
      value={ inx }
      selected={ itm?.selected || false }
      >
      { `${itm?.name}` }
    </_MenuItem>
    )) : '' }
  </_Select>
  )
})