/**
 * @File        : lng01001s01.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : i18n 테스트 페이지
 * @Site        : https://devlog.ntiple.com
 **/
/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */
/* #MACRO-I18N# 이 부분은 미리 만들어진 선언문으로 대체된다 */

export default definePage((props) => {
  const self = useSetup({
    async mounted() {
    }
  }, props)
  const { update, vars, ready } = self()
  return (
  <Page>
    <div>{ getParameter('lang') }</div>
  </Page>
  )
})