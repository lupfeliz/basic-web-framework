<template>
<div class="text-center">
  <Button
    class="btn-primary mx-1"
    @click="onClickProc"
    >
    게시판으로 이동
  </Button>

  <Button
    class="btn-secondary mx-1"
    @click="dialog.alert('테스트')"
    >
    테스트(ALERT)
  </Button>

  <Button
    class="btn-secondary mx-1"
    @click="dialog.overlay(true, 2000)"
    >
    테스트(OVERLAY)
  </Button>
</div>
</template>
<script setup lang="ts">
import Button from '@/components/commons/button.vue'
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