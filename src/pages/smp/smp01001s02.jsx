import app from '@/libs/app-context'
import { Block, Button, Checkbox, Input, Select } from '@/components'
import { useState } from 'react'

const { log, definePage, goPage, useUpdate, useLauncher, subscribe } = app

export default definePage((props) => {
  const [data] = useState({
    gstate: 0,
    formdata: {
      input01: '',
      input02: 'AAAA',
      checkbox1: 'Y',
      checkbox2: '',
      checklist: ['', '', '', ''],
      select1: ''
    },
    options1: [
      { name: '선택해주세요', value: '' },
      'hotmail.com',
      'naver.com',
      'kakao.com',
      'gmail.com',
    ]
  })
  useLauncher({
    async mounted() {
      subscribe(async (state, mode) => {
        data.gstate = state
        update(state)
      })
      setTimeout(async () => {
        data.formdata.input02 = 'BBBB'
        data.formdata.checkbox2 = 'C'
        data.formdata.select1 = 'kakao.com'
        app.state(1, 1)
      }, 3000)
    }
  })
  const update = useUpdate()
  return (
  <>
  <div>
    <h1>SMP01001S02 PAGE</h1>
    <hr/>
    <section>
      <Block className='my-1'>
      GLOBAL-STATE-VALUE: { data.gstate }
      </Block>
      <hr/>
    </section>
    <section>
      <h2>SELECT</h2>
      <Block className='my-1'>
        <Select
          model={ data.formdata }
          name='select1'
          options={ data.options1 }
          />
      </Block>
    </section>
    <section>
      <h2>FORMDATA</h2>
      <Block className='my-1'>
        FORMDATA: [{ JSON.stringify(data.formdata) }]
      </Block>
      <hr />
    </section>
  </div>
  </>
  )
})