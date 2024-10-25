/**
 * @File        : smp01001s06.jsx
 * @Author      : 정재백
 * @Since       : 2024-10-25
 * @Description : 샘플6 매크로 테스트페이지
 * @Site        : https://devlog.ntiple.com
 **/

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

export default definePage(() => {
  const self = useSetup({
    name: $PAGENAME$,
    vars: {
    },
    async mounted() {
      log.debug(`${$PAGENAME$} mounted`)
    },
  })
  const { vars } = self()
  return (
    <Container>
      <Button
        >
        OK
      </Button>
    </Container>
  )
})