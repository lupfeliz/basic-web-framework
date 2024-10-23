/**
 * @File        : slider.tsx
 * @Author      : 정재백
 * @Since       : 2024-10-23
 * @Description : 범위선택용 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { ChangeEvent, ComponentPropsWithRef, createElement, MouseEvent } from 'react'
import lodash, { type Function1 } from 'lodash'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
import { registForm, type ValidationType } from '@/components/form'
import { cancelEvent } from '@/libs/evdev'
import { Range } from "react-range";

const { throttle } = lodash

const efnc1 = (() => '') as Function1<any, any>

const SlidePropsSchema = {
  model: {} as any,
  names: [] as string[],
  onEnter: efnc1,
  onChange: efnc1,
  onKeyDown: efnc1,
  onKeyUp: efnc1,
  onMouseUp: efnc1,
  onFocus: efnc1,
  onBlur: efnc1,
  onError: efnc1 as Function1<{ message: string, element: any}, any>,
  ranges: [] as any[],
  vrules: '' as string,
  validctx: {} as any,
  snap: false,
}

type SliderProps = ComponentPropsWithRef<'input'> & Record<string, any> & Partial<typeof SlidePropsSchema>

const COMPONENT = 'slider'
const { getLogger, defineComponent, copyExclude, useSetup, useRef, copyRef, modelValue, merge, putAll, strm } = app
const log = getLogger(COMPONENT)

export default defineComponent((props: SliderProps, ref: SliderProps['ref']) => {
  const pprops = copyExclude(props, merge(Object.keys(SlidePropsSchema), ['min', 'max']))
  const self = useSetup({
    name: COMPONENT,
    props,
    vars: {
      values: [] as any[],
      minv: C.UNDEFINED as number,
      maxv: C.UNDEFINED as number,
      elem: useRef<any>(),
      valid: {
        error: false,
        isValidated: false,
        isValid: C.UNDEFINED,
        message: C.UNDEFINED,
      } as ValidationType
    },
    async mounted() {
      copyRef(ref, vars?.elem)
      // log.debug('INPUT MOUNTED')
      // registForm(self, () => vars?.elem)
      update(C.UPDATE_SELF)
    },
    async updated(mode: any) {
      if (mode && vars) {
      }
    }
  })
  const { uid, vars, update, ready } = self()
  {
    if (props?.ranges) {
      let minv = C.UNDEFINED as number
      let maxv = C.UNDEFINED as number
      for (const itm of props.ranges || []) {
        if (minv === C.UNDEFINED || minv > itm) { minv = itm }
        if (maxv === C.UNDEFINED || maxv < itm) { maxv = itm }
      }
      putAll(vars, { minv, maxv })
    }

    if (props?.names && props?.model) {
      vars.values = []
      for (const inx in props.names) {
        const itm = props.names[inx]
        vars.values.push(props.model[itm] || vars.minv)
      }
    }
  }
  const inputVal = (v: any = C.UNDEFINED) => v === C.UNDEFINED ? $(vars?.elem?.current).val() : $(vars?.elem?.current).val(v) && v
  const onChange = async (e: any) => {
    vars.values = e
    if (props?.names && props?.model) {
      for (const inx in props.names) {
        const itm = props.names[inx]
        props.model[itm] = vars.values[inx]
      }
    }
    update(C.UPDATE_SELF)
  }
  return (
  <>
  <div
    className={ strm(`slider`) }
    >
    <Range
      label='Select your value'
      // step={0.1}
      min={ vars.minv }
      max={ vars.maxv }
      values={ vars.values }
      onChange={ onChange as any }
      renderTrack={ ({ props, children }) => (
        <div
          {...props}
          className={ strm(`slider-track`) }
          >
          {children}
        </div>
      ) }
      renderThumb={ ({ props }) => (
        <div
          { ...props }
          key={ props.key }
          className={ strm(`slider-thumb`) }
          >
          <div>
            <span>{ vars.values[props.key] }</span>
          </div>
        </div>
      ) }
      />
  </div>
  </>
  )
})