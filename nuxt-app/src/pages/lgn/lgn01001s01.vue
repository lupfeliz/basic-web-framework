<script setup lang="ts">
import * as C from '@/libs/constants'
import { inst } from '@/store/commons/basesystem'
import log from '@/libs/log'
import values from '@/libs/values'
import api from '@/libs/api'

import Button from '@/components/button.vue'
import Input from '@/components/input.vue'
import Form from '@/components/form.vue'

import { useUserInfo, type UserInfoType } from '@/store/commons/userinfo'
import dialog from '@/libs/dialog-context'

const self = inst(getCurrentInstance())
const pageTitle = '로그인'

const form = ref()

const userInfo = ref({
  userId: '',
  userNm: '',
  passwd: ''
})

const login = async () => {
  const ustore = useUserInfo()
  if (await form.value.validate()) {
    const data = values.clone(userInfo.value)
    // data.passwd = values.enc(data.passwd)
    data.passwd = ''

    const res = await api.post('lgn01001', data, { noerr: true })
    ustore.userId = userInfo.value.userId
    ustore.userNm = res.userNm
    ustore.expireTime = new Date().getTime() + C.SESSION_TIMEOUT
    await dialog.alert('로그인 되었습니다')
    await self.removeHist()
    // await dialog.alert('로그인에 실패하였습니다')
  }
}

defineExpose({ pageTitle })
</script>
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