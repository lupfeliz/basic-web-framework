/**
 * @File        : main.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 메인블럭
 * @Site        : https://devlog.ntiple.com
 **/
import { ComponentPropsWithRef } from 'react'
import app from '@/libs/app-context'
type MainProps = ComponentPropsWithRef<'main'> & { }
export default app.defineComponent((props: MainProps, ref: MainProps['ref']) => {
  return ( <main ref={ ref } { ...props }> { props.children } </main> )
})