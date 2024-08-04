'use client'
import _Select, { SelectProps as _SelectProps } from '@mui/material/Select'
import _MenuItem from '@mui/material/MenuItem'
import { useRef } from 'react'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'

type OptionType = {
  name?: string
  value?: any
  selected?: boolean
}
type InputProps = _SelectProps & {
  model?: any
  options?: OptionType[]
}

const { copyExclude, clear, copyRef, useSetup, defineComponent, modelValue } = app

export default defineComponent((props: InputProps, ref: InputProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'options', 'onEnter'])
  const elem: any = useRef()
  const self = useSetup({
    name: 'select',
    props: { props },
    vars: {
      index: 0,
      value: '',
      options: [] as OptionType[],
    },
    async mounted() {
      copyRef(ref, elem)
    }
  })
  const { vars, update } = self()

  if (props?.options && props?.options instanceof Array && vars?.options) {
    const options: any = vars.options
    clear(vars.options)
    const { value: mvalue } = modelValue(self())
    for (let inx = 0; inx < props.options.length; inx++) {
      const item: any = props.options[inx]
      let value = typeof item === C.STRING ? item : item?.value || ''
      let name = item?.name || value
      if (value == mvalue) {
        vars.index = inx
        vars.value = value
      }
      options.push({ name: name, value: value, selected: value == mvalue })
    }
    if (mvalue === undefined) { vars.index = 0 }
  }

  const onChange = async (e: any, v: any) => {
    const { setValue } = modelValue(self())
    let options: OptionType[] = vars.options as any
    const inx = v?.props?.value || 0
    setValue(options[inx].value, () => update(C.UPDATE_FULL))
    /** 변경시 데이터모델에 값전달 */
    if (props.onChange) { props.onChange(e as any, v) }
  }
  return (
  <_Select
    ref={ elem }
    onChange={ onChange }
    value={vars?.index || (vars?.options?.length > 0 ? 0 : '')}
    { ...pprops }
    >
    { vars?.options?.length > 0 && vars.options.map((itm, inx) => (
    <_MenuItem
      key={ inx }
      value={ inx }
      selected={ itm?.selected || false }
      >
      { `${itm?.name}` }
    </_MenuItem>
    ))}
  </_Select>
  )
})