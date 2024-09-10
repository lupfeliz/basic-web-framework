/**
 * @File        : textarea.tsx
 * @Author      : 정재백
 * @Since       : 2024-09-10
 * @Description : textarea 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { ComponentPropsWithRef } from 'react'
import parse from 'html-react-parser'
import app from '@/libs/app-context'
type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  model?: any,
  text?: string
}
const { defineComponent, createElement } = app
export default defineComponent((props: TextareaProps, ref: TextareaProps['ref']) => {
  const content = parse(String(props.children || props?.text || ''))
  return (<textarea defaultValue={content as any} ></textarea>)
  // return createElement('textarea', {
  //   ...props, ref: ref,
  //   dangerouslySetInnerHTML: { __html: (content as any) }
  // })
})