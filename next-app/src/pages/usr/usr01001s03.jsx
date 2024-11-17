/**
 * @File        : usr01001s03.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 마이페이지
 * @Site        : https://devlog.ntiple.com
 **/

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

import uschema from '@/schema/user'

const userInfo = userContext.getUserInfo()

export default definePage(() => {
  const self = useSetup({
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
        passwd2chk: (v) => {
          if ((vars.formdata.passwd || '') !== (vars.formdata.passwd2 || '')) { return `입력된 비밀번호가 서로 달라요` }
          return true
        },
        emailchk: (v) => {
          const email = `${vars.formdata.emailId || ''}@${(vars.formdata.emailHost || '')}`
          if (!format.pattern(C.EMAIL).test(email)) { return `'${email}' 은 정상적인 이메일 형식이 아니예요` }
          return true
        },
      },
    },
    /** email 등 저장하고 있지 않은 개인정보를 표시하기 위해 불러들임 */
    async mounted() {
      const res = await api.get(`usr01002/${userInfo.userId}`)
      vars.formdata = res
      const email = format.pattern(C.EMAIL).exec(vars.formdata.email)
      if (email) {
        vars.formdata.emailId = email[1]
        vars.formdata.emailHost = email[5]
      }
      try {
        vars.emailHosts = mergeAll(
          [ C.SELECT_ITEM_EMPTY($t) ],
          await commonCodes.get('cmn01', '001'),
          [ C.SELECT_ITEM_MANUAL($t) ],
        )
      } catch (e) {
        log.debug('E:', e)
      }
      update(C.UPDATE_ENTIRE)
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
  const { update, vars, ready } = self()
  const emailHostChanged = async () => {
    if (vars.formdata.emailHost == '_') {
      vars.emailSelector = 'input'
      vars.formdata.emailHost = ''
      update(C.UPDATE_SELF)
    }
  }
  /** validation 진행 후 submit */
  const submit = async () => {
    try {
      if (await validateForm(vars.form)) {
        /** 필요한 파라메터만 복사한다. */
        let model = clone(vars.formdata)
        model.email = `${model.emailId}@${model.emailHost}`
        model = copyExists(clone(uschema), model)
        model.passwd = encrypt(model.passwd)
        log.debug('SUBMIT-MODEL:', model)
        let res = await api.put(`usr01002`, model)
        log.debug('RES:', res)
        let result = false
        if (res.rescd === C.RESCD_OK) {
          result = true
          goPage(-1)
        }
        if (!result) {
          await dialog.alert('회원 정보 수정에 실패했어요 잠시후 다시 시도해 주세요')
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
      <h2>회원정보 수정</h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form
        ref={ vars.form }
        validctx={ vars.validctx }
        onError={ onError }
        >
        <article>
          { ready() && (
          <>
          <Block className='form-block'>
            <p> 이름 : { userInfo.userNm } </p>
          </Block>
          <Block className='form-block'>
            <p> 아이디 : { userInfo.userId } </p>
          </Block>
          </>
          ) }
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
              placeholder='변경시에만 입력해 주세요'
              minLength={ 4 }
              maxLength={ 20 }
              size='small'
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
              maxLength={ 20 }
              size='small'
              vrules='auto|password|passwd2chk'
              />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-email'>이메일</label>
            <Input.Group>
            <Input
              id='frm-email'
              form={ vars.form }
              model={ vars.formdata }
              name='emailId'
              label='이메일 아이디'
              placeholder='이메일 아이디'
              minLength={ 2 }
              maxLength={ 20 }
              size='small'
              required
              vrules='auto|emailchk'
              />
            <span className="input-group-text">@</span>
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
                  maxLength={ 20 }
                  size='small'
                  required
                  vrules='auto'
                  />
              )
            ) }
            </Input.Group>
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
              onClick={ () => goPage(-1) }
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