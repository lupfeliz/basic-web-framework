import app from '@/libs/app-context'
import api from '@/libs/api'
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
  const onClick = async () => {
    const res = await api.get(`cmn01001`, {})
    log.debug('RES:', res)
  }
  return (
  <>
  <div>
    <h1>SMP01001S02 PAGE</h1>
    <hr/>
    <section>
      <Button
        onClick={ onClick }
        >
        BUTTON
      </Button>
    </section>
  </div>
  </>
  )
})