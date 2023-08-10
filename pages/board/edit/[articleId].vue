<template>
  <div class="container board-article">
    <MyForm ref="form">
      <div class="row">
        <div class="col-2 head">
          제목
        </div>
        <div class="col">
          <MyInput
            type="text"
            name="title"
            label="제목"
            v-model="article.title"
            validrules="required|len:2,255"
            />
        </div>
      </div>
      <div class="row content editor">
        <div class="col-2 head">
          내용
        </div>
        <div
          class="col"
          >
          <MyEditor
            label="내용"
            name="contents"
            v-model="article.contents"
            validrules="required|content-len:5,4000"
            />
        </div>
      </div>
      <div class="row">
        <div class="col-2 head">
          {{ articleId ? '수정' : '작성' }}
        </div>
        <div class="col">
          <MyButton
            class="btn-primary mx-1"
            @click="putArticle()"
            >
            {{ articleId ? '수정완료' : '작성완료' }}
          </MyButton>
          <MyButton
            class="btn-warning mx-1"
            @click="cancelEdit()"
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
import { shared as s, inst } from '@/libs/commons/shared'
import { log } from '@/libs/commons/log'
import { apiGet, apiPut } from '@/libs/commons/api'
import { dialog } from '@/libs/commons/dialog'

import MyButton from '@/components/commons/mybutton.vue'
import MyInput from '@/components/commons/myinput.vue'
import MyEditor from '@/components/commons/myeditor.vue'
import MyForm from '@/components/commons/myform.vue'

const self = inst(getCurrentInstance())

const articleId = ref()

const pageTitle = () => articleId.value ? '게시글 수정' : '게시글 작성'
const article = ref({} as any)
const form = ref()

onMounted(async() => {
  await getArticle()
})

const getArticle = async () => {
  const id = Number(self.getParameter('articleId'))
  if (!isNaN(id)) {
    articleId.value = id
    const res = await apiGet({ act: `board/${id}` })
    if (res?.data) {
      article.value = res.data
    }
  } else {
    articleId.value = undefined
  }
}

const putArticle = async () => {
  try {
    /** form-validate */
    if (await form.value.validate()) {
      await apiPut({
        act: 'board',
        data: article.value
      })
      /** 업데이트 이후 히스토리 삭제 */
      await self.removeHist()
      await dialog.alert('업데이트가 완료되었습니다')
    }
  } catch(e) {
    await dialog.alert('오류가 발생했습니다')
  }
}

const cancelEdit = async () => {
  self.goPage(-1)
}

defineExpose({ pageTitle })
</script>