<template>
  <div class="container board-list">
    <div class="row head">
        <div class="col-1">
          번호
        </div>
        <div class="col">
          제목
        </div>
        <div class="col-2">
          작성자
        </div>
        <div class="col-2">
          작성일자
        </div>
    </div>
    <template v-for="(itm, inx) in boardData.list" key="inx">
      <div class="row">
        <div class="col-1">
          {{ paging.rnums(boardData.page)[0] + inx }}
        </div>
        <div class="col cursor-pointer"
          @click="viewArticle(itm)"
          >
          {{ itm.title }}
        </div>
        <div class="col-2">
          {{ itm.author }}
        </div>
        <div class="col-2">
          {{ $f('dt', itm.ctime) }}
        </div>
      </div>
    </template>
    <div class="mt-2">
      <Button
        class="btn-primary"
        @click="newArticle()"
        >
        새글작성
      </Button>
    </div>
  </div>
  <div class="mt-3 text-center pagination">
    <nav>
      <ul class="pagination">
        <li class="page-item"
          >
          <Button flat class="page-link">&lt;&lt;</Button>
        </li>
        <li class="page-item"
          >
          <Button flat class="page-link">&lt;</Button>
        </li>
        <template v-for="inx in range(paging.pnums(boardData.list))">
          <li :class="{ 'page-item': true, active: boardData.page == String(inx) }">
            <Button flat
              @click="pageSearch({ page: inx })"
              class="page-link"
              >
              {{ inx }}
            </Button>
          </li>
        </template>
        <li class="page-item"
          >
          <Button flat class="page-link">&gt;</Button>
        </li>
        <li class="page-item"
          >
          <Button flat class="page-link">&gt;&gt;</Button>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script setup lang="ts">

import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { inst, shared as s } from '@/libs/commons/shared'
import { apiPost } from '@/libs/commons/api'
import { $f } from '@/libs/commons/format'
import { values } from '@/libs/commons/values'
import { Paging } from '@/libs/commons/paging'

import Button from '@/components/commons/button.vue'

const self = inst(getCurrentInstance())
const pageTitle = '게시판'
const boardData = ref({ list: [] as any[] } as any)
const { range } = values
const paging = ref(new Paging())

onBeforeMount(async () => {
  s.eventbus.on(C.EVT_POPSTATE, async (e: any) => {
    let data = { page: 1 }
    if (e?.state?.histdata) { data = JSON.parse(e.state.histdata) }
    await search(data)
  })
})
onUnmounted(async () => {
  s.eventbus.off(C.EVT_POPSTATE)
})
onMounted(async () => {
  if (!history.state?.histdata) {
    await search({ page: 1 })
  }
})

const search = async (data: any) => {
  const res = await apiPost({
    act: 'board',
    data: data
  })
  if (res?.data?.list) {
    paging.value = new Paging(res.data.rows, res.data.pages, res.data.cnt)
    boardData.value = res.data
  }
}

const pageSearch = async (data: any) => {
  history.pushState({histdata: JSON.stringify(data), current: history.state.current }, '', history.state.current)
  await search(data)
}

const viewArticle = async (item: any) => {
  self.goPage(`/board/${item?.id}`)
}

const newArticle = async () => {
  self.goPage(`/board/edit/_`)
}

defineExpose({ pageTitle })
</script>