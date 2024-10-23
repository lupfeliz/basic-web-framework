/**
 * @File        : smp01001s05.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 샘플4
 * @Site        : https://devlog.ntiple.com
 **/

import app from '@/libs/app-context'
import { Checkbox, Block, Form, Button, Input, Select, Container, Textarea } from '@/components'
import { useForm, validateForm } from '@/components/form'
import format from '@/libs/format'
import dialog from '@/libs/dialog-context'

const { log, definePage, useSetup, goPage, getParameter, asType, useRef } = app

export default definePage(() => {
  const self = useSetup({
    name: 'SMP01001S05',
    vars: {
      data: {
        input1: ''
      },
      form: useForm()
    },
    async mounted() {
    },
    async updated(mode) {
    }
  })
  const { update, vars, ready } = self()
  const onClick = async (num) => {
    log.debug('FORM:', vars.form)
    const res = await validateForm(vars.form)
  }
  const onError = async (e) => {
    log.debug('ERROR:', e)
    await dialog.alert(e.message)
    e?.element?.focus && e.element.focus()
  }
  return (
  <Container>
    <section className='title'>
      <h2></h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form
        ref={ vars.form }
        >
        <article>
          <Block className='form-block'>
            <Input
              type='numeric'
              form={ vars.form }
              model={ vars.data }
              name='input1'
              label='금액'
              required={ true }
              maxLength={ 20 }
              minLength={ 2 }
              minValue={ 1000 }
              maxValue={ 999999999999 }
              onError={ onError }
              formatter={ format.numeric }
              vrules='auto'
              />
          </Block>
          <Block className='form-block'>
            { format.numToHangul(vars.data.input1) } [ { String(vars.data.input1).length } ]
          </Block>
          <Block className='form-block'>
            <Button
              onClick={ onClick }
              >
              CHECK-FORM
            </Button>
          </Block>
        </article>
      </Form>
    </section>
  </Container>
  )
})