<script setup lang="ts">
import Button from '@/components/button.vue'
import dialog from '@/libs/dialog-context'
import log from '@/libs/log'
import app from '@/libs/app-context'
import { inst } from '@/store/commons/basesystem'

const self = inst(getCurrentInstance())
const pageTitle = ref('메인페이지')

const onClickProc = async (e: any) => {
  self.goPage('/atc/atc01001s04/1')
}

defineExpose({ pageTitle })
</script>
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
    @click="dialog.progress(true, 2000)"
    >
    테스트(OVERLAY)
  </Button>
</div>
</template>