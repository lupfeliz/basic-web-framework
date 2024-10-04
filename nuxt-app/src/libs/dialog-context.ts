import { dialogContext } from '@/libs/dialog-context';
import * as C from '@/libs/constants'
import log from '@/libs/log'

const ctx = reactive({
  modal: {
    element: {} as any as Element,
    instance: {} as any,
    current: {} as any,
    queue: [] as any[]
  },
  progress: {
    element: {} as any as Element,
    instance: {} as any,
    current: {} as any,
    queue: [] as any[]
  }
})

const dialog = {
  alert: (msg: string) => new Promise<boolean>((resolve) => {
    ctx.modal.queue.push({
      type: C.ALERT,
      msg: msg,
      resolve
    })
  }),
  confirm: (msg: string) => new Promise<boolean>((resolve) => {
    ctx.modal.queue.push({
      type: C.CONFIRM,
      msg: msg,
      resolve
    })
  }),
  progress: (vis?: boolean, timeout?: number) => new Promise<void>((resolve) => {
    if (vis === undefined) { vis = true }
    ctx.progress.queue.push({
      vis: vis,
      timeout: timeout,
      resolve
    })
  }),
}

export default dialog
export { ctx as dialogContext }