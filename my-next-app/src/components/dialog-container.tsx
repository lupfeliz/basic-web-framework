/**
 * @File        : dialog-container.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-07
 * @Description : 단순대화창 모음 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import dialog from '@/libs/dialog-context'
import userContext from '@/libs/user-context'
import format from '@/libs/format'
import values from '@/libs/values'

import { Dialog, Content, Button } from '@/components'

const { concat } = values

const dstate = () => dialog.getDialogState()

const formatTime = (v: number, fmt: string = C.UNDEFINED) => {
  let ret = ''
  const diff = Math.floor(v / 1000)
  let minute = Math.floor(diff / 60)
  let second = diff - (minute * 60)
  if (minute < 0 || second < 0) { second = 0 }
  if (minute <= 0) { minute = 0 }
  let mstr = `${format.pad(minute, 2, '0')}`
  let sstr = `${format.pad(second, 2, '0')}`
  ret = fmt ? fmt : 'mm:ss'
  ret = ret.replace(/mm/g, mstr || '')
  ret = ret.replace(/ss/g, sstr || '')
  return ret
}

const authConfirm = async (v: number) => {
  switch(v) {
  case 1: {
    // await userContext.checkLogin()
    setTimeout(() => dialog.authModal({ visible: false }), 500)
  } break
  case 2: {
    dialog.authModal({ visible: false })
    await userContext.logout(true)
  } break
  }
}

const { defineComponent, useSetup, useRef } = app

export default defineComponent((props: any, ref?: any) => {
  const self = useSetup({
    vars: {
      modal: {
        element: {} as any
      },
      progress: {
        element: {} as any
      },
      authmodal: {
        element: {} as any
      },
    },
    async mounted({ releaser }) {
      releaser(dialog.subscribe(() => update(C.UPDATE_SELF)))
      releaser(userContext.subscribe(() => update(C.UPDATE_SELF)))
    },
    async unmount() {
    }
  })
  const { vars, update } = self()
  vars.modal.element = useRef<HTMLElement>(null)
  vars.progress.element = useRef<HTMLElement>(null)
  vars.authmodal.element = useRef<HTMLElement>(null)
  return (
    <>
    <Dialog
      className='modal_alert'
      open={ dstate().modal.visible }
      onClosed={ () => { dialog.modal({ type: C.EVENT, value: 2 }) } }
      >
      <Dialog.Content>
        <Content
          html={ dstate().modal.message }
          />
      </Dialog.Content>
      <Dialog.Actions>
        { dstate().modal.buttons.map((itm: any, inx: number) => (
          <Button
            className={ concat(' ', 0, 'btn', inx == 0 ? 'primary' : '') }
            key={ inx }
            onClick={ () => { dialog.modal({ type: C.CLICK, value: inx }) } }
            >
            { itm.text }
          </Button>
        )) }
      </Dialog.Actions>
    </Dialog>
    <Dialog.Backdrop
      sx={ { color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 } }
      ref={ vars.progress.element }
      open={ dstate().progress.visible }
      onEntered={ () => { dialog.progress({ type: C.EVENT, value: 1 }) } }
      onExited={ () => { dialog.progress({ type: C.EVENT, value: 2 }) } }
      >
      {/* <Spinner /> */}
    </Dialog.Backdrop>
    <Dialog
      open={ dstate().authmodal.visible }
      className={ 'no-tran auth-modal modal_alert' }
      // ref = { ctx.authmodal.element }
      >
      <Dialog.Content>
        <Content
          html={ `<h4>사용자 인증이 #(min)분 안에 종료됩니다 <br/> 연장하시겠어요?</h4>`
            .replace(/\#\(min\)/g, formatTime(C.EXPIRE_NOTIFY_TIME, 'mm')) }
          />
        <p>
          남은시간 { formatTime(userContext.getUserInfo().accessToken.expireTime - new Date().getTime()) }
        </p>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          className='btn primary'
          onClick={ () => authConfirm(1) }
          >
          예
        </Button>
        <Button
          className='btn'
          onClick={ () => authConfirm(2) }
          >
          아니오
        </Button>
      </Dialog.Actions>
    </Dialog>
    </>
  )
})