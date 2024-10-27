/**
 * @File        : button.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 버튼 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { Button as _Button, type ButtonProps as _ButtonProps } from 'react-bootstrap'
// import { ButtonVariant, Variant, AlignDirection } from 'react-bootstrap/types'

import * as C from '@/libs/constants'
import lodash from 'lodash'
import app from '@/libs/app-context'
import { cancelEvent } from '@/libs/evdev'

/** react-bootstrap/types 에서 코드이식 */
export type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | (string & {})
export type ButtonVariant = Variant | 'link' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-dark' | 'outline-light'

const ButtonPropsSchema = {
  onClick: C.EMPTY_FUNC1,
  href: C.UNDEFINED,
  param: C.UNDEFINED,
  size: '' as 'small' | 'large' | 'sm' | 'md' | 'lg',
  variant: '' as ButtonVariant
}

type ButtonProps = Partial<typeof ButtonPropsSchema> & Record<string, any> & {
}

const COMPONENT = 'button'
const { throttle } = lodash
const { copyExclude, copyRef, defineComponent, getLogger, goPage, mergeAll, strm, useRef, useSetup } = app
const log = getLogger(COMPONENT)

export default defineComponent((props: ButtonProps, ref: ButtonProps['ref']) => {
  const pprops = copyExclude(props, mergeAll(Object.keys(ButtonPropsSchema), []))
  const self = useSetup({
    name: COMPONENT,
    vars: { elem: useRef<any>() },
    async mounted() { copyRef(ref, vars.elem) }
  })
  const { vars } = self()
  const getClasses = (props: ButtonProps) => {
    let ret = ''
    if (props.className) { ret = `${ret} ${props.className}` }
    if (props.size) {
      switch (String(props.size)) {
      case 'small': case 'sm': { ret = `${ret} btn-sm` } break
      case 'large': case 'lg': { ret = `${ret} btn-lg` } break
      default: ret = `${ret} btn-md`
      }
    }
    if (props.variant) { ret = `${ret} btn-${props.variant}` }
    return ret
  }
  const onClick = throttle(async (e: any) => {
    /** 버튼이지만 href 속성이 있다면 a 태그처럼 작동한다 */
    if (props.href !== C.UNDEFINED) {
      cancelEvent(e)
      goPage(props.href, props.param)
    }
    if (props?.onClick) { props.onClick(e as any) }
  }, 300)
  return (
    <button
      ref={ vars?.elem }
      type='button'
      { ...pprops }
      className={ strm(`btn ${getClasses(props)}`) }
      onClick={ onClick }
      role='button'
      tabIndex={ props.tabIndex !== undefined ? props.tabIndex : 0 }
      >
      { props.children }
      <span className='ripple-surface'></span>
    </button>
  )
})