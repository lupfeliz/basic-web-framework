/**
 * @File        : smp01001s05.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 샘플4
 * @Site        : https://devlog.ntiple.com
 **/

import app from '@/libs/app-context'
import { Checkbox, Block, Form, Button, Input, Select, Container, Slider, Textarea } from '@/components'
import { useForm, validateForm } from '@/components/form'
import format from '@/libs/format'
import dialog from '@/libs/dialog-context'

const PAGENAME = 'smp01001s05'
const { getLogger, definePage, useSetup, goPage, getParameter, asType, useRef } = app
const log = getLogger(PAGENAME)

export default definePage(() => {
  const self = useSetup({
    name: PAGENAME,
    vars: {
      data: {
        input1: '',
        checklist: ['', '', '', ''],
        select: '',
        slider1: '',
        slider2: '',
      },
      options1: [
        { name: '선택해주세요', value: '' },
        'hotmail.com',
        'naver.com',
        'kakao.com',
        'gmail.com',
      ],
      form: useForm(),
      validctx: {
        check2: (v, p) => {
          /** 숫자 2 는 사용할수 없도록 하는 규칙. */
          log.debug('VALIDATION-CHECK2:', v, p, String(v).indexOf('2'))
          if (String(v.value).indexOf('2') != -1) { return `숫자 '2' 는 사용할 수 없어요.` }
          return true
        }
      }
    },
    async mounted() {
      getLogger('input').setLevel('trace')
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
            <Slider
              ranges={ [10, 20, 50, 80, 100] }
              form={ vars.form }
              model={ vars.data}
              names={ ['slider1', 'slider2'] }
              snap
              />
          </Block>
          <Block className='form-block'>
            <Select
              form={ vars.form }
              options={ vars?.options1 }
              model={ vars.data }
              name={ `select` }
              required
              label='이메일'
              onError={ onError }
              vrules='auto'
              />
          </Block>
          <Block className='form-block'>
            <Input
              type='numeric'
              form={ vars.form }
              model={ vars.data }
              name='input1'
              label='금액'
              required
              maxLength={ 20 }
              minLength={ 2 }
              minValue={ 1000 }
              maxValue={ 999999999999 }
              onError={ onError }
              formatter={ format.numeric }
              vrules='auto|check2'
              validctx={ vars.validctx }
              />
          </Block>
          <Block className='form-block'>
            { format.numToHangul(vars.data.input1) } [ { String(vars.data.input1).length } ]
          </Block>
          <Block className='form-block'>
            { vars?.data?.checklist && vars?.data?.checklist.map((itm, inx) => (
              <Checkbox
                key={ inx }
                form={ vars.form }
                model={ vars.data }
                name={ `checklist.${inx}` }
                label='체크리스트'
                onError={ onError }
                value='Y'
                vrules='auto|atleast:2'
                />
            )) }
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