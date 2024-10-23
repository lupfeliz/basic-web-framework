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

const LottiePropsSchema = {
  src: '',
  loop: true,
  autoplay: true,
  renderer: {} as any,
}

type LottieProps = ComponentPropsWithRef<'div'> & Record<string, any> & Partial<typeof LottiePropsSchema>
const COMPONENT = 'lottie'
const { defineComponent, useSetup, getLogger, copyExclude, copyRef, basepath, useRef, putAll } = app
const log = getLogger(COMPONENT)
export default defineComponent((props: LottieProps, ref: LottieProps['ref']) => {
  const pprops = copyExclude(props, [])
  const self = useSetup({
    name: COMPONENT,
    vars: {
      elem: useRef<HTMLDivElement>(),
      lottie: {} as any
    },
    async mounted() {
      let src = basepath(props?.src || '')
      log.debug('LOTTIE-PATH:', src, app.getConfig().app.basePath, ref, vars.elem)
      copyRef(ref, vars?.elem)
      const element: HTMLDivElement = vars?.elem?.current as any
      if (!element?.getAttribute('data-loaded')) {
        element?.setAttribute('data-loaded', 'true')
        vars.lottie = _Lottie.loadAnimation({
          container: element,
          path: src,
          loop: props?.loop,
          autoplay: props?.autoplay || true,
          renderer: props?.renderer,
        })
        log.debug('CHECK:', src, element?.getAttribute('data-loaded'), vars.lottie, ref)
        if ((ref as any)?.current) {
          putAll(ref, { lottie: vars.lottie, play })
        }
      }
    }
  })
  const { vars } = self()
  const play = (play: number) => {
    if (!vars?.lottie) { return }
    switch (play) {
      case 0: {
        vars.lottie.stop()
      } break
      case 1: {
        if (vars.lottie.isPaused) {
          vars.lottie.play()
        }
      } break
      case 2: {
        if (!vars.lottie.isPaused) {
          vars.lottie.pause()
        }
      } break
      case 3: {
        if (!vars.lottie.isPaused) {
          vars.lottie.pause()
        } else {
          vars.lottie.play()
        }
      }
    }
  }
  return (
    <div
      ref={ vars.elem as any }
      {...pprops}
      />
  )
})