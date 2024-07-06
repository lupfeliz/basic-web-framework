import { Html, Head, Main, NextScript } from 'next/document'
import { Content } from '@/components'
import app from '@/libs/app-context'
import crypto from '@/libs/crypto'
const { definePage, svrconf } = app
export default definePage(() => {
  const confstr = crypto.aes.encrypt(JSON.stringify(svrconf), '{$$CRYPTO_KEY$$}')
  return (
  <Html>
    <Head>
      <Content tag='style' type='text/css' content={`
        body { transition: opacity 0.4s 0.2s ease }
        .hide-onload { opacity: 0; }
      `}/>
      <Content tag='script' id='page-config' type='text/plain'
        content={ `${confstr}` }
        />
    </Head>
    <body className='hide-onload'>
      <Main />
      <NextScript />
    </body>
  </Html>
  )
})