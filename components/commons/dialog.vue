<template>
  <div
    ref="modal"
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
    >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <p v-html="dialogCtx.msg"></p>
          <div class="text-center">
            <template v-if="dialogCtx.type === 1">
              <MyButton
                class="btn btn-secondary"
                @click="clicked(1)"
                >
                확인
              </MyButton>
            </template>
            <template v-if="dialogCtx.type === 2">
              <MyButton
                class="btn btn-primary mx-1"
                @click="clicked(1)"
                >
                확인
              </MyButton>
              <MyButton
                class="btn btn-secondary mx-1"
                @click="clicked(2)"
                >
                취소
              </MyButton>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import { log } from '@/libs/commons/log'
import { values } from '@/libs/commons/values'
import { dialog } from '@/libs/commons/dialog'
import { useBaseSystem } from '@/store/commons/basesystem'
import { bindto } from '@/libs/commons/objbinder'
import MyButton from '@/components/commons/mybutton.vue'

const modal = ref()

const dialogCtx = ref({} as any)

const bssys = useBaseSystem()

let $modal: any

onBeforeMount(async () => {
})

onMounted(async () => {
  $modal = new bssys.bootstrap.Modal(modal.value)
  dialog.alert = alert
  dialog.confirm = confirm
})

const alert = (msg: String) => {
  return new Promise<boolean>((resolve, reject) => {
    bindto(dialogCtx.value, {
      msg: msg,
      type: 1,
      resolve: resolve,
      reject: reject
    })
    $modal.show()
  })
}

const confirm = (msg: String) => {
  return new Promise<boolean>((resolve, reject) => {
    bindto(dialogCtx.value, {
      msg: msg,
      type: 2,
      resolve: resolve,
      reject: reject
    })
    $modal.show()
  })
}

const clicked = async (cmd: any) => {
  switch (dialogCtx.value.type) {
  case 1:
    if (dialogCtx.value.resolve) { dialogCtx.value.resolve(true) }
    break
  case 2:
    if (dialogCtx.value.resolve) { dialogCtx.value.resolve(cmd === 1 ? true : false) }
    break
  }
  values.clear(dialogCtx.value)
  $modal.hide()
}
</script>