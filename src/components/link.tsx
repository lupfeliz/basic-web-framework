'use client'
import { ComponentPropsWithRef, createElement, MouseEvent } from 'react'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
type LinkProps = ComponentPropsWithRef<'a'> & {
  href?: any
  param?: any
}
export default app.defineComponent((props: LinkProps, ref: LinkProps['ref']) => {
  const pprops = app.copyExclude(props, ['param'])
  const onClick = async (e: MouseEvent) => {
    if (props.href !== C.UNDEFINED) {
      e && e.preventDefault()
      e && e.stopPropagation()
      app.goPage(props.href, props.param)
    }
    if (props?.onClick) { props.onClick(e as any) }
  }
  return createElement('a', { ref: ref, onClick: onClick, ...pprops })
})