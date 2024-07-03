import Head from 'next/head'
import moment from 'moment'
import { AnimatePresence } from 'framer-motion'
import LayoutDefault from '@/components/layout-default'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import '@/styles/globals.scss'
import '@/styles/util.scss'
const { subscribe, useUpdate, useLauncher } = app
const App = (props) => {
  const { Component, pageProps, router } = props
  const dtstr = moment().format(C.DEFAULT_TIME_FORMAT)
  useLauncher({
    async mounted() {
      app.config(props)
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
      <meta name='revised' content={ dtstr } />
    </Head>
    <AnimatePresence mode='wait' initial={false}>
      { applyLayout(
        <Component {...pageProps} />
      ) }
    </AnimatePresence>
    </>
  )
}
export default App