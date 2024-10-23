/**
 * @File        : lottie.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : Lottie 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { ComponentPropsWithRef } from 'react'
import _Lottie from 'lottie-web'
import app from '@/libs/app-context'
type LottieProps = ComponentPropsWithRef<'div'> & {
  src?: string,
  loop?: boolean
  autoplay?: boolean
  renderer?: any,
}
const COMPONENT = 'lottie'
const { defineComponent, useSetup, getLogger, copyExclude, copyRef, basepath, useRef } = app
const log = getLogger(COMPONENT)
export default defineComponent((props: LottieProps, ref: LottieProps['ref']) => {
  const pprops = copyExclude(props, [])
  const eref = useRef() as any
  useSetup({
    name: COMPONENT,
    async mounted() {
      let src = basepath(props?.src || '')
      log.debug('LOTTIE-PATH:', src, app.getConfig().app.basePath)
      const element = eref?.current
      copyRef(ref, eref)
      if (!element?.getAttribute('data-loaded')) {
        log.debug('CHECK:', src, element?.getAttribute('data-loaded'))
        element?.setAttribute('data-loaded', true)
        _Lottie.loadAnimation({
          container: element,
          path: src,
          loop: props?.loop,
          autoplay: props?.autoplay || true,
          renderer: props?.renderer,
        })
      }
    }
  })
  return (
    <div
      ref={ eref }
      {...pprops}
      />
  )
})