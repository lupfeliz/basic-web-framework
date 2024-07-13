import app from '@/libs/app-context'
import { Block, Button, Checkbox, Input, Select, Editor } from '@/components'
import { useState } from 'react'

const { log, definePage, goPage, useUpdate, useLauncher, subscribe, clear } = app

export default definePage((props) => {
  const [data] = useState({
    timer: 3,
    formdata: {
      input01: '',
      input02: 'AAAA',
      checkbox1: 'Y',
      checkbox2: '',
      checklist: ['', '', '', ''],
      select1: '',
      content: ''
    },
    options1: [
      { name: '선택해주세요', value: '' },
      'hotmail.com',
      'naver.com',
      'kakao.com',
      'gmail.com',
    ]
  })
  const update = useUpdate()
  const mounted = async () => {
    subscribe(async (state, mode) => {
      update(state)
    })
    const fnctime = async () => {
      if (data.timer == 1) {
        data.formdata.input02 = 'BBBB'
        data.formdata.checkbox2 = 'C'
        data.formdata.select1 = 'kakao.com'
        data.formdata.content = `<p><span style="color:#f00">CONTENT</span></p>`
        app.state(1, 1)
      } else if (data.timer > 0) {
        setTimeout(fnctime, 1000)
        app.state(1)
      }
      data.timer--
    }
    setTimeout(fnctime, 1000)
  }
  useLauncher({ mounted })
  return (
  <>
  <div>
    <h1>SMP01001S01 PAGE</h1>
    <hr/>
    <section>
      <Block className='my-1'>
      GLOBAL-STATE-VALUE: { app.state() }
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
          { data.timer > 0 ? (
            <> [change after { data.timer }sec: { data.formdata.input02 }] </>
          ) : '' }
        
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
          size='small'
          model={ data.formdata }
          name='select1'
          options={ data.options1 }
          />
      </Block>
    </section>
    <section>
      <h2>EDITOR</h2>
      <Block>
        <Editor
          model={ data.formdata }
          name='content'
          />
      </Block>
      <hr />
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