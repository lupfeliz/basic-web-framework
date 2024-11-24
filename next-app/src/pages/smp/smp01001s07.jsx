/**
 * @File        : smp01001s07.jsx
 * @Author      : 정재백
 * @Since       : 2024-11-24
 * @Description : 샘플7 웹소켓 샘플
 * @Site        : https://devlog.ntiple.com
 **/

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

/* #MACRO-DEFINE# 이 부분은 미리 만들어진 선언문으로 대체된다 */

export default definePage(() => {
  const headers = {
  }
  const setup = useSetup({
    name: $PAGENAME$,
    vars: {
      client: C.UNDEFINED
    },
    async mounted() {
      const socket = new SockJS(`/api/ws`)
      const client = Stomp.over(socket)
      vars.client = client
      client.debug = () => {}
      client.connect(headers, async (frame) => {
        log.debug('STOMP!!!!', frame)
        /** TODO: 공용채널과 개인채널을 따로 열어 데이터를 전송한다. */
        subscribe(1)
        subscribe(2)
      },
      (e) => {
        log.debug('DISCONNECTED...', e)
      })
    },
  })

  const { vars } = setup()
  const onClick = async (num) => {
    vars.client.send(`/api/pub/chat/test${num}`, {}, '{}')
  }
  const subscribe = (channel) => {
    log.debug(`SUB`, channel)
    vars.client.subscribe(`/api/sub/chat/test${channel}`,
      (msg) => {
        log.debug(`SUBSCRIBE-${channel}...`, msg, vars.client.subscriptions)
      },
      { id: `sub-${channel}` }
    )
  }
  return (
    <Page>
      <section className='my-3'>
      </section>
      <h6>TEST</h6>
      <hr/>
      <section className='my-3'>
        <article>
          <Button
            className='mx-1'
            variant='primary'
            onClick={ () => onClick(1) }
            >
            SEND1
          </Button>
          <Button
            className='mx-1'
            variant='primary'
            onClick={ () => onClick(2) }
            >
            SEND2
          </Button>
          <Button
            className='mx-1'
            variant='primary'
            onClick={ () => subscribe(2) }
            >
            SUBSCRIBE
          </Button>
        </article>
      </section>
    </Page>
  )
})