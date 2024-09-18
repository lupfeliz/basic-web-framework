<template>
  <div class="container input-form">
    <Form ref="form">
      <div class="row">
        <div class="col-2 head">
          아이디
        </div>
        <div class="col">
          <Input
            type="text"
            label="아이디"
            name="userId"
            maxlength="32"
            v-model="userInfo.userId"
            validrules="required|len:4,32"
            />
        </div>
      </div>
      <div class="row">
        <div class="col-2 head">
          비밀번호
        </div>
        <div class="col">
          <Input
            type="password"
            label="비밀번호"
            name="passwd"
            maxlength="32"
            v-model="userInfo.passwd"
            validrules="required|len:4,32"
            />
        </div>
      </div>
      <div class="row">
        <div class="col-2 head">
          로그인
        </div>
        <div class="col">
          <Button
            class="btn-primary mx-1"
            @click="login()"
            >
            로그인
          </Button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { noerr } from '@/libs/commons/constants'
import { inst } from '@/store/commons/basesystem'
import { log } from '@/libs/commons/log'
import { values } from '@/libs/commons/values'
import { apiGet, apiPost } from '@/libs/commons/api'

import Button from '@/components/commons/button.vue'
import Input from '@/components/commons/input.vue'
import Form from '@/components/commons/form.vue'

import { useUserInfo } from '@/store/commons/userinfo'
import { dialog } from '@/libs/commons/dialog'

const self = inst(getCurrentInstance())
const pageTitle = '로그인'

const form = ref()

const userInfo = ref({
  userId: '',
  userNm: '',
  passwd: ''
})

const ustore = useUserInfo()

const login = async () => {
  if (await form.value.validate()) {
    const data = values.clone(userInfo.value)
    data.passwd = values.enc(data.passwd)

    const res = await apiPost({
      act: 'lgn/lgn01001',
      data: data
    }, { noerr })
    if (res?.status === C.SC_OK) {
      ustore.userId = userInfo.value.userId
      ustore.userNm = res.data.userNm
      ustore.expireTime = new Date().getTime() + C.SESSION_TIMEOUT
      await dialog.alert('로그인 되었습니다')
      await self.removeHist()
    } else {
      await dialog.alert('로그인에 실패하였습니다')
    }
  }
}

defineExpose({ pageTitle })
</script>