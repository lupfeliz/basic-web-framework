import Head from 'next/head'
import { AnimatePresence } from 'framer-motion'
import LayoutDefault from '@/components/layout'
import app from '@/libs/app-context'
/** 전역 스타일시트 */
import '@/assets/styles/global.scss'
const { useSetup, definePage } = app
export default definePage((props) => {
  const { Component, pageProps, router } = props
  useSetup({
    name: '_app',
    async mounted() {
      /** APP 최초구동을 수행한다 */
      app.ready(props)
    }
  })
  /** 페이지 선언시 다른 layout 속성이 발견되면 해당 레이아웃으로 전환한다 */
  const applyLayout = Component.layout || ((page, router) => (
    <LayoutDefault key={ router.route }> { page } </LayoutDefault>
  ))
  return (
    <>
    <Head>
      {/* meta head 선언은 _app 에서 선언한다, script 등 리소스성 head 선언은 _document.jsx 에서 선언 */}
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    </Head>
    {/* 트랜지션감지 */}
    <AnimatePresence mode='wait' initial={ false }>
      {/* 실제 경로에 맞는 페이지 컴포넌트 */}
      { applyLayout(<Component {...pageProps} />, router) }
    </AnimatePresence>
    </>
  )
})