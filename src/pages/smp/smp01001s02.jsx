import app from '@/libs/app-context'
import api from '@/libs/api'
import * as C from '@/libs/constants'
import crypto from '@/libs/crypto'
import { Button } from '@/components'

const { log, definePage, useSetup } = app

export default definePage((props) => {
  const self = useSetup({
    name: 'SMP01001S02',
    vars: {
      aeskey: ''
    },
    async mounted() {
    }
  })
  const { update, vars } = self()
  const onClick = async (v) => {
    switch (v) {
    case 0: {
      const res = await api.get(`cmn01001`, {})
      const check = res?.check || ''
      log.debug('RES:', res?.check, app.getConfig().security.key.rsa)
      await crypto.rsa.init(app.getConfig().security.key.rsa, C.PRIVATE_KEY)
      vars.aeskey = crypto.rsa.decrypt(check)
      update(1)
    } break
    case 1: {
      await crypto.aes.init(vars.aeskey)
      const res = await api.post(`lgn01001`, {
        userId: `lupfeliz`,
        passwd: `${crypto.aes.encrypt('12#a')}`
      })
      log.debug('RES:', res)
      update(1)
    } break
    case 2: {
      const res = await api.post(`atc01001`, {
        searchType: '',
        keyword: '',
        rowStart: 0,
        rowCount: 10,
        pagePerScreen: 10,
      })
      log.debug('RES:', res)
      update(1)
    } break
    case 3: {
      let v = new Uint8Array(10)
    } break
    }
  }
  return (
  <>
  <div>
    <h1>SMP01001S02 PAGE</h1>
    <hr/>
    <section>
      <Button
        onClick={ () => onClick(0) }
        >
        BUTTON1
      </Button>
      <Button
        onClick={ () => onClick(1) }
        >
        BUTTON2
      </Button>
      <Button
        onClick={ () => onClick(2) }
        >
        BUTTON3
      </Button>
      <Button
        onClick={ async () => {
          const res = await api.post(`https://devlog.ntiple.com/graphql`, `
            query GetPostsEdges {
              posts {
                edges {
                  node {
                    id
                    title
                    date
                  }
                }
              }
            }`, { headers: { 'content-type': 'application/graphql; charset=UTF-8' } })
          log.debug('RES:', res)
          } }
          >
          BUTTON4
        </Button>
    </section>
  </div>
  </>
  )
})