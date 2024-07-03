import { ComponentPropsWithRef, createElement } from 'react'
import app from '@/libs/app-context'
const { defineComponent } = app
type ContentProps = ComponentPropsWithRef<'div'> & {
  tag?: string,
  content?: any,
  type?: string
}
export default defineComponent((props: ContentProps, ref: ContentProps['ref']) => {
  const tag = props.tag || 'div'
  return createElement(tag, {
    ...props,
    ref: ref,
    dangerouslySetInnerHTML: {
      __html: ( props?.content || '' )
    }
  })
})