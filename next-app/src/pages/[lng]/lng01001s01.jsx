/**
 * @File        : lng01001s01.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : i18n 테스트 페이지
 * @Site        : https://devlog.ntiple.com
 **/
/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */
/* #MACRO-I18N# 이 부분은 미리 만들어진 선언문으로 대체된다 */

import fs from 'fs'

if (isServer()) {
  const modpath = String(__filename).substring((process.cwd() + '/dist/server').length)
  log.debug('MOD-PATH:', modpath)
  let lng = 'ko'
  let nsp = 'commons'
  const lngpath = process.cwd() + '/dist/server/src_locales_' + lng + '_' + nsp + '_ts.js'
  if (fs.existsSync(lngpath)) {
    /** TODO: 로켈 읽어와서 입력하기 */
    log.debug('CHECK-LOCALE:', lngpath)
  }
}

export default definePage((props) => {

  const self = useSetup({
    async mounted() {
    }
  })
  const { update, vars, ready } = self()
  return (
  <Page>
    <div>{ getParameter('lng', props) }</div>
  </Page>
  )
})

/** 아래 내용이 macro-loader 에 포함되어 있다. (MACRO-I18N 에서 대체됨) */
// export const getStaticPaths = async () => {
//   /** TODO: i18n 에서 generating 할 목록, 동적으로 가능하도록 만들어야 한다. */
//   const paths = [
//     { params: { lng: 'en' } },
//     { params: { lng: 'ko' } }
//   ]
//   return { paths, fallback: false }
// }
// export const getStaticProps = async (context) => {
//   const params = context.params
//   /** 페이지에서 props.pageProps 에 할당된다 */
//   return { props: { lng: params?.lng || '' } }
// }