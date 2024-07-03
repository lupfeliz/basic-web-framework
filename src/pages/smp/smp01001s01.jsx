import app from '@/libs/app-context'
import { Block, Button, Checkbox, Input, Select } from '@/components'
import { useState } from 'react'

const { log, definePage, goPage, useUpdate, useLauncher, subscribe, clear } = app

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
    <h1>SMP01001S01 PAGE</h1>
    <hr/>
    <section>
      <Block className='my-1'>
      GLOBAL-STATE-VALUE: { data.gstate }
      </Block>
      <hr/>
    </section>
    <section>
      <h2> BUTTON </h2>
      <Block className='my-1'>
        <Button
          className='mx-1'
          onClick={ () => goPage(-1) }
          >
          BACK
        </Button>
        <Button
          className='mx-1'
          variant='contained'
          onClick={ () => {
            clear(data.formdata)
            update(app.state(1))
          } }
          >
          CLEAR
        </Button>
        <Button
          className='mx-1'
          variant='contained'
          color='warning'
          >
          BUTTON
        </Button>
        <Button
          className='mx-1'
          variant='outlined'
          color='info'
          >
          BUTTON
        </Button>
      </Block>
      <hr />
    </section>
    <section>
      <h2>INPUT</h2>
      <Block className='my-1'>
        <Input
          model={ data.formdata }
          name='input01'
          size='small'
          />
        <span className='mx-1 my-1'>
        [VALUE: { data.formdata.input01 }]
        </span>
      </Block>
      <Block className='my-1'>
        <Input
          model={ data.formdata }
          name='input02'
          size='small'
          />
        <span className='mx-1 my-1'>
        [change after 3sec: { data.formdata.input02 }]
        </span>
      </Block>
      <hr />
    </section>
    <section>
      <h2>CHECKBOX</h2>
      <Block className='my-1'>
        <Checkbox
          model={ data.formdata }
          name='checkbox1'
          value='Y'
          />
        <Checkbox
          model={ data.formdata }
          name='checkbox2'
          value='A'
          />
        <Checkbox
          type='radio'
          model={ data.formdata }
          name='checkbox2'
          value='B'
          />
        <Checkbox
          type='radio'
          model={ data.formdata }
          name='checkbox2'
          value='C'
          />
      </Block>
      <Block className='my-1'>
        { data.formdata.checklist.map((itm, inx) => (
          <Checkbox
            key={ inx }
            model={ data.formdata }
            name={ `checklist.${inx}` }
            value='Y'
            />
        )) }
      </Block>
      <hr />
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