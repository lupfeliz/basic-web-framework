<template>
  <div class="container input-form">
    <Form ref="form">
      <div class="row">
        <div class="col-2 head">
          아이디
        </div>
        <div class="col row">
          <div class="col-10"
            >
            <Input
              type="text"
              label="아이디"
              name="userId"
              maxlength="32"
              v-model="user.userId"
              validrules="required|len:4,32|u:dupchk"
              @update:model-value="idChanged"
              />
              <span v-if="map.dupchk >= 2">사용 가능한 아이디 입니다</span>
          </div>
          <div class="col-2 text-right">
            <Button
              class="btn-secondary"
              @click="checkId()"
              >
              중복확인
            </Button>
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
          <Input
            type="text"
            label="이름"
            name="userNm"
            maxlength="32"
            v-model="user.userNm"
            validrules="required|len:2,32"
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
          <Input
            type="password"
            label="비밀번호"
            name="passwd"
            maxlength="32"
            v-model="user.passwd"
            validrules="required|len:4,32"
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
          <Input
            type="password"
            label="비밀번호 확인"
            name="passwdCf"
            maxlength="32"
            v-model="map.passwdCf"
            validrules="required|len:4,32|u:passchk"
            />
        </div>
      </div>
      <div class="row">
        <div class="col-2 head">
          가입
        </div>
        <div class="col">
          <Button
            class="btn-primary mx-1"
            @click="doRegister()"
            >
            가입
          </Button>
          <Button
            class="btn-warning mx-1"
            @click="self.goPage(-1)"
            >
            취소
          </Button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script setup lang="ts">
import * as C from '@/libs/constants'
import { inst } from '@/store/commons/basesystem'
import log from '@/libs/log'
import values from '@/libs/values'
import api from '@/libs/api'
import dialog from '@/libs/dialog'

import Button from '@/components/button.vue'
import Input from '@/components/input.vue'
import Form from '@/components/form.vue'

const self = inst(getCurrentInstance())

const pageTitle = '회원가입'

const form = ref()

onMounted(async () => {
})

watch(form, _ => {
  form.value.addValidRules({
    passchk: () => {
      if (user.value.passwd !== map.value.passwdCf) {
        return '비밀번호가 맞지 않습니다'
      }
      return true
    },
    dupchk: () => {
      switch (map.value.dupchk) {
        case 2: break
        case 1: return `"${user.value.userId}" 는 중복된 아이디 입니다`
        case undefined: case 0: default: return '중복확인 버튼을 클릭해 주세요'
      }
      return true
    }
  })
})


const map = ref({
  dupchk: 0,
  passwdCf: ''
})

const user = ref({
  userId: '',
  userNm: '',
  passwd: ''
})

const checkId = async () => {
  if (user.value.userId) {
    const data = await api.get(`usr01001/${user.value.userId}`, {})
    if (data?.check === true) {
      map.value.dupchk = 2
    } else {
      map.value.dupchk = 1
    }
  }
  await form.value.validateField('userId')
}

const idChanged = async (e: any) => { map.value.dupchk = 0 }

const doRegister = async () => {
  if (await form.value.validate()) {
    const data = values.clone(user.value)
    // data.passwd = values.enc(data.passwd)
    data.passwd = ''
    const res = await api.put('usr01001', data)
    if (await dialog.confirm(`"${user.value.userNm}" 님의 가입이 완료되었어요.<br/> 로그인 하시겠어요?`)) {
      await self.removeHist(1, '/user/login')
    } else {
      await self.removeHist(1, '/')
    }
  }
}

defineExpose({ pageTitle })
</script>