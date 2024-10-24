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
import format from '@/libs/format'
import { registForm, type ValidationType } from '@/components/form'
import { cancelEvent } from '@/libs/evdev'
import { Range, getTrackBackground, Direction } from "react-range";
import $ from 'jquery'

const { throttle, debounce } = lodash

const efnc1 = (() => '') as Function1<any, any>

const SlidePropsSchema = {
  model: {} as any,
  names: [] as string[],
  label: '',
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
const { getLogger, defineComponent, copyExclude, useSetup, useRef, copyRef, modelValue, merge, putAll, strm, clear, pushAll, ready, sleep, swap } = app
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
      } as ValidationType,
      event: {
        start: efnc1,
        end: efnc1,
        move: efnc1
      }
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
      log.trace('SLIDER-UPDATED', mode)
      if (mode && vars) {
      }
    }
  })
  const { uid, vars, update, ready } = self()
  const updateModelValue = () => {
    if (props?.names && props?.model) {
      for (const inx in props.names) {
        const itm = props.names[inx]
        props.model[itm] = vars.values[inx]
      }
    }
  }
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

  const onChange = throttle(async (e: any) => {
    log.trace('SLIDER-CHANGE:', e)
    pushAll(clear(vars.values), e)
    updateModelValue()
    update(C.UPDATE_SELF)
    if (props?.onChange) { props.onChange(e) }
  }, 100)

  const onMouseUp = (e: any) => {
    if (props?.onMouseUp) { props.onMouseUp(e) }
  }
  const onKeyUp = (e: any) => {
    if (props?.onKeyUp) { props.onKeyUp(e) }
  }
  const onDragEnd = (e: any) => {
    if (props?.onDragEnd) { props.onDragEnd(e) }
  }
  const onFocus = (e: any) => {
    log.debug('E:', e.target)
    const $el = $(e.target)
    const finx = Number(format.numberOnly($el.attr('data-thumb-inx') || '0'))
    vars.event.start = (e: any) => {
      // document.addEventListener('mousemove', vars.event.move)
      // document.addEventListener('touchmove', vars.event.move)
      // document.addEventListener('drag', vars.event.move)
      // cancelEvent(e)
    }
    vars.event.end = (e: any) => {
      log.debug('MOUSE-EVENT-FINISHED!!')
      // document.removeEventListener('mousedown', vars.event.start)
      // document.removeEventListener('mouseup', vars.event.end)
      // document.removeEventListener('mousemove', vars.event.move)
      // document.removeEventListener('touchstart', vars.event.start)
      // document.removeEventListener('touchend', vars.event.end)
      // document.removeEventListener('touchmove', vars.event.move)
      // document.removeEventListener('dragstart', vars.event.start)
      // document.removeEventListener('dragend', vars.event.end)
      // document.removeEventListener('drag', vars.event.move)
      // vars.event.start = efnc1
      // vars.event.move = efnc1
      // vars.event.end = efnc1
      // cancelEvent(e)
    }
    vars.event.move = (e: any) => {
      // log.debug('E:', (e?.touches || [])[0]?.radiusX)
      // const movement = Number(e.movementX + e.movementY) >> 1
      // // log.debug('E1:', movement, vars.values)
      // vars.values[finx] += movement
      // updateModelValue()
      // update(C.UPDATE_SELF)
      // cancelEvent(e)
    }
    // document.addEventListener('mousedown', vars.event.start)
    // document.addEventListener('mouseup', vars.event.end)
    // document.addEventListener('touchstart', vars.event.start)
    // document.addEventListener('touchend', vars.event.end)
    // document.addEventListener('dragstart', vars.event.start)
    // document.addEventListener('dragend', vars.event.end)
  }

  const onBlur = (e: any) => {
    // window.removeEventListener('mousedown', vars.event.start)
    // window.removeEventListener('mouseup', vars.event.end)
    // window.removeEventListener('mousemove', vars.event.move)
    // vars.event.start = efnc1
    // vars.event.move = efnc1
    // vars.event.end = efnc1
  }

  const addValues = (e: any, inx: number, val: number) => {
    cancelEvent(e)
    vars.values[inx] += val
    updateModelValue()
    update(C.UPDATE_SELF)
    setTimeout(() => e.target.focus(), 100)
  }
  return (
  <>
  { ready() && (
  <div
    { ...pprops }
    ref={ vars.elem }
    className={ strm(`slider`) }
    onMouseUp={ onMouseUp }
    onKeyUp={ onKeyUp }
    onDragEnd={ onDragEnd }
    >
    <Range
      label={ props.label }
      // step={0.1}
      min={ vars.minv }
      max={ vars.maxv }
      values={ vars.values }
      direction={ Direction.Right }
      allowOverlap={ true }
      // draggableTrack={ true }
      onChange={ onChange as any }
      renderTrack={ ({ props, children }) => (
        <div
          {...props}
          onMouseDown={ props.onMouseDown }
          onTouchStart={ props.onTouchStart }
          className={ strm(`slider-track`) }
          >
          { children }
          <div
            className={ strm(`slider-inter-thumb`) }
            style={ {
              background: getTrackBackground({
                values: vars.values,
                colors: ['var(--bs-border-color)', 'var(--bs-primary)', 'var(--bs-border-color)'],
                min: vars.minv,
                max: vars.maxv,
              }),
            } }
            >
          </div>
        </div>
      ) }
      /** FIXME: (a11y) 차라리 키보드 수동입력으로 전환하는 기능이 있어야 할 듯 */
      renderThumb={ ({ props, index }) => (
        <Fragment key={ props.key }>
        <a
          className='hiddenbtn'
          aria-label={ `${index == 0 ? '하한' : '상한' }값 감소 현재 ${vars.values[index]}` }
          tabIndex={ props.tabIndex }
          onClick={ (e) => addValues(e, index, -1) }
          role='button'
          >
        </a>
        { vars.thumbs[index] && (
          <div
            { ...props }
            key={ props.key }
            className={ strm(`slider-thumb`) }
            data-thumb-inx={ index }
            tabIndex={ 999999999 }
            // onFocus={ onFocus }
            // onBlur={ onBlur }
            // aria-hidden={ true }
            aria-label={ `${index == 0 ? '하한' : '상한' }값 ${vars.values[index]}` }
            >
            <div ref={ vars.thumbs[index] }>
              <span>
                { vars.values[index] }
              </span>
            </div>
          </div>
        ) }
        <a
          className='hiddenbtn'
          aria-label={ `${index == 0 ? '하한' : '상한' }값 증가 현재 ${vars.values[index]}` }
          tabIndex={ props.tabIndex }
          onClick={ (e) => addValues(e, index, 1) }
          role='button'
          >
        </a>
        </Fragment>
      ) }
      // renderMark={ ({ props, index }) => (
      //   <Fragment key={ props.key }>
      //     { (index % Math.round((vars.maxv - vars.minv) / 10) == 0) && (
      //     <div
      //       { ...props }
      //       key={ props.key }
      //       className={ strm(`slider-mark`) }
      //       role='text'
      //       >
      //       { format.numeric(index) }
      //     </div>
      //     ) }
      //   </Fragment>
      // ) }
      />
  </div>
  ) }
  </>
  )
})