import { ComponentPropsWithRef, createElement } from 'react'
import app from '@/libs/app-context'
const { log, defineComponent, copyExclude } = app
type ContentProps = ComponentPropsWithRef<'div'> & {
  tag?: string,
  content?: any,
  type?: string
}
export default defineComponent((props: ContentProps, ref: ContentProps['ref']) => {
  const tag = props.tag || 'div'
  const pprops = copyExclude(props, ['tag', 'content'])
  return createElement(tag, {
    ...pprops,
    ref: ref,
    dangerouslySetInnerHTML: {
      __html: ( props?.content || '' )
    }
  })
})