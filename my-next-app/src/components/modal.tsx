/**
 * @File        : dialog.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 대화창 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
'use client'
// import _Dialog, { DialogProps as _DialogProps } from '@mui/material/Dialog'
// import _DialogTitle from '@mui/material/DialogTitle'
// import _DialogContent from '@mui/material/DialogContent'
// import _DialogContentText from '@mui/material/DialogContentText'
// import _DialogActions from '@mui/material/DialogActions'
// import _Backdrop from '@mui/material/Backdrop'

import _Modal from 'react-bootstrap/Modal'

import * as C from '@/libs/constants'
import app from '@/libs/app-context'
type DialogProps = {
  onClosed?: Function
} & any

const { defineComponent, copyExclude, useSetup } = app
export default defineComponent((props: DialogProps, ref: DialogProps['ref']) => {
  const pprops = copyExclude(props, ['onClosed']) as DialogProps

  const self = useSetup({
    async updated() {
      update(C.UPDATE_SELF)
    }
  })

  const { update } = self()

  /** Material-UI 의 경우 별도 종료이벤트가 없으므로 transition 종료시점을 사용한다. */
  // const onTransitionExited = async () => {
  //   if (props.onTransitionExited) { props.onTransitionExited() }
  //   if (props.onClosed) { props.onClosed() }
  // }
  return (
    <>
    <_Modal
      // onTransitionExited={ onTransitionExited }
      onExited={ props?.onExited }
      ref={ ref }
      { ...pprops }
      >
      { pprops.children }
    </_Modal>
    </>
  )
}, {
  displayName: 'modal',
  // Title: _Modal.Title,
  // Content: _Modal.Body,
  // ContentText: _Modal.Body,
  // Actions: _Modal.Footer,
  // Backdrop: _Modal.Body,
  Body: _Modal.Body,
  Header: _Modal.Header,
  Title: _Modal.Title,
  Footer: _Modal.Footer,
  Dialog: _Modal.Dialog,
  TRANSITION_DURATION: _Modal.TRANSITION_DURATION,
  BACKDROP_TRANSITION_DURATION: _Modal.BACKDROP_TRANSITION_DURATION
})