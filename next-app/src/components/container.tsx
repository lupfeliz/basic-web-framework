/**
 * @File        : container.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 컨테이너 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
// import _Container, { ContainerProps as _ContainerProps } from '@mui/material/Container'
import { ComponentPropsWithRef } from 'react'
import app from '@/libs/app-context'
type ContainerProps = ComponentPropsWithRef<'div'> & { }
const { copyExclude, strm } = app
export default app.defineComponent((props: ContainerProps, ref: ContainerProps['ref']) => {
  const pprops = copyExclude(props, ['className'])
  return ( <div className={ strm(`${props?.className || ''} container`) } ref={ ref } { ...pprops }> { props.children } </div> )
})