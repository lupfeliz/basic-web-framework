<template>
  <div class="container input-form">
    <MyForm ref="form">
      <div class="row">
        <div class="col-2 head">
          아이디
        </div>
        <div class="col">
          <MyInput
            type="text"
            label="아이디"
            name="userId"
            maxlength="32"
            validrules="required|len:4,32"
            />
        </div>
      </div>
      <div class="row">
        <div class="col-2 head">
          비밀번호
        </div>
        <div class="col">
          <MyInput
            type="text"
            label="비밀번호"
            name="password"
            maxlength="32"
            validrules="required|len:4,32"
            />
        </div>
      </div>
    </MyForm>
  </div>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { shared as s, inst } from '@/libs/commons/shared'
import { log } from '@/libs/commons/log'

import MyButton from '@/components/commons/mybutton.vue'
import MyInput from '@/components/commons/myinput.vue'
import MyForm from '@/components/commons/myform.vue'

const self = inst(getCurrentInstance())
const pageTitle = '로그인'
defineExpose({ pageTitle })
</script>