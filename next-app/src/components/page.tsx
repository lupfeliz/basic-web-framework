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
export default app.defineComponent((props: PageProps, ref: PageProps['ref']) => {
  return ( <div ref={ ref } { ...props }> { props.children } </div> )
})