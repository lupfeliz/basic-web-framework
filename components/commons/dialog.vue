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
          <p v-html="ctx.msg"></p>
          <div class="text-center">
            <template v-if="ctx.type === 1">
              <Button
                class="btn btn-secondary"
                @click="clicked(1)"
                >
                확인
              </Button>
            </template>
            <template v-if="ctx.type === 2">
              <Button
                class="btn btn-primary mx-1"
                @click="clicked(1)"
                >
                확인
              </Button>
              <Button
                class="btn btn-secondary mx-1"
                @click="clicked(2)"
                >
                취소
              </Button>
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
import { shared as s } from '@/libs/commons/shared'
import { bindto } from '@/libs/commons/objbinder'
import Button from '@/components/commons/button.vue'

const modal = ref()

const ctx = ref({} as any)

let $modal: any

onBeforeMount(async () => {
})

onMounted(async () => {
  $modal = new s.bootstrap.Modal(modal.value)
  dialog.alert = alert
  dialog.confirm = confirm
})

const alert = (msg: String) => {
  return new Promise<boolean>((resolve, reject) => {
    bindto(ctx.value, {
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
    bindto(ctx.value, {
      msg: msg,
      type: 1,
      resolve: resolve,
      reject: reject
    })
    $modal.show()
  })
}

const clicked = async (cmd: any) => {
  switch (ctx.value.type) {
  case 1:
    if (ctx.value.resolve) { ctx.value.resolve(true) }
    break
  case 2:
    if (ctx.value.resolve) { ctx.value.resolve(cmd === 1 ? true : false) }
    break
  }
  values.clear(ctx.value)
  $modal.hide()
}
</script>