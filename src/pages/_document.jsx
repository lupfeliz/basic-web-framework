import { Html, Head, Main, NextScript } from 'next/document'
import { Content } from '@/components'
export default () => {
  return (
  <Html>
    <Head>
      <Content tag='style' type='text/css' content={`
        body { transition: opacity 0.4s 0.2s ease }
        .hide-onload { opacity: 0; }
      `}/>
    </Head>
    <body className='hide-onload'>
      <Main />
      <NextScript />
    </body>
  </Html>
  )
}