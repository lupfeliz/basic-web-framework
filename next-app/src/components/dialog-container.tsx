/**
 * @File        : dialog-container.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-07
 * @Description : 단순대화창 모음 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import $ from 'jquery'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import dialog from '@/libs/dialog-context'
import userContext from '@/libs/user-context'
import format from '@/libs/format'
import values from '@/libs/values'

import { Modal, Content, Button, Spinner } from '@/components'
import { RefObject } from 'react'

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

const COMPONENT = 'dialog-container'
const { defineComponent, useSetup, useRef, getLogger } = app
const log = getLogger(COMPONENT)

export default defineComponent((props: any, ref?: any) => {
  const self = useSetup({
    name: COMPONENT,
    vars: {
      modal: {
        element: C.UNDEFINED as RefObject<HTMLElement>
      },
      progress: {
        element: C.UNDEFINED as RefObject<HTMLElement>
      },
      authmodal: {
        element: C.UNDEFINED as RefObject<HTMLElement>
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
    <Modal
      className='modal_alert'
      show={ dstate().modal.visible }
      onEntered={ () => { dialog.modal({ type: C.EVENT, value: 1 }) } }
      onExited={ () => { dialog.modal({ type: C.EVENT, value: 2 }) } }
      animation={ true }
      ref={ vars.modal.element }
      >
      <Modal.Body>
        <Content
          html={ dstate().modal.message }
          />
      </Modal.Body>
      <Modal.Footer>
        { dstate().modal.buttons.map((itm: any, inx: number) => (
          <Button
            className={ concat(' ', 0, 'btn', inx == 0 ? 'primary' : '') }
            key={ inx }
            onClick={ () => { dialog.modal({ type: C.CLICK, value: inx }) } }
            >
            { itm.text }
          </Button>
        )) }
      </Modal.Footer>
    </Modal>
    <Modal
      show={ dstate().progress.visible }
      className={ 'no-tran progress-spinner' }
      onEntered={ () => { dialog.progress({ type: C.EVENT, value: 1 }) } }
      onExited={ () => { dialog.progress({ type: C.EVENT, value: 2 }) } }
      animation={ true }
      ref={vars.progress.element}
      >
      <Spinner/>
    </Modal>
    <Modal
      open={ dstate().authmodal.visible }
      className={ 'no-tran auth-modal modal_alert' }
      ref={vars.authmodal.element}
      >
      <Modal.Body>
        <Content
          html={ `<h4>사용자 인증이 #(min)분 안에 종료됩니다 <br/> 연장하시겠어요?</h4>`
            .replace(/\#\(min\)/g, formatTime(C.EXPIRE_NOTIFY_TIME, 'mm')) }
          />
        <p>
          남은시간 { formatTime(userContext.getUserInfo().accessToken.expireTime - new Date().getTime()) }
        </p>
      </Modal.Body>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
    </>
  )
})