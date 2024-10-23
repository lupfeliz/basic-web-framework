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

const { throttle } = lodash

const efnc1 = (() => '') as Function1<any, any>

const SlidePropsSchema = {
  model: {} as any,
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
const { getLogger, defineComponent, copyExclude, useSetup, useRef, copyRef, modelValue, merge, putAll } = app
const log = getLogger(COMPONENT)

export default defineComponent((props: SliderProps, ref: SliderProps['ref']) => {
  const pprops = copyExclude(props, merge(Object.keys(SlidePropsSchema), ['min', 'max']))
  const self = useSetup({
    name: COMPONENT,
    props,
    vars: {
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
      registForm(self, () => vars?.elem)
      if (props?.ranges) {
        let minv = C.UNDEFINED as number
        let maxv = C.UNDEFINED as number
        for (const itm of props.ranges || []) {
          if (minv === C.UNDEFINED || minv > itm) { minv = itm }
          if (maxv === C.UNDEFINED || maxv < itm) { maxv = itm }
        }
        putAll(vars, {
          minv, maxv
        })
      }
    },
    async updated(mode: any) {
      if (mode && vars) {
      }
    }
  })
  const { uid, vars, update, ready } = self()
  const inputVal = (v: any = C.UNDEFINED) => v === C.UNDEFINED ? $(vars?.elem?.current).val() : $(vars?.elem?.current).val(v) && v
  const onChange = async (e: ChangeEvent) => {
    log.debug('E:', vars?.elem?.current?.value )
  }
  return (
    <>
    <div>
      {/* <input
        ref={ vars.elem }
        type='range'
        className='form-range'
        min={ vars?.minv || undefined }
        max={ vars?.maxv || undefined }
        onChange={ onChange }
        { ...pprops }
        /> */}
    </div>
    </>
  )
})