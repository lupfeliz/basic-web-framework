<template>
  <div class="container input-form">
    <MyForm ref="form">
      <div class="row">
        <div class="col-2 head">
          아이디
        </div>
        <div class="col row">
          <div class="col-10"
            >
            <MyInput
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
            <MyButton
              class="btn-secondary"
              @click="checkId()"
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
          <MyInput
            type="password"
            label="비밀번호"
            name="password"
            maxlength="32"
            v-model="user.password"
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
          <MyInput
            type="password"
            label="비밀번호 확인"
            name="passwordCf"
            maxlength="32"
            v-model="map.passwordCf"
            validrules="required|len:4,32|u:passchk"
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
    </MyForm>
  </div>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { inst } from '@/store/commons/basesystem'
import { log } from '@/libs/commons/log'
import { apiGet, apiPut } from '@/libs/commons/api'
import { dialog } from '@/libs/commons/dialog'

import MyButton from '@/components/commons/mybutton.vue'
import MyInput from '@/components/commons/myinput.vue'
import MyForm from '@/components/commons/myform.vue'

const self = inst(getCurrentInstance())

const pageTitle = '회원가입'

const form = ref()

onMounted(async () => {
})

watch(form, _ => {
  form.value.addValidRules({
    passchk: () => {
      if (user.value.password !== map.value.passwordCf) {
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
  passwordCf: ''
})

const user = ref({
  userId: '',
  userNm: '',
  password: ''
})

const checkId = async () => {
  if (user.value.userId) {
    const res = await apiGet({ act: `user/check/${ user.value.userId }` })
    if (res?.data?.check === true) {
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
    const res = await apiPut({ act: 'user', data: user.value })
    if (res?.data) {
      if (await dialog.confirm(`"${user.value.userNm}" 님의 가입이 완료되었어요.<br/> 로그인 하시겠어요?`)) {
        await self.removeHist(1, '/user/login')
      } else {
        await self.removeHist(1, '/')
      }
    }
  }
}

defineExpose({ pageTitle })
</script>