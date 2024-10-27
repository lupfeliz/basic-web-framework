/**
 * @File        : lgn01001s01.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 로그인 페이지
 * @Site        : https://devlog.ntiple.com
 **/

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

import uschema from '@/schema/user'

export default definePage(() => {
  const self = useSetup({
    name: $PAGENAME$,
    vars: {
      formdata: clone(uschema),
      form: useForm(),
      validctx: { }
    }
  })

  const { vars } = self()

  const submit = async () => {
    const formdata = clone(vars.formdata)
    formdata.passwd = encrypt(JSON.stringify({ p: formdata.passwd, t: new Date().getTime() }))
    try {
      if (await validateForm(vars.form)) {
        const res = await api.post(`lgn01001`, formdata)
        log.debug('RES:', res)
        if (res.rescd === C.RESCD_OK) {
          goPage(-1)
        } else {
          await dialog.alert('로그인이 실패했습니다')
        }
      }
    } catch (e) {
      log.debug('E:', e)
    }
  }

  const onError = async (e) => {
    log.debug('E:', e)
    await dialog.alert(e?.message || '오류가 발생했어요')
    if (e?.element) { e.element.focus() }
  }

  return (
  <Page>
    <section className='title'>
      <h2>로그인</h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form
        ref={ vars.form }
        validctx={ vars.validctx }
        onError={ onError }
        >
        <article className='text-center'>
          <Block className='form-block'>
            <label htmlFor='frm-user-id'> 아이디 </label>
            <Block className='form-element'>
            <Input
              id='frm-user-id'
              form={ vars.form }
              model={ vars.formdata }
              name='userId'
              label='아이디'
              placeholder='아이디'
              minLength={ 4 }
              maxLength={ 12 }
              className='w-full'
              size='small'
              onEnter={ submit }
              required
              vrules='auto'
              />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-passwd'> 비밀번호 </label>
            <Block className='form-element'>
            <Input
              id='frm-passwd'
              type='password'
              form={ vars.form }
              model={ vars.formdata }
              name='passwd'
              label='비밀번호'
              placeholder='비밀번호'
              minLength={ 4 }
              maxLength={ 20 }
              className='w-full'
              size='small'
              onEnter={ submit }
              required
              vrules='auto'
              />
            </Block>
          </Block>
          <hr/>
          <Block className='buttons'>
            <Button
              className='mx-1'
              variant='primary'
              size='large'
              onClick={ submit }
              >
              로그인
            </Button>
            <Button
              className='mx-1'
              variant='outline-secondary'
              size='large'
              >
              취소
            </Button>
          </Block>
        </article>
      </Form>
    </section>
  </Page>
  )
})