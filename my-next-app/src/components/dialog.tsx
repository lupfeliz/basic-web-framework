/**
 * @File        : dialog.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 대화창 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
'use client'
import _Dialog, { DialogProps as _DialogProps } from '@mui/material/Dialog'
import _DialogTitle from '@mui/material/DialogTitle'
import _DialogContent from '@mui/material/DialogContent'
import _DialogContentText from '@mui/material/DialogContentText'
import _DialogActions from '@mui/material/DialogActions'
import _Backdrop from '@mui/material/Backdrop'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'
type DialogProps = _DialogProps & {
  onClosed?: Function
}

const { defineComponent, copyExclude, useSetup } = app
export default defineComponent((props: DialogProps, ref: DialogProps['ref']) => {
  const pprops = copyExclude(props, ['onClosed']) as _DialogProps

  const self = useSetup({
    async updated() {
      update(C.UPDATE_SELF)
    }
  })

  const { update } = self()

  /** Material-UI 의 경우 별도 종료이벤트가 없으므로 transition 종료시점을 사용한다. */
  const onTransitionExited = async () => {
    if (props.onTransitionExited) { props.onTransitionExited() }
    if (props.onClosed) { props.onClosed() }
  }
  return (
    <>
    <_Dialog
      onTransitionExited={ onTransitionExited }
      ref={ ref }
      { ...pprops }
      >
      { pprops.children }
    </_Dialog>
    </>
  )
}, {
  displayName: 'dialog',
  Title: _DialogTitle,
  Content: _DialogContent,
  ContentText: _DialogContentText,
  Actions: _DialogActions,
  Backdrop: _Backdrop
})