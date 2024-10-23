/**
 * @File        : _document.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 공통 정적 엔트리 페이지
 * @Site        : https://devlog.ntiple.com
 **/
import { Html, Head, Main, NextScript } from 'next/document'
import { Content } from '@/components'
import app from '@/libs/app-context'

const { definePage, basepath, fncWaitCssLoading, fncDefineHideOnload } = app

export default definePage(() => {
  return (
  <Html id='my-first-app' className='my-first-app-new' lang='ko'>
    <Head>
      {/* 페이지 hard-loading 시 적용할 기본 transition */}
      <Content html={`
        ${ fncDefineHideOnload() }
        <link rel="stylesheet" href="${basepath('/assets/fonts/bootstrap-icons.min.css')}">
        `} />
    </Head>
    {/* hide-onload 클래스가 사라지면 트랜지션이 시작된다. */}
    <body className='hide-onload'>
      <Main />
      <Content html={ fncWaitCssLoading() } />
      <NextScript />
    </body>
  </Html>
  )
})