<template>
  <div
    ref="modal"
    class="modal fade no-tran com-dialog"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
    >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <p v-html="ctx.modal.current?.msg"></p>
          <div class="text-center">
            <template v-if="ctx.modal.current?.type === C.ALERT">
              <Button
                class="btn btn-primary"
                @click="click(1)"
                >
                확인
              </Button>
            </template>
            <template v-if="ctx.modal.current?.type === C.CONFIRM">
              <Button
                class="btn btn-primary mx-1"
                @click="click(1)"
                >
                확인
              </Button>
              <Button
                class="btn btn-secondary mx-1"
                @click="click(2)"
                >
                취소
              </Button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    ref="progress"
    class="modal fade no-tran com-progress"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-hidden="true"
    >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="spinner-border" role="status">
          <span class="visually-hidden"></span>
        </div>
        <div>
          잠시만 기다려 주세요...
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import * as C from '@/libs/constants'
import log from '@/libs/log'
import values from '@/libs/values'
import { useBaseSystem, inst } from '@/store/commons/basesystem'
import Button from '@/components/button.vue'
import dialog from '@/libs/dialog'

const M_SHOWN = 'shown.bs.modal'
const M_HIDDEN = 'hidden.bs.modal'

const self = inst(getCurrentInstance())
const sys = useBaseSystem()
const ctx = sys.dialogContext

const modal = ref()
const progress = ref()

watch(() => sys.dialogContext.modal.queue.length, (n, o) => {
  if (o == 0 && n > 0) { doModal() }
})

watch(() => sys.dialogContext.progress.queue.length, (n, o) => {
  if (o == 0 && n > 0) { doOverlay() }
})

onBeforeMount(async () => {
  const bootstrap = await import ('bootstrap')

  ctx.modal.element = modal.value
  ctx.progress.element = progress.value

  ctx.modal.instance = new bootstrap.Modal(modal.value)
  ctx.progress.instance = new bootstrap.Modal(progress.value)

  progress.value.addEventListener(M_SHOWN, progressVisibleHandler)
  progress.value.addEventListener(M_HIDDEN, progressVisibleHandler)
  modal.value.addEventListener(M_HIDDEN, doModal)
  doOverlay()
  doModal()
})

onBeforeUnmount(async () => {
  progress.value.removeEventListener(M_SHOWN, progressVisibleHandler)
  progress.value.removeEventListener(M_HIDDEN, progressVisibleHandler)
  modal.value.removeEventListener(M_HIDDEN, doModal)
})

const progressVisibleHandler = (e: any) => {
  const current = ctx.progress.current
  if (current?.resolve) {
    current.resolve()
    values.clear(current)
    current.state = e.type
  }
  doOverlay()
}

const click = async (cmd: any) => {
  const modal = ctx.modal
  switch (modal.current.type) {
  case C.ALERT:
    if (modal.current.resolve) { modal.current.resolve(true) }
    break
  case C.CONFIRM:
    if (modal.current.resolve) { modal.current.resolve(cmd === 1 ? true : false) }
    break
  }
  values.clear(modal.current)
  modal.instance.hide()
}

const doOverlay = () => {
  nextTick(() => {
    const progress = ctx.progress
    if (!progress.instance.show) { return }
    if (progress.current.resolve) { return }
    if (progress.queue.length > 0) {
      const item: any = progress.queue.splice(0, 1)[0]
      if (
        (progress.current.state == M_SHOWN && item.vis) ||
        (progress.current.state == M_HIDDEN && !item.vis)) {
        nextTick(doOverlay)
        return
      }
      progress.current = item
      if (item.vis) {
        if (!isNaN(Number(item.timeout))) {
          setTimeout(() => {
            dialog.progress(false)
          }, Number(item.timeout))
        }
        progress.instance.show()
      } else {
        progress.instance.hide()
      }
    }
  })
}

const doModal = () => {
  nextTick(() => {
    const modal = ctx.modal
    if (!modal.instance.show) { return }
    if (modal.queue.length > 0) {
      const item: any = modal.queue.splice(0, 1)[0]
      modal.current = item
      modal.instance.show()
    }
  })
}
</script>