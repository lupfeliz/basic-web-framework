/**
 * @File        : popper.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : popper
 * @Site        : https://devlog.ntiple.com
 **/
import _Popper, { PopperProps as _PopperProps } from '@mui/material/Popper'
import app from '@/libs/app-context'
type PopperProps = _PopperProps & {
}
const { defineComponent, copyExclude } = app
export default defineComponent((props: PopperProps, ref: PopperProps['ref']) => {
  const pprops = copyExclude(props, [])
  return (
    <_Popper
      ref={ ref }
      { ...pprops }
      >
    </_Popper>
  )
}, { displayName: 'popper' })