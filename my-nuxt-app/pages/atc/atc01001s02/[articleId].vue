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
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { inst } from '@/store/commons/basesystem'
import { log } from '@/libs/commons/log'
import { apiDel, apiGet } from '@/libs/commons/api'
import { $f } from '@/libs/commons/format'

import Button from '@/components/commons/button.vue'
import { dialog } from '@/libs/commons/dialog'

const self = inst(getCurrentInstance())

const pageTitle = ref('상세보기')

const data = ref({} as any)

onMounted(async() => {
  await getArticle()
})

const getArticle = async () => {
  const id = self.getParameter('articleId')
  const res = await apiGet({ act: `atc/atc01001/${id}` })
  if (res?.status === C.SC_OK) {
    data.value = res.data
  }
}

const editArticle = async (id: string) => {
  self.goPage(`/atc/atc01001s03/${id}`)
}

const deleteArticle = async (id: string) => {
  if (await dialog.confirm(`"${data.value.title || ''}" 게시글을 삭제하시겠습니까?`)) {
    await apiDel({ act: `atc/atc01001/${id}`})
    await dialog.alert('삭제가 완료되었습니다')
    await self.removeHist()
  }
}

defineExpose({ pageTitle })
</script>