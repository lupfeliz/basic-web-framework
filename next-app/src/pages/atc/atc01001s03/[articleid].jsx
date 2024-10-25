/**
 * @File        : atc01001s03/[articleid].jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 게시물 수정 페이지
 * @Site        : https://devlog.ntiple.com
 **/

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

import aschema from '@/schema/article'
const { formatDate } = format

export default definePage(() => {
  const self = useSetup({
    name: $PAGENAME$,
    vars: {
      data: clone(aschema),
    },
    async mounted() {
      loadData(getParameter('articleid'))
    }
  })
  const userInfo = userContext.getUserInfo()
  const { vars, update, ready } = self()

  const loadData = async (articleId) => {
    const res = await api.get(`atc01001/${articleId}`)
    vars.data = clone(res)
    log.debug('RES:', res)
    update(C.UPDATE_ENTIRE)
  }

  const print = {
    cdate: (date) => date && formatDate(date, 'YYYY-MM-DD'),
  }
  return (
  <Page>
    <section className='title'>
      <h2>{ vars.data?.title || '' }</h2>
      { ready() && (userInfo?.userId || '') == vars.data?.userId && (
        <Button
          variant='contained'
          href={`/atc/atc01001s02/${vars.data?.id}`}
          >
          글수정
        </Button>
      ) }
    </section>
    <hr/>
    <section>
      <article>
        <Block> 
          <p> 작성자 : { vars.data.userNm } </p>
          <p> 작성일시 : { print.cdate(vars.data.ctime) } </p>
        </Block>
        <hr/>
        <Block className='w-full overflow-x-auto'>
          <Content html={ vars.data?.contents || '' } />
        </Block>
      </article>
    </section>
  </Page>
  )
})