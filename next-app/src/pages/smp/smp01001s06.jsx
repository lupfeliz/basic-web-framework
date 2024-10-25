/**
 * @File        : smp01001s06.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 샘플4
 * @Site        : https://devlog.ntiple.com
 **/

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

const PAGENAME = 'smp01001s06'
const log = getLogger(PAGENAME)

export default definePage(() => {
  const self = useSetup({
    name: PAGENAME,
    vars: {
    },
    async mounted() {
      log.debug(`${PAGENAME} mounted`)
    },
  })
  const { vars } = self()
  return (
    <>
    </>
  )
})