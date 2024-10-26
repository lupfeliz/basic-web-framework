/**
 * @File        : smp01001s06.jsx
 * @Author      : 정재백
 * @Since       : 2024-10-25
 * @Description : 샘플6 매크로 테스트페이지
 * @Site        : https://devlog.ntiple.com
 **/

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

import EditorClassic from '@/components/editor-classic'

export default definePage(() => {
  const self = useSetup({
    name: $PAGENAME$,
    vars: {
    },
    async mounted() {
      log.debug(`${$PAGENAME$} mounted`)
      try {
      } catch (e) {
        log.debug('E:', e)
      }
    },
  })
  // const [state, setState] = useState(0)
  // useEffect(() => {
  //   let ret = undefined
  //   switch (state) {
  //   case 0: {
  //     setState(state + 1)
  //   } break
  //   case 1: {
  //     for (var itm of document.styleSheets) { for (var v of itm.rules) { console.log('E:', v.selectorText); } }
  //   } break
  //   }
  //   return ret
  // }, [state])

  const { vars } = self()
  // const test2 = () => {
  //   let r = ''
  //   for (var itm of document.styleSheets) { for (var v of itm.rules) { r = `${r} / ${v.selectorText || ''}` } }
  //   return r
  // }
  return (
    <Page>
      <section>
      </section>
      <section>
        <article>
          <Button
            >
            OK
          </Button>
        </article>
      </section>
      <section>
        <article>
          <EditorClassic
            />
        </article>
      </section>
    </Page>
  )
})