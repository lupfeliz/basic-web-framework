import Head from 'next/head'
import { AnimatePresence } from 'framer-motion'
import LayoutDefault from '@/components/layout-default'
import app from '@/libs/app-context'
import '@/styles/globals.scss'
import '@/styles/util.scss'
const { subscribe, useUpdate, useLauncher, definePage } = app
export default definePage((props) => {
  const { Component, pageProps, router } = props
  useLauncher({
    async mounted() {
      app.ready(props)
      subscribe((state, mode) => mode ? update(app.state(0, 0)) : '')
    }
  })
  const update = useUpdate()
  const applyLayout = Component.layout || ((page) => (
    <LayoutDefault key={ router.route }> { page } </LayoutDefault>
  ))
  return (
    <>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    </Head>
    <AnimatePresence mode='wait' initial={false}>
      { applyLayout(
        <Component {...pageProps} />
      ) }
    </AnimatePresence>
    </>
  )
})