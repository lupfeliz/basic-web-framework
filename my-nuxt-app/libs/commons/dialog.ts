import { dialogContext } from '@/libs/commons/dialog';
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'

const ctx = reactive({
  modal: {
    element: {} as any as Element,
    instance: {} as any,
    current: {} as any,
    queue: [] as any[]
  },
  overlay: {
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
  overlay: (vis?: boolean, timeout?: number) => new Promise<void>((resolve) => {
    if (vis === undefined) { vis = true }
    ctx.overlay.queue.push({
      vis: vis,
      timeout: timeout,
      resolve
    })
  }),
}

export { dialog, ctx as dialogContext }