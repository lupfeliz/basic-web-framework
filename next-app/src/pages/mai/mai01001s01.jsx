/**
 * @File        : mai01001s01.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 메인 페이지
 * @Site        : https://devlog.ntiple.com
 **/

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

getLogger('i18n').setLevel('trace')

export default definePage(() => {

  const { ready, update } = useSetup({
    name: $PAGENAME$,
  })()
  const userInfo = userContext.getUserInfo()

  return (
  <Page>
    <section className='title'>
      <h2>{ $t('MAI0001') || '메인페이지' }</h2>
    </section>
    <hr/>
    <section>
      <p> { $t('MAI0002') || '샘플 게시판 어플리케이션 입니다.' } </p>
      <p> { $t('MAI0003') || '현재 페이지는 메인페이지 입니다.' } </p>
      <p> { $t('CMN0004') } </p>
      <article>
        { ready() && !(userInfo?.userId) && (
        <Block
          className='my-1'
          >
          <Button
            className='mx-1'
            variant='primary'
            href='/lgn/lgn01001s01'
            >
            { $t('CMN0009') || '로그인' }
          </Button>
          <Button
            className='mx-1'
            variant='primary'
            href='/usr/usr01001s01'
            >
            { $t('CMN0010') || '회원가입' }
          </Button>
        </Block>
        ) }
        <Block
          className='my-1'
          >
          <Button
            className='mx-1'
            variant='primary'
            href='/atc/atc01001s04/1'
            >
            { $t('CMN0011') || '게시판으로 이동' }
          </Button>
          <Button
            className='mx-1'
            variant='outline-success'
            href='/smp/smp01001s01'
            >
            { $t('MAI0004') || '샘플'}1
          </Button>
          <Button
            className='mx-1'
            variant='outline-success'
            href='/smp/smp01001s02'
            >
            { $t('MAI0004') || '샘플'}2
          </Button>
          <Button
            className='mx-1'
            variant='outline-success'
            href='/smp/smp01001s03'
            >
            { $t('MAI0004') || '샘플'}3
          </Button>
          <Button
            className='mx-1'
            variant='outline-success'
            href='/smp/smp01001s04'
            >
            { $t('MAI0004') || '샘플'}4
          </Button>
          <Button
            className='mx-1'
            variant='outline-success'
            href='/smp/smp01001s05'
            >
            { $t('MAI0004') || '샘플'}5
          </Button>
          <Button
            className='mx-1'
            variant='outline-success'
            href='/smp/smp01001s06'
            >
            { $t('MAI0004') || '샘플'}6
          </Button>
          <Button
            className='mx-1'
            variant='outline-success'
            href='https://devwas.ntiple.com/study202403/swagger/swagger-ui/index.html'
            >
            오픈API
          </Button>
        </Block>
      </article>
    </section>
  </Page>
  )
})