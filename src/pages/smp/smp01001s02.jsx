import app from '@/libs/app-context'
import api from '@/libs/api'
import * as C from '@/libs/constants'
import { Block, Button, Checkbox, Input, Select } from '@/components'
import { useState } from 'react'

const { log, definePage, goPage, useUpdate, useLauncher, subscribe } = app

export default definePage((props) => {
  const [data] = useState({
  })
  useLauncher({
    async mounted() {
      subscribe(async (state, mode) => {
        update(state)
      })
    }
  })
  const update = useUpdate()
  const onClick = async (v) => {
    switch (v) {
    case 0: {
      const res = await api.get(`cmn01001`, {})
      log.debug('RES:', res)
    } break
    case 1: {
      const res = await api.post(`lgn01001`, {})
      log.debug('RES:', res)
    } break
    case 2: {
      const res = await api.post(`/graphql`, `
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
    </section>
  </div>
  </>
  )
})