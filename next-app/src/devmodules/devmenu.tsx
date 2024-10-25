/**
 * @File        : devmenu.tsx
 * @Author      : 정재백
 * @Since       : 2024-10-26
 * @Description : 개발메뉴 컴포넌트. 개발시에만 보여진다.
 * @Site        : https://devlog.ntiple.com
 **/

import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import dialog from '@/libs/dialog-context'
import type { MouseEvent } from 'react'
import { Modal, Content, Block, Button } from '@/components'
import $ from 'jquery'

const COMPONENT = 'devmenu'
const { defineComponent, getLogger, useSetup, useRef } = app
const log = getLogger(COMPONENT)

export default defineComponent(() => {
  const self = useSetup({
    name: COMPONENT,
    vars: {
      menubtn: true,
      modal: {
        visible: false,
        element: useRef(),
      }
    },
    async mounted() {
      setTimeout(() => {
        log.debug('LOG-NS:', log.getNamespaces())
      }, 1000)
    }
  })
  const { vars, update } = self()
  const onClick = async (e: MouseEvent) => {
    vars.modal.visible = true
    update(C.UPDATE_SELF)
  }
  const controlMenu = async (state: number) => {
    switch(state) {
    case -1: {
      vars.modal.visible = false
    } break
    }
    update(C.UPDATE_SELF)
  }
  const dowork = async (prm: any) => {
    switch (prm?.job || '') {
    case 'hide-menu': {
      if (await dialog.confirm(`개발자 전용 플로팅 메뉴를 제거하시겠어요?`)) {
        vars.menubtn = false
      }
    } break }
    update(C.UPDATE_SELF)
  }
  return (
    <>
      { vars.menubtn && (
      <div id='__DEVMODULE_MENU__'>
        <a
          title='개발자 전용 메뉴'
          onClick={ onClick }
          >
          ＃
        </a>
        <Modal
          id='__DEVMODULE_MENU_MODAL__'
          show={ vars.modal.visible }
          ref={ vars.modal.element }
          >
          <Modal.Body>
            <h5> 개발자 전용 메뉴 </h5>
            <hr />
            <section>
            <Block>
              <ul className={ 'devmenu-list' }>
                <li> 환경설정 (WIP) </li>
                <li> 로그제어 (WIP) </li>
                <li> API제어 (WIP) </li>
                <li>
                  <a
                    onClick={ () => dowork({ job: 'hide-menu' }) }
                    >
                    플로팅메뉴 숨김
                  </a>
                </li>
              </ul>
            </Block>
            </section>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='primary'
              onClick={ () => controlMenu(-1) }
              >
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      ) }
    </>
  )
})


