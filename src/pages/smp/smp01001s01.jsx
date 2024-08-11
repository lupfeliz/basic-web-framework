import app from '@/libs/app-context'
import { Block, Button, Checkbox, Input, Select, Editor } from '@/components'

const { log, definePage, goPage, useSetup, clear } = app

export default definePage((props) => {
  const mounted = async () => {
    log.debug('MOUNTED! SMP01001S01', props)
    const fnctime = async () => {
      if (vars.timer == 1) {
        vars.formdata.input02 = 'BBBB'
        vars.formdata.checkbox2 = 'C'
        vars.formdata.select1 = 'kakao.com'
        vars.formdata.content = `<p><span style="color:#f00">CONTENT</span></p>`
        vars.formdata.idgen.map((v, i, l) => l[i] = app.genId())
        update(3)
      } else if (vars.timer > 0) {
        setTimeout(fnctime, 1000)
        update(2)
      }
      vars.timer--
    }
    setTimeout(fnctime, 1000)
    vars.formdata.idgen.map((v, i, l) => l[i] = app.genId())
  }
  const unmount = async () => {
    log.debug('UNMOUNT! SMP01001S01')
  }
  const updated = async () => {
    log.debug('UPDATED! SMP01001S01')
  }
  const { update, vars } = useSetup({ mounted, unmount, updated, name: 'SMP01001S01', vars: {
    timer: 3,
    formdata: {
      input01: '',
      input02: 'AAAA',
      checkbox1: 'Y',
      checkbox2: '',
      checklist: ['', '', '', ''],
      select1: '',
      content: '',
      idgen: ['', '', '', '']
    },
    options1: [
      { name: '선택해주세요', value: '' },
      'hotmail.com',
      'naver.com',
      'kakao.com',
      'gmail.com',
    ]
  } })()
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
            clear(vars?.formdata)
            update(1)
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
        <Button
          className='mx-1'
          variant='outlined'
          color='info'
          href={'/smp/smp01001s02'}
          >
          LINK
        </Button>
      </Block>
      <hr />
    </section>
    <section>
      <h2>INPUT</h2>
      <Block className='my-1'>
        <Input
          model={ vars?.formdata }
          name='input01'
          size='small'
          />
        <span className='mx-1 my-1'>
        [VALUE: { vars?.formdata?.input01 }]
        </span>
      </Block>
      <Block className='my-1'>
        <Input
          model={ vars?.formdata }
          name='input02'
          size='small'
          />
        <span className='mx-1 my-1'>
          { vars?.timer > 0 ? (
            <> [change after { vars?.timer }sec: { vars?.formdata?.input02 }] </>
          ) : '' }
        
        </span>
      </Block>
      <hr />
    </section>
    <section>
      <h2>CHECKBOX</h2>
      <Block className='my-1'>
        <Checkbox
          model={ vars?.formdata }
          name='checkbox1'
          value='Y'
          />
        <Checkbox
          model={ vars?.formdata }
          name='checkbox2'
          value='A'
          />
        <Checkbox
          type='radio'
          model={ vars?.formdata }
          name='checkbox2'
          value='B'
          />
        <Checkbox
          type='radio'
          model={ vars?.formdata }
          name='checkbox2'
          value='C'
          />
      </Block>
      <Block className='my-1'>
        { vars?.formdata?.checklist && vars?.formdata?.checklist.map((itm, inx) => (
          <Checkbox
            key={ inx }
            model={ vars?.formdata }
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
          model={ vars?.formdata }
          name='select1'
          options={ vars?.options1 }
          />
      </Block>
    </section>
    <section>
      <h2>EDITOR</h2>
      <Block>
        <Editor
          model={ vars?.formdata }
          name='content'
          />
      </Block>
      <hr />
    </section>
    <section>
      <h2>FORMDATA</h2>
      <Block className='my-1'>
        FORMDATA: [{ JSON.stringify(vars?.formdata) }]
      </Block>
      <hr />
    </section>
    <section>
    { (vars?.formdata?.idgen || []).map((v, i) => (
    <div key={ i }>
      { i } : { v }
    </div>
    )) }
    </section>
  </div>
  </>
  )
})