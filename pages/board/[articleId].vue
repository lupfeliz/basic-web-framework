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
    <div class="row">
      <div class="col-2 head">
        작성일자
      </div>
      <div class="col">
        {{ $f('dt', data.ctime) }}
      </div>
    </div>
    <div class="row">
      <div class="col-2 head">
        수정일자
      </div>
      <div class="col">
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
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { shared as s, inst } from '@/libs/commons/shared'
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
  const res = await apiGet({ act: `board/${id}` })
  if (res?.data) {
    data.value = res.data
  }
}

const editArticle = async (id: string) => {
  self.goPage(`/board/editor/${id}`)
}

const deleteArticle = async (id: string) => {
  if (await dialog.confirm(`"${data.value.title || ''}" 게시글을 삭제하시겠습니까?`)) {
    await apiDel({ act: `board/${id}`})
  }
}

defineExpose({ pageTitle })
</script>