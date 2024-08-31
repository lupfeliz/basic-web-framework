import { useRef } from 'react'
import $ from 'jquery'
import lodash from 'lodash'
import app from '@/libs/app-context'
import { Container } from '@/components'
const { defineComponent, useSetup } = app
const { debounce } = lodash

export default defineComponent(() => {
  const eref = useRef({} as HTMLDivElement)
  useSetup({
    async mounted() {
      window.addEventListener('scroll', fncResize)
      window.addEventListener('resize', fncResize)
      fncResize()
    },
    async unmount() {
      window.removeEventListener('scroll', fncResize)
      window.removeEventListener('resize', fncResize)
    }
  })
  const fncResizePost = debounce(() => {
    const page = $('html,body')
    const footer = eref.current || {}
    {[
      '--screen-height', `${window.innerHeight || 0}px`,
      '--scroll-top', `${page.scrollTop()}px`,
      '--footer-height', `${footer?.offsetHeight || 0}px`
    ].map((v, i, l) => (i % 2) &&
      footer?.style?.setProperty(l[i - 1], v))}
    footer?.classList?.remove('hide')
  }, 10)
  const fncResize = () => {
    eref?.current?.classList?.add('sticky', 'hide')
    fncResizePost()
  }
  return (
    <footer ref={ eref }>
    <Container>
      FOOTER
    </Container>
    </footer>
  )
})