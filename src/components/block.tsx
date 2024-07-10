import { ComponentPropsWithRef } from 'react'
import app from '@/libs/app-context'
type BlockProps = ComponentPropsWithRef<'div'> & { }
export default app.defineComponent((props: BlockProps, ref: BlockProps['ref']) => {
  return ( <div ref={ ref } { ...props }> { props.children } </div> )
})