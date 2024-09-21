<template>
  <div class="container board-article">
    <Form ref="form">
      <div class="row">
        <div class="col-2 head">
          제목
        </div>
        <div class="col">
          <Input
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
          <Editor
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
          <Button
            class="btn-primary mx-1"
            @click="putArticle()"
            >
            {{ articleId ? '수정완료' : '작성완료' }}
          </Button>
          <Button
            class="btn-warning mx-1"
            @click="cancelEdit()"
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
import api from '@/libs/api'
import dialog from '@/libs/dialog-context'

import Button from '@/components/button.vue'
import Input from '@/components/input.vue'
import Editor from '@/components/editor.vue'
import Form from '@/components/form.vue'

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
    article.value = await api.get(`atc01001/${id}`, {})
  } else {
    articleId.value = undefined
  }
}

const putArticle = async () => {
  /** form-validate */
  if (await form.value.validate()) {
    await api.put('atc01001', article.value)
    /** 업데이트 이후 히스토리 삭제 */
    await dialog.alert('업데이트가 완료되었습니다')
    await self.removeHist()
  }
}

const cancelEdit = async () => {
  self.goPage(-1)
}

defineExpose({ pageTitle })
</script>