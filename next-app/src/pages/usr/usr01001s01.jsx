/**
 * @File        : usr01001s01.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 회원가입
 * @Site        : https://devlog.ntiple.com
 **/

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

import uschema from '@/schema/user'

export default definePage(() => {
  const self = useSetup({
    name: $PAGENAME$,
    vars: {
      formdata: mergeObj(
        clone(uschema), {
        passwd2: '',
        emailId: '',
        emailHost: '',
      }),
      iddupchk: false,
      emailSelector: 'select',
      emailHosts: [ C.SELECT_ITEM_EMPTY(), C.SELECT_ITEM_MANUAL() ],
      form: useForm(),
      validctx: {
        dupchk: (v) => {
          if (!vars.iddupchk) { return `아이디 중복체크를 수행해 주세요` }
          return true
        },
        passwd2chk: (v) => {
          if (vars.formdata.passwd !== vars.formdata.passwd2) { return `입력된 비밀번호가 서로 달라요` }
          return true
        },
        emailchk: (v) => {
          const email = `${vars.formdata.emailId}@${vars.formdata.emailHost}`
          if (!format.pattern(C.EMAIL).test(email)) { return `'${email}' 은 정상적인 이메일 형식이 아니예요` }
          return true
        },
      },
    },
    async mounted() {
      try {
        log.debug(`${$PAGENAME$} - MOUNTED!`)
        vars.emailHosts = mergeAll(
          [ C.SELECT_ITEM_EMPTY($t) ],
          await commonCodes.get('cmn01', '001'),
          [ C.SELECT_ITEM_MANUAL($t) ],
        )
      } catch (e) {
        log.debug('E:', e)
      }
    },
    async updated() {
      const { item } = app
      const list = vars.emailHosts
      if (list.length > 1) {
        item(list, 0, C.SELECT_ITEM_EMPTY($t))
        item(list, -1, C.SELECT_ITEM_MANUAL($t))
      }
    }
  })
  const { update, vars } = self()
  const emailHostChanged = async () => {
    /** 직접입력인 경우 입력컴포넌트 전환 */
    if (vars.formdata.emailHost == '_') {
      vars.emailSelector = 'input'
      vars.formdata.emailHost = ''
      update(C.UPDATE_SELF)
    }
  }
  const checkUserId = async () => {
    const model = vars.formdata
    vars.iddupchk = false
    if (model.userId) {
      model.userId = String(model.userId)
        .toLowerCase().replace(/[^a-zA-Z0-9]+/, '')
      const res = await api.get(`usr01001/${model.userId}`)
      if (res?.rescd !== C.RESCD_OK) {
        await dialog.alert(`"${model.userId}" 는 이미 사용중이거나 사용할수 없어요.`)
      } else {
        vars.iddupchk = true
        await dialog.alert(`"${model.userId}" 는 사용 가능해요.`)
      }
      update(C.UPDATE_SELF)
    } else {
      await dialog.alert('아이디를 입력해 주세요')
    }
  }
  /** 회원가입, was 에 전달하기 전에 validation 부터 수행한다. */
  const submit = async () => {
    try {
      if (await validateForm(vars.form)) {
        /** 필요한 파라메터만 복사한다. */
        let model = clone(vars.formdata)
        model.email = `${model.emailId}@${model.emailHost}`
        model = copyExists(clone(uschema), model)
        model.passwd = encrypt(model.passwd)
        log.trace('SUBMIT-MODEL:', model)
        let res = await api.put(`usr01001`, model)
        log.debug('RES:', res)
        if (res.rescd === C.RESCD_OK) {
          replacePage(`/usr/usr01001s02`)
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
      <h2>회원가입</h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form
        ref={ vars.form }
        validctx={ vars.validctx }
        onError={ onError }
        >
        <article>
          <Block className='form-block'>
            <label htmlFor='frm-user-nm'> 이름 </label>
            <Block className='form-element'>
            <Input
              id='frm-user-nm'
              form={ vars.form }
              model={ vars.formdata }
              name='userNm'
              label='이름'
              placeholder='이름 2~12자 이내 실명기재 '
              minLength={ 2 }
              maxLength={ 12 }
              size='small'
              required
              vrules='auto'
              />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-user-id'>아이디</label>
            <Block className='form-element user-id'>
            <Input.Group>
              <Input
                id='frm-user-id'
                form={ vars.form }
                model={ vars.formdata }
                name='userId'
                label='아이디'
                placeholder='영문자로 시작, 4~12자 이내'
                minLength={ 4 }
                maxLength={ 12 }
                size='small'
                required
                onChange={ () => vars.iddupchk = false }
                vrules='auto|dupchk'
                />
              <Button
                variant='secondary'
                color='inherit'
                onClick={ checkUserId }
                >
                중복확인
              </Button>
            </Input.Group>
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-passwd'>비밀번호</label>
            <Block className='form-element'>
            <Input
              type='password'
              id='frm-passwd'
              form={ vars.form }
              model={ vars.formdata }
              name='passwd'
              label='비밀번호'
              placeholder='영문자, 숫자, 특수기호 각 1개이상 4~20자 이내'
              minLength={ 4 }
              maxLength={ 20 }
              size='small'
              required
              vrules='auto|password'
              />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-passwd2'>비밀번호확인</label>
            <Block className='form-element'>
            <Input
              type='password'
              id='frm-passwd2'
              form={ vars.form }
              model={ vars.formdata }
              name='passwd2'
              label='비밀번호 확인'
              placeholder='비밀번호확인'
              minLength={ 4 }
              maxLength={ 30 }
              size='small'
              required
              vrules='auto|password|passwd2chk'
              />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-email'>이메일</label>
            <Block className='form-element email'>
            <Input.Group>
              <Input
                id='frm-email'
                form={ vars.form }
                model={ vars.formdata }
                name='emailId'
                label='이메일 아이디'
                placeholder='이메일 아이디'
                minLength={ 2 }
                maxLength={ 30 }
                size='small'
                required
                vrules='auto|emailchk'
                />
              <span className='input-group-text'>@</span>
              { matcher(vars?.emailSelector, 'select', 
                'select', (
                  <Select
                    form={ vars.form }
                    model={ vars.formdata }
                    name='emailHost'
                    label='이메일 호스트'
                    options={ vars.emailHosts }
                    onChange={ emailHostChanged }
                    size='small'
                    required
                    vrules='auto'
                    />
                ),
                'input', (
                  <Input
                    form={ vars.form }
                    model={ vars.formdata }
                    name='emailHost'
                    label='이메일 호스트'
                    minLength={ 4 }
                    maxLength={ 30 }
                    size='small'
                    required
                    vrules='auto'
                    />
                )
              ) }
            </Input.Group>
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
              { `${$t('CMN0015') || '완료'}` }
            </Button>
            <Button
              className='mx-1'
              variant='outline-secondary'
              size='large'
              >
              { `${$t('CMN0002') || '취소'}` }
            </Button>
          </Block>
        </article>
      </Form>
    </section>
  </Page>
  )
})