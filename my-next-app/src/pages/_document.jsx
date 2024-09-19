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

const { definePage } = app

export default definePage(() => {
  return (
  <Html id='my-first-app'>
    <Head>
      {/* 페이지 hard-loading 시 적용할 기본 transition */}
      <Content html={`
        <style type="text/css">
          body { transition: opacity 0.4s 0.2s ease; display: block !important; }
          .hide-onload { opacity: 0; }
        </style>
        ` } />
    </Head>
    {/* hide-onload 클래스가 사라지면 트랜지션이 시작된다. */}
    <body className='hide-onload'>
      <Main />
      <Content html={`
        <script>
        var body = document.body;
        function fnunload() {
          window.removeEventListener('beforeunload', fnunload);
          body.classList.add('hide-onload');
        }
        /** CSS가 적재될때 까지 대기 (깨짐방지) */
        function fnload() {
          var o = false;
          for (var inx = document.styleSheets.length; inx >= 0; inx--) {
            if ((o = document.styleSheets[inx]) && (o = o.rules) && (o = o[0]) && String(o.selectorText).startsWith('html#my-first-app')) {
              o = true;
              break;
            }
          }
          if (o === true) {
            window.addEventListener('beforeunload', fnunload)
            document.removeEventListener('DOMContentLoaded', fnload)
            body.classList.remove('hide-onload')
          } else {
            setTimeout(fnload, 50);
          }
        }
        fnload()
        </script>
        ` } />
      <NextScript />
    </body>
  </Html>
  )
})