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
              <MyButton
                class="btn btn-primary"
                @click="click(1)"
                >
                확인
              </MyButton>
            </template>
            <template v-if="ctx.modal.current?.type === C.CONFIRM">
              <MyButton
                class="btn btn-primary mx-1"
                @click="click(1)"
                >
                확인
              </MyButton>
              <MyButton
                class="btn btn-secondary mx-1"
                @click="click(2)"
                >
                취소
              </MyButton>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    ref="overlay"
    class="modal fade no-tran com-overlay"
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

import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { values } from '@/libs/commons/values'
import { useBaseSystem, inst } from '@/store/commons/basesystem'
import MyButton from '@/components/commons/mybutton.vue'
import { over } from 'lodash'
import { dialog } from '@/libs/commons/dialog'

const M_SHOWN = 'shown.bs.modal'
const M_HIDDEN = 'hidden.bs.modal'

const self = inst(getCurrentInstance())
const sys = useBaseSystem()
const ctx = sys.dialogContext

const modal = ref()
const overlay = ref()

watch(() => sys.dialogContext.modal.queue.length, (n, o) => {
  if (o == 0 && n > 0) { doModal() }
})

watch(() => sys.dialogContext.overlay.queue.length, (n, o) => {
  if (o == 0 && n > 0) { doOverlay() }
})

onBeforeMount(async () => {
  const bootstrap = await import ('bootstrap')

  ctx.modal.element = modal.value
  ctx.overlay.element = overlay.value

  ctx.modal.instance = new bootstrap.Modal(modal.value)
  ctx.overlay.instance = new bootstrap.Modal(overlay.value)

  overlay.value.addEventListener(M_SHOWN, overlayVisibleHandler)
  overlay.value.addEventListener(M_HIDDEN, overlayVisibleHandler)
  modal.value.addEventListener(M_HIDDEN, doModal)
  doOverlay()
  doModal()
})

onBeforeUnmount(async () => {
  overlay.value.removeEventListener(M_SHOWN, overlayVisibleHandler)
  overlay.value.removeEventListener(M_HIDDEN, overlayVisibleHandler)
  modal.value.removeEventListener(M_HIDDEN, doModal)
})

const overlayVisibleHandler = (e: any) => {
  const current = ctx.overlay.current
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
    const overlay = ctx.overlay
    if (!overlay.instance.show) { return }
    if (overlay.current.resolve) { return }
    if (overlay.queue.length > 0) {
      const item: any = overlay.queue.splice(0, 1)[0]
      if (
        (overlay.current.state == M_SHOWN && item.vis) ||
        (overlay.current.state == M_HIDDEN && !item.vis)) {
        nextTick(doOverlay)
        return
      }
      overlay.current = item
      if (item.vis) {
        if (!isNaN(Number(item.timeout))) {
          setTimeout(() => {
            dialog.overlay(false)
          }, Number(item.timeout))
        }
        overlay.instance.show()
      } else {
        overlay.instance.hide()
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