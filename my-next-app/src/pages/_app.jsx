/**
 * @File        : _app.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 공통 동적 프로세스 엔트리 페이지
 * @Site        : https://devlog.ntiple.com
 **/

/** POLYFILL 관련사항은 항상 _app 최상단에 위치해야 한다 */
import 'core-js'
import app from '@/libs/app-context'
import getConfig from 'next/config'
import Head from 'next/head'
import { AnimatePresence } from 'framer-motion'
import LayoutDefault from '@/components/layout'
import DialogContainer from '@/components/dialog-container'

// import 'bootstrap/dist/css/bootstrap.min.css'
import '@materialstyle/materialstyle/scss/materialstyle.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

/** 전역 스타일시트 */
import '@/pages/global.scss'
import '@/pages/util.scss'

const { useSetup, definePage, onload, log, isServer } = app
log.setLevel(getConfig()?.publicRuntimeConfig?.logLevel || 'debug')

export default definePage((props) => {
  const { Component, pageProps, router } = props
  /** APP 최초구동을 수행한다 */
  if (!isServer()) { onload(props) }
  useSetup({
    async mounted() {
      /** 웹컨테이너에서 SPA 페이지를 다이렉트로 접근할 때 URL 보정 */
      const base = String(router.basePath)
      const curl = String(history.state.url).substring(base.length)
      const hurl = String(history.state.as)
      log.debug('ON-LOAD-URL-CHECK1:', curl, hurl)
      if (curl === '/?' && hurl !== '/') { await router.push(hurl, hurl, {}) }
    }
  })
  /** 페이지 선언시 다른 layout 속성이 발견되면 해당 레이아웃으로 전환한다 */
  const applyLayout = Component.layout || ((page, router) => (
    <LayoutDefault key={ router.asPath }> { page } </LayoutDefault>
  ))
  return (
    <>
    <Head>
      {/* meta head 선언은 _app 에서 선언한다, script 등 리소스성 head 선언은 _document.jsx 에서 선언 */}
      <meta name='viewport' content='width=device-width, initial-scale=1.0, shrink-to-fit=no'/>
    </Head>
    {/* 트랜지션감지 */}
    <AnimatePresence mode='wait' initial={ false }>
      {/* 실제 경로에 맞는 페이지 컴포넌트 */}
      { applyLayout(<Component key={ router.asPath } { ...pageProps } />, router) }
    </AnimatePresence>
    <DialogContainer />
    </>
  )
})