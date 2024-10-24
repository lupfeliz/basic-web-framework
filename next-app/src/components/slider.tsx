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
      // await sleep(100)
      // try {
      //   const $slider = $(vars.elem.current).find('.slider-track')
      //   const $thumbs = $slider.find('.slider-thumb')
      //   if ($thumbs.length > 1) {
      //     // $thumbs[0].setAttribute('z-index', '1')
      //     // $thumbs[1].setAttribute('z-index', '0')
      //     // const item = $thumbs[0]
      //     // $(item).remove()
      //     // $slider.append(item)
      //   }
      //   log.debug('SLIDER-THUMBS:', $thumbs)
      // } catch (e) {
      //   log.debug('E:', e)
      // }
    },
    async updated(mode: any) {
      log.trace('SLIDER-UPDATED', mode)
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

  const sortValues = debounce(() => {
    // for (let inx = 0; inx < vars.values.length - 1; inx++) {
    //   const v1 = vars.values[inx]
    //   const v2 = vars.values[inx + 1]
    //   if (v1 > v2) {
    //     swap(vars.values, inx, inx + 1)
    //     swap(vars.thumbs, inx, inx + 1)
    //   }
    // }
    // log.debug('SORT!!!', vars.values, vars.thumbs)
    // vars.values = app.clone(vars.values.sort())
    // log.debug('SORTED:', vars.values)
    // // update(C.UPDATE_FULL)
    // update(C.UPDATE_SELF)
  }, 300)

  const onChange = throttle(async (e: any) => {
    log.debug('SLIDER-CHANGE:', e)
    pushAll(clear(vars.values), e)
    if (props?.names && props?.model) {
      for (const inx in props.names) {
        const itm = props.names[inx]
        props.model[itm] = vars.values[inx]
      }
    }
    update(C.UPDATE_SELF)
    if (props?.onChange) { props.onChange(e) }
  }, 100)

  const onMouseUp = (e: any) => {
    log.trace('ONMOUSEUP')
    sortValues()
    if (props?.onMouseUp) { props.onMouseUp(e) }
  }
  const onKeyUp = (e: any) => {
    log.trace('ONKEYUP')
    sortValues()
    if (props?.onKeyUp) { props.onKeyUp(e) }
  }
  const onDragEnd = (e: any) => {
    log.trace('ONDRAGEND')
    sortValues()
    if (props?.onDragEnd) { props.onDragEnd(e) }
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
                colors: ['#ccc', '#548bf4', '#ccc'],
                min: vars.minv,
                max: vars.maxv,
              }),
            } }
            >
          </div>
        </div>
      ) }
      renderThumb={ ({ props, index }) => (
        <Fragment key={ index }>
        { vars.thumbs[index] && (
        <div
          { ...props }
          key={ index }
          tabIndex={ props.tabIndex }
          className={ strm(`slider-thumb`) }
          data-thumb-inx={ index }
          // aria-label={ index == 0 ? '최소값' : '최대값'  }
          >
          <div ref={ vars.thumbs[index] }>
            <span>{ vars.values[index] }</span>
          </div>
        </div>
        ) }
        </Fragment>
      ) }
      renderMark={ ({ props, index }) => (
        <Fragment key={ index }>
          { (index % 10 == 0) && (
          <div
            { ...props }
            key={ index }
            className={ strm(`slider-mark`) }
            >
            { index }
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