import _Container, { ContainerProps as _ContainerProps } from '@mui/material/Container'
import app from '@/libs/app-context'
type ContainerProps = _ContainerProps & { }
export default app.defineComponent((props: ContainerProps, ref: ContainerProps['ref']) => {
  return ( <_Container ref={ ref } { ...props }> { props.children } </_Container> )
})