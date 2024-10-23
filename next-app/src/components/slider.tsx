/**
 * @File        : slider.tsx
 * @Author      : 정재백
 * @Since       : 2024-10-23
 * @Description : 범위선택용 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { ChangeEvent, ComponentPropsWithRef, createElement, Fragment, MouseEvent } from 'react'
import lodash, { type Function1 } from 'lodash'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
import { registForm, type ValidationType } from '@/components/form'
import { cancelEvent } from '@/libs/evdev'
import { Range } from "react-range";
import $ from 'jquery'

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
const { getLogger, defineComponent, copyExclude, useSetup, useRef, copyRef, modelValue, merge, putAll, strm, clear, pushAll, ready, sleep } = app
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
      thumbs: [] as any,
      valid: {
        error: false,
        isValidated: false,
        isValid: C.UNDEFINED,
        message: C.UNDEFINED,
      } as ValidationType
    },
    async mounted() {
      copyRef(ref, vars?.elem)
      for (const inx in props.names) {
        const gen = (inx: any) => () => {
          const ret = putAll({}, self())
          const props = putAll({}, ret.props)
          props.name = props.names[inx]
          ret.props = props
          return ret
        }
        const getThumbs = (inx: any) => () => ({
          current: vars?.thumbs[inx]?.current?.parentNode
        })
        registForm(gen(inx), getThumbs(inx))
      }
      /** 슬라이더 초기화 이후 움직이지 않는 현상 버그픽스용 */
      for (const inx in vars.values) { vars.values[inx] = vars.values[inx] }
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
      clear(vars.values)
      for (const inx in props.names) {
        vars.thumbs[inx] = useRef()
        const itm = props.names[inx]
        let v = props.model[itm]
        if (!v || v < vars.minv) { v = vars.minv }
        if (v && v > vars.maxv) { v = vars.maxv }
        vars.values.push(props.model[itm] = v)
      }
    }
  }
  const onChange = async (e: any) => {
    pushAll(clear(vars.values), e)
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
  { ready() && (
  <div
    ref={ vars.elem }
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
        <Fragment key={ props.key }>
        { vars.thumbs[props.key] && (
        <div
          { ...props }
          key={ props.key }
          tabIndex={ - 1 }
          className={ strm(`slider-thumb`) }
          >
          <div ref={ vars.thumbs[props.key] }>
            <span>{ vars.values[props.key] }</span>
          </div>
        </div>
        ) }
        </Fragment>
      ) }
      />
  </div>
  ) }
  </>
  )
})