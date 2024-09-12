/**
 * @File        : spinner.tsx
 * @Author      : 정재백
 * @Since       : 2024-05-07
 * @Description : Spinner 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
'use client'
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress'
import values from '@/libs/values'
import app from '@/libs/app-context'
const { copyExclude } = values
type SpinnerProps = CircularProgressProps & {
  text?: string
}

const { defineComponent } = app
export default defineComponent((props: SpinnerProps, ref: SpinnerProps['ref'] & any) => {
  const pprops = copyExclude(props, ['text'])
  if (!pprops.text) { pprops.text = 'Loading...' }
  return (
    <CircularProgress
      ref={ref}
      {...pprops}
    />
  )
}, { displayName: 'spinner' })