/**
 * @File        : smp01001s06.jsx
 * @Author      : 정재백
 * @Since       : 2024-10-25
 * @Description : 샘플6 매크로 테스트페이지
 * @Site        : https://devlog.ntiple.com
 **/

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

import $ from 'jquery'

export default definePage(() => {
  const self = useSetup({
    name: $PAGENAME$,
    vars: {
      portal: useRef()
    },
    async mounted() {
      log.debug(`${$PAGENAME$} mounted`)
      try {
      } catch (e) {
        log.debug('E:', e)
      }
    },
  })

  const { vars } = self()
  return (
    <Page>
      <section className='my-3'>
      </section>
      <h6>TEST</h6>
      <hr/>
      <section className='my-3'>
        <article>
          <Button
            >
            OK
          </Button>
        </article>
      </section>
      <h6>PORTAL</h6>
      <hr/>
      <section>
        <article
          id='portal'
          // ref={ (app.global['test'] = useRef()) }
          // ref={ useGlobalRef('test') }
          ref={ vars.portal }
          >
        </article>
      </section>
      <h6>ORIGIN</h6>
      <hr/>
      <section>
        <article>
          <Portal
            // dest={ app.global['test'] }
            dest={ vars.portal }
            // dest={ isClient() && document.querySelector('#portal') }
            // dest={ isClient() && $('#portal') }
            >
            이것은 PORTAL 의 내용입니다
          </Portal>
        </article>
      </section>
    </Page>
  )
})