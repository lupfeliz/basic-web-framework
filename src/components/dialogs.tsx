import app from '@/libs/app-context'
import { Dialog, DialogContent, DialogActions, Backdrop } from '@mui/material'
import { ComponentPropsWithRef } from 'react'
const { defineComponent, useSetup } = app
type DialogsProps = ComponentPropsWithRef<'div'> & { }
export default defineComponent((props: DialogsProps) => {
  const mounted = async () => {
  }
  useSetup({ mounted })
  return (
    <>
      <Dialog
        open={ false }
        >
      </Dialog>
    </>
  )
})