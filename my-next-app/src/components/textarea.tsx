/**
 * @File        : textarea.tsx
 * @Author      : 정재백
 * @Since       : 2024-09-10
 * @Description : textarea 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { ComponentPropsWithRef } from 'react'
import parse from 'html-react-parser'
import $ from 'jquery'
import lodash from 'lodash'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'
type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  model?: any,
  text?: string
}
const { debounce } = lodash
const { defineComponent, copyExclude, useSetup, modelValue, copyRef, log, useRef } = app
export default defineComponent((props: TextareaProps, ref: TextareaProps['ref']) => {
  const pprops = copyExclude(props, ['model', 'text'])
  const self = useSetup({
    name: 'textarea',
    props,
    vars: {
      value: '',
      elem: useRef<HTMLTextAreaElement>(C.UNDEFINED),
    },
    async mounted() {
      copyRef(ref, vars.elem)
      inputVal(modelValue(self())?.value || '')
      // log.debug('CHECK-TEXTAREA-PROPS:', props.name, props.model[props.name || ''] || '', vars.elem?.current)

    },
    async updated(mode) {
      if (mode) {
        log.debug('TEXTARE-UPDATE:', mode, modelValue(self()))
        inputVal(modelValue(self())?.value || '')
      }
    }
  })
  const { vars, update, ready } = self()

  const inputVal = (v: any = C.UNDEFINED) => v === C.UNDEFINED ? $(vars.elem?.current).val() : $(vars.elem?.current).val(v)

  const onChange = debounce((e: any) => {
    const { setValue } = modelValue(self())
    setValue(inputVal(), () => update(C.UPDATE_FULL))
    if (props.onChange) { props.onChange(e as any) }
  }, 300)

  return (
  <textarea
    ref={ vars.elem }
    onChange={ onChange }
    { ...pprops }
    />
  )
})