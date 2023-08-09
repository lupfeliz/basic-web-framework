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
        <template v-if="Number(boardData.page) >= 5">
          <li class="page-item">
            <Button flat
              class="page-link"
              @click="search({ page: Number(boardData.page) - Number(boardData.pages) })"
              >
              &lt;&lt;
            </Button>
          </li>
        </template>
        <template v-if="Number(boardData.page) > 1">
          <li class="page-item">
            <Button flat
              class="page-link"
              @click="search({ page: Number(boardData.page) - 1 })"
              >
              &lt;
            </Button>
          </li>
        </template>
        <template v-for="inx in range(paging.pnums(boardData.page))">
          <li :class="{ 'page-item': true, active: boardData.page == String(inx) }">
            <Button flat
              @click="search({ page: inx }, true)"
              class="page-link"
              >
              {{ inx }}
            </Button>
          </li>
        </template>
        <template v-if="Number(boardData.page) < Number(boardData.totp)">
          <li class="page-item"
            >
            <Button flat
              class="page-link"
              @click="search({ page: Number(boardData.page) + 1 })"
              >
              &gt;
            </Button>
          </li>
        </template>
        <template v-if="Number(boardData.page) < (Number(boardData.totp) - Number(boardData.pages) + 1)">
          <li class="page-item">
            <Button flat
              class="page-link"
              @click="search({ page: Number(boardData.page) + Number(boardData.pages) })"
              >
              &gt;&gt;
            </Button>
          </li>
        </template>
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
    // log.debug('ONPOPSTATE:', JSON.stringify(e.state))
    let data = { page: 1 }
    if (e?.state?.histdata) { data = JSON.parse(e.state.histdata) }
    search(data)
  })
})
onUnmounted(async () => {
  s.eventbus.off(C.EVT_POPSTATE)
})
onMounted(async () => {
  let data = { page: 1 }
  if (history?.state?.histdata) { data = JSON.parse(history.state.histdata) }
  log.debug('ONMOUNTED:', history.state)
  search(data)
})

const search = async (data: any, save?: boolean) => {
  // if (save) { self.saveHist(data) }
  const res = await apiPost({
    act: 'board',
    data: data
  })
  if (res?.data?.list) {
    paging.value = new Paging(res.data.rows, res.data.pages, res.data.cnt)
    res.data.totp = Math.ceil(Number(res.data.cnt) / Number(res.data.rows))
    // log.debug('DATA:', res.data)
    boardData.value = res.data
  }
}

const viewArticle = async (item: any) => {
  self.goPage(`/board/${item?.id}`)
}

const newArticle = async () => {
  self.goPage(`/board/edit/_`)
}

defineExpose({ pageTitle })
</script>