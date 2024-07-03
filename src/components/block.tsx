import { ElementType, ComponentPropsWithRef, forwardRef } from 'react'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'

type BlockProps = ComponentPropsWithRef<'div'> & {
}

const { defineComponent } = app

export default defineComponent((props: BlockProps, ref: BlockProps['ref']) => {
  return (
  <div
    ref={ ref }
    { ...props }
    >
    { props.children }
  </div>
  )
})