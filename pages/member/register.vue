<template>
  <div class="container board-article">
    <div class="row">
      <div class="col-2 head">
        아이디
      </div>
      <div class="col row">
        <div class="col-10"
          >
          <MyInput
            type="text"
            class="w-full"
            maxlength="32"
            />
        </div>
        <div class="col-2 text-right">
          <MyButton
            class="btn-secondary"
            >
            중복확인
          </MyButton>
        </div>
      </div>
    </div>
    <div class="row editor">
      <div class="col-2 head">
        이름
      </div>
      <div
        class="col"
        >
        <MyInput
          type="text"
          maxlength="32"
          />
      </div>
    </div>
    <div class="row editor">
      <div class="col-2 head">
        비밀번호
      </div>
      <div
        class="col"
        >
        <MyInput
          type="password"
          />
      </div>
    </div>
    <div class="row editor">
      <div class="col-2 head">
        비밀번호 확인
      </div>
      <div
        class="col"
        >
        <MyInput
          type="password"
          />
      </div>
    </div>
    <div class="row">
      <div class="col-2 head">
        가입
      </div>
      <div class="col">
        <MyButton
          class="btn-primary mx-1"
          @click="doRegister()"
          >
          가입
        </MyButton>
        <MyButton
          class="btn-warning mx-1"
          @click="self.goPage(-1)"
          >
          취소
        </MyButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { shared as s, inst } from '@/libs/commons/shared'
import { log } from '@/libs/commons/log'

import MyButton from '@/components/commons/mybutton.vue'
import MyInput from '@/components/commons/myinput.vue'

const self = inst(getCurrentInstance())

const pageTitle = '회원가입'

onMounted(async () => {

})

const doRegister = () => {

}

defineExpose({ pageTitle })
</script>