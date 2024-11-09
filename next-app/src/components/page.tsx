/**
 * @File        : main.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 페이지블럭
 * @Site        : https://devlog.ntiple.com
 **/
import { ComponentPropsWithRef } from 'react'
import app from '@/libs/app-context'
type PageProps = ComponentPropsWithRef<'div'> & { }
const { copyExclude, strm } = app
export default app.defineComponent((props: PageProps, ref: PageProps['ref']) => {
  const pprops = copyExclude(props, ['className'])
  return ( <div suppressHydrationWarning className={ strm(`${props?.className || ''} container`) } ref={ ref } { ...pprops }> { props.children } </div> )
})