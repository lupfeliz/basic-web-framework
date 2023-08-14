<template>
<div class="text-center">
  <MyButton
    class="btn-primary mx-1"
    @click="onClickProc"
    >
    게시판으로 이동
  </MyButton>

  <MyButton
    class="btn-secondary mx-1"
    @click="dialog.alert('테스트')"
    >
    테스트(ALERT)
  </MyButton>

  <MyButton
    class="btn-secondary mx-1"
    @click="dialog.overlay(true, 2000)"
    >
    테스트(OVERLAY)
  </MyButton>
</div>
</template>
<script setup lang="ts">
import MyButton from '@/components/commons/mybutton.vue'
import { dialog } from '@/libs/commons/dialog'
import { log } from '@/libs/commons/log'
import { inst } from '@/store/commons/basesystem'

const self = inst(getCurrentInstance())
const pageTitle = ref('메인페이지')

const onClickProc = async (e: any) => {
  self.goPage('/board/list')
}

defineExpose({ pageTitle })
</script>