/**
 * @File        : smp01001s07.jsx
 * @Author      : 정재백
 * @Since       : 2024-11-24
 * @Description : 샘플7 웹소켓 샘플
 * @Site        : https://devlog.ntiple.com
 **/

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

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
      // const socket = new SockJS(`http://devsup.ntiple.com:10002/api/ws`)
      const socket = new SockJS(`/api/ws`)
      vars.client = Stomp.over(socket)
      vars.client.connect(headers, (frame) => {
          log.debug("STOMP!!!!");
          vars.client.subscribe(`/api/sub/chat/test`,
            (msg) => {
              log.debug('SUBSCRIBED...', msg)
            },
            headers
          );
        },
        (e) => {
          log.debug('DISCONNECTED...', e)
        }
      )
    },
  })

  const { vars } = setup()
  const onClick = async () => {
    vars.client.send(`/api/pub/chat/test`, {}, '{}')
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
            variant='primary'
            onClick={ onClick }
            >
            SEND
          </Button>
        </article>
      </section>
    </Page>
  )
})