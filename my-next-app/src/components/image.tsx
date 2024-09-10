/**
 * @File        : image.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : Image 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
/* eslint-disable @next/next/no-img-element */
import { ComponentPropsWithRef } from 'react'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
type ImageProps = ComponentPropsWithRef<'img'> & { }
const { defineComponent, useSetup, copyExclude, copyRef, basepath, useRef } = app
export default defineComponent((props: ImageProps, ref: any) => {
  const pprops = copyExclude(props, ['src', 'alt'])
  const eref = useRef() as any
  const self = useSetup({
    name: 'image',
    vars: { src: C.UNDEFINED },
    async mounted() {
      copyRef(ref, eref)
      update(C.UPDATE_SELF)
    },
    async updated() { vars.src = basepath(String(props?.src || '')) }
  })
  const { vars, update } = self()
  return (
    <img
      src={ vars.src }
      alt={ props.alt }
      ref={ eref }
      { ...pprops }
      />
  )
})