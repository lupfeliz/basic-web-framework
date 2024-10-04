<script setup lang="ts">
import * as C from '@/libs/constants'
import { inst } from '@/store/commons/basesystem'
import log from '@/libs/log'
import api from '@/libs/api'
import proc from '@/libs/proc'
import { $f } from '@/libs/format'

import Button from '@/components/button.vue'
import dialog from '@/libs/dialog-context'

const self = inst(getCurrentInstance())

const pageTitle = ref('상세보기')

const data = ref({} as any)

onMounted(async() => {
  await getArticle()
})

const getArticle = async () => {
  log.debug('GET-ARTICLE...')
  const id = self.getParameter('articleId')
  data.value = await api.get(`atc01001/${id}`, {})
}

const editArticle = async (id: string) => {
  self.goPage(`/atc/atc01001s03/${id}`)
}

const deleteArticle = async (id: string) => {
  if (await dialog.confirm(`"${data.value.title || ''}" 게시글을 삭제하시겠습니까?`)) {
    await api.delete(`atc01001/${id}`, {})
    await dialog.alert('삭제가 완료되었습니다')
    await self.removeHist()
  }
}

defineExpose({ pageTitle })
</script>
<template>
  <div class="container board-article">
    <div class="row">
      <div class="col-2 head">
        제목
      </div>
      <div class="col">
        {{ data.title }}
      </div>
    </div>
    <div class="row content">
      <div class="col-2 head">
        내용
      </div>
      <div class="col" v-html="data.contents"></div>
    </div>
    <template v-if="data.userNm">
    <div class="row">
      <div class="col-2 head">
        작성자
      </div>
      <div class="col">
        {{ data.userNm }} 
        <template v-if="data.userId">
        ({{ data.userId }})
        </template>
      </div>
    </div>
    </template>
    <div class="row">
      <div class="col-2 head">
        작성일자 / 수정일자
      </div>
      <div class="col">
        {{ $f('dt', data.ctime) }} /
        {{ $f('dt', data.utime) }}
      </div>
    </div>
    <div class="row">
      <div class="col-2 head">
        수정
      </div>
      <div class="col">
        <Button
          class="btn-primary mx-1"
          @click="editArticle(data.id)"
          >
          수정
        </Button>
        <Button
          class="btn-danger mx-1"
          @click="deleteArticle(data.id)"
          >
          삭제
        </Button>
        <Button
          class="btn-secondary mx-1"
          @click="self.goPage('/atc/atc01001s04/1')"
          >
          목록보기
        </Button>
      </div>
    </div>
  </div>
</template>