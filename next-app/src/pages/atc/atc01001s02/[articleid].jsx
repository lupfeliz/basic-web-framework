/**
 * @File        : atc01001s02/[articleid].jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 게시물 조회 페이지
 * @Site        : https://devlog.ntiple.com
 **/

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

import aschema from '@/schema/article'

export default definePage(() => {
  const self = useSetup({
    name: $PAGENAME$,
    vars: {
      formdata: clone(aschema),
    },
    async mounted() {
      /** getParameter 로 path-variable (articleid)을 읽어온다 */
      loadData(getParameter('articleid'))
    }
  })
  const { vars, update } = self()

  const loadData = async (articleId) => {
    const res = await api.get(`atc01001/${articleId}`)
    log.debug('RES:', res)
    vars.formdata = clone(res)
    setTimeout(() => update(C.UPDATE_ENTIRE), 200)
  }

  const submit = async () => {
    let msg = ''
    let model = clone(vars.formdata)
    const contents = getText(model.contents).trim()
    if (!msg && !model.title) { msg = '제목을 입력해 주세요' }
    if (!msg && model.title.length < 2) { msg = '제목을 2글자 이상 입력해 주세요' }
    if (!msg && !contents) { msg = '내용을 입력해 주세요' }
    if (!msg && contents.length < 2) { msg = '내용을 2글자 이상 입력해 주세요' }
    if (msg) {
      await dialog.alert(msg)
    } else {
      let result = false
      try {
        /** 필요한 파라메터만 복사한다. */
        Object.keys(model).map((k) => ['id', 'title', 'contents'].indexOf(k) == -1 && delete model[k])
        log.debug('CHECK:', model)
        const res = await api.put(`atc01001`, model)
        log.debug('RES:', res)
        if (res.rescd === C.RESCD_OK) {
          result = true
          goPage(-1)
        }
      } catch (e) {
        msg = e?.message
        log.debug('E:', e)
      }
      if (!result) {
        await dialog.alert(msg || '글 수정에 실패했어요 잠시후 다시 시도해 주세요')
      }
    }
  }

  return (
  <Page>
    <section className='title'>
      <h2>글수정</h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form>
        <article>
          <Block className='form-block'>
            <label htmlFor='frm-title'> 제목 </label>
            <Block className='form-element'>
              <Input
                id='frm-title'
                model={ vars.formdata }
                name='title'
                placeholder='제목'
                maxLength={ 20 }
                className='w-full'
                size='small'
                />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-contents'> 내용 </label>
            <Block className='form-element editor'>
              <Editor
                id='frm-contents'
                model={ vars.formdata }
                name='contents'
                className='w-full'
                size='small'
                />
            </Block>
          </Block>
          <hr/>
          <Block className='buttons'>
            <Button
              className='mx-1'
              variant='contained'
              size='large'
              onClick={ submit }
              >
              완료
            </Button>
            <Button
              className='mx-1'
              variant='outlined'
              size='large'
              onClick={ () => goPage(-1) }
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