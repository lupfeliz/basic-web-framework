/**
 * @File        : button.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 버튼 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
// import _Button, { ButtonProps as _ButtonProps } from '@mui/material/Button'
import { Button as _Button, ButtonProps as _ButtonProps } from 'react-bootstrap'
import * as C from '@/libs/constants'
import lodash from 'lodash'
import values from '@/libs/values'
import app from '@/libs/app-context'
import { cancelEvent } from '@/libs/evdev'

const ButtonPropsSchema = {
  onClick: (() => '') as (Function | undefined),
  href: C.UNDEFINED,
  param: C.UNDEFINED,
  size: '' as 'small' | 'large' | 'sm' | 'md' | 'lg',
  color: ''
}

type ButtonProps = Record<string, any> & Partial<typeof ButtonPropsSchema>

const { throttle } = lodash
const { merge } = values
const { defineComponent, copyExclude, goPage, strm } = app

export default defineComponent((props: ButtonProps, ref: ButtonProps['ref']) => {
  const pprops = copyExclude(props, merge(Object.keys(ButtonPropsSchema), []))
  const clssize = (props: ButtonProps) => {
    switch (props.size) {
    case 'small': case 'sm': return 'btn-sm'
    case 'large': case 'lg': return 'btn-lg'
    default: return 'btn-md'
    }
  }
  const clscolor = (props: ButtonProps) => {
    return `btn-${props.color}`
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
      ref={ ref }
      type='button'
      { ...pprops }
      className={ strm(`btn ${clssize(props)} ${clscolor(props)}`) }
      onClick={ onClick }
      >
      { props.children }
      <span className='ripple-surface'></span>
    </button>
  )
})