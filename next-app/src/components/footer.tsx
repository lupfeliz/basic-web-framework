/**
 * @File        : footer.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 꼬리말 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import $ from 'jquery'
import lodash from 'lodash'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
import { Container } from '@/components'

const { defineComponent, useSetup, useRef, log } = app
const { debounce } = lodash
const evtlst = ['scroll', 'resize']
export default defineComponent(() => {
  const self = useSetup({
    name: 'footer',
    vars: {
      hndTouch: C.UNDEFINED,
      elem: useRef({} as HTMLDivElement),
      isScrolling: false,
      forceHide: false
    },
    async mounted({ releaser }) {
      evtlst.map(v => window.addEventListener(v, fncResize))
      fncResize()
      document.addEventListener('touchstart', fncHide)
      document.addEventListener('touchend', fncCancelHide)
      vars.elem?.current && vars.elem.current.addEventListener('touchstart', fncHide)
    },
    async unmount() {
      evtlst.map(v => window.removeEventListener(v, fncResize))
      document.removeEventListener('touchstart', fncHide)
      document.removeEventListener('touchend', fncCancelHide)
      vars.elem?.current && vars.elem.current.removeEventListener('touchstart', fncHide)
    }
  })
  const { vars, update } = self()
  const fncResizePost = debounce(() => {
    const scrollTop = $('html,body').scrollTop() || document.body.scrollTop
    /** footer sticky 기능을 위해 css 변수를 수정한다 */
    const footer = vars.elem?.current || {}
    {[
      '--screen-height', `${window.innerHeight || 0}px`,
      '--scroll-top', `${scrollTop}px`,
      '--footer-height', `${footer?.offsetHeight || 0}px`
    ].map((v, i, l) => (i % 2) &&
      footer?.style?.setProperty(l[i - 1], v))}
    if (!vars.isScrolling) {
      footer?.classList?.remove('hide')
    }
  }, 50)
  const fncHide = (e: any) => {
    if (e?.target === vars.elem?.current || vars.elem?.current?.contains(e?.target)) {
      log.debug('FNC-HIDE:', e)
    } else {
      vars.hndTouch = setTimeout(() => {
        vars.isScrolling = true 
        vars.elem?.current?.classList?.add('sticky', 'hide')
      }, 100)
    }
  }
  const fncCancelHide = () => {
    if (vars.hndTouch) { clearTimeout(vars.hndTouch) }
    vars.elem?.current?.classList?.remove('hide')
    vars.isScrolling = false
  }
  const fncResize = () => {
    let o = C.UNDEFINED
    vars.elem?.current?.classList?.add('sticky', 'hide')
    fncResizePost()
    if (!vars.forceHide && (o = document.getSelection()?.anchorNode)) {
      const inp: HTMLInputElement = o?.nodeName === 'INPUT' ? o : $(o).find('> input')[0] as any
      if (inp) {
        vars.forceHide = true
        update(C.UPDATE_SELF)
        const fncBlur = () => {
          log.debug('INPUT-BLUR:', inp)
          vars.forceHide = false
          inp.removeEventListener('blur', fncBlur)
          update(C.UPDATE_SELF)
        }
        inp.addEventListener('blur', fncBlur)
        log.debug('INPUT:', inp)
      }
    }
  }
  return (
    <>
    <footer
      ref={vars.elem}
      // className={`${vars?.forceHide ? 'hidden' : ''}`}
      style={{ display: vars.forceHide ? 'none' : 'block' }}
      >
      <Container>
        FOOTER
      </Container>
    </footer>
    </>
  )
})