/**
 * @File        : button.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 버튼 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import _Button, { ButtonProps as _ButtonProps } from '@mui/material/Button'
import * as C from '@/libs/constants'
import lodash from 'lodash'
import app from '@/libs/app-context'
import { cancelEvent } from '@/libs/evdev'

type ButtonProps = _ButtonProps & {
  href?: any
  param?: any
}

const { throttle } = lodash
const { defineComponent, copyExclude, goPage} = app

export default defineComponent((props: ButtonProps, ref: ButtonProps['ref']) => {
  const pprops = copyExclude(props, [])
  const onClick = throttle(async (e: any) => {
    /** 버튼이지만 href 속성이 있다면 a 태그처럼 작동한다 */
    if (props.href !== C.UNDEFINED) {
      cancelEvent(e)
      goPage(props.href, props.param)
    }
    if (props?.onClick) { props.onClick(e as any) }
  }, 300)
  return (
    <_Button ref={ ref } onClick={ onClick } { ...pprops }>
      { props.children }
    </_Button>
  )
})