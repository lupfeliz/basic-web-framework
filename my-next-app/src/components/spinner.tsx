/**
 * @File        : spinner.tsx
 * @Author      : 정재백
 * @Since       : 2024-05-07
 * @Description : Spinner 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
'use client'
import _Spinner, { SpinnerProps as _SpinnerProps } from 'react-bootstrap/Spinner';
import values from '@/libs/values'
import app from '@/libs/app-context'
const { copyExclude } = values
type SpinnerProps = _SpinnerProps & Record<string, any> & {
  text?: string
}

const { defineComponent } = app
export default defineComponent((props: SpinnerProps, ref: SpinnerProps['ref'] & any) => {
  const pprops = copyExclude(props, ['text'])
  if (!pprops.text) { pprops.text = 'Loading...' }
  return (
    <_Spinner
      ref={ref}
      {...pprops}
    />
  )
}, { displayName: 'spinner' })