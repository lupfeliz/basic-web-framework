'use client'
import { ElementType, ComponentPropsWithRef, createElement, MouseEvent } from 'react'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
const { copyExclude, putAll, defineComponent } = app
type LinkProps = ComponentPropsWithRef<'a'> & {
  href?: any
  param?: any
}
export default defineComponent((props: LinkProps, ref: LinkProps['ref']) => {
  const pprops = copyExclude(props, [])
  const onClick = async (e: MouseEvent) => {
    if (props.href !== C.UNDEFINED) {
      e && e.preventDefault()
      e && e.stopPropagation()
      app.goPage(props.href, props.param)
    }
    if (props?.onClick instanceof Function) { props.onClick(e as any) }
  }
  return createElement('a', {
    ...pprops,
    ref: ref,
    onClick: onClick 
  })
})