import _Button, { ButtonProps as _ButtonProps } from '@mui/material/Button'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import { MouseEvent } from 'react'

type ButtonProps = _ButtonProps & {
  href?: any
  param?: any
}

const { defineComponent } = app

export default defineComponent((props: ButtonProps, ref: ButtonProps['ref']) => {
  const onClick = async (e: MouseEvent) => {
    if (props.href !== C.UNDEFINED) {
      e && e.preventDefault()
      e && e.stopPropagation()
      app.goPage(props.href, props.param)
    }
    if (props?.onClick instanceof Function) { props.onClick(e as any) }
  }
  return (
    <>
    <_Button
      ref={ ref }
      onClick={ onClick }
      { ...props }
      >
      { props.children }
    </_Button>
    </>
  )
})