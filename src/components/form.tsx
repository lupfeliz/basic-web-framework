import { ComponentPropsWithRef } from 'react'
import app from '@/libs/app-context'
type FormProps = ComponentPropsWithRef<'form'> & { }
export default app.defineComponent((props: FormProps, ref: FormProps['ref']) => {
  return ( <form ref={ ref } { ...props }> { props.children } </form> )
})