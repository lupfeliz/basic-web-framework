<script setup lang="ts">

import * as C from '@/libs/constants'
import log from '@/libs/log'
import { useBaseSystem, inst } from '@/store/commons/basesystem'
import api from '@/libs/api'
import { $f } from '@/libs/format'
import values from '@/libs/values'
import { Paging } from '@/libs/paging'

import Button from '@/components/button.vue'
import dialog from '@/libs/dialog-context'
import app from '@/libs/app-context'
import proc from '@/libs/proc'

const self = inst(getCurrentInstance())
const pageTitle = '게시판'
const boardData = ref({ list: [] as any[] } as any)
const { range } = values
const paging = ref(new Paging())
const sys = useBaseSystem()

watch(() => sys.$state?.popstate, (e: any) => {
  let data = {
    currentPage: 1,
    rowCount: 10,
    rowStart: 0,
    rowTotal: 0,
    keyword: '',
    searchType: '',
    orderType: ''
  }
  if (e?.state?.histdata) { data = JSON.parse(e.state.histdata) }
  search(data)
}, { deep: true })

onMounted(async () => {
  log.debug('ATC01001S04 INIT..')
  const pagenum = self.getParameter('pagenum')
  let data = {
    currentPage: 1,
    rowCount: 10,
    rowStart: 0,
    rowTotal: 0,
    keyword: '',
    searchType: '',
    orderType: ''
  }
  if (history?.state?.histdata) { data = JSON.parse(history.state.histdata) }
  await app.until(() => app.astate() === C.APPSTATE_READY, { interval: 100, maxcheck: 100 })
  search(data)
})

const search = async (req: any, save?: boolean) => {
  try {
    log.debug('SEARCH-API..', app.astate())
    const data = await api.post('atc01001', req)
    log.debug('SEARCH-RESULT..', data)
    if (save) { self.saveHist(req) }
    paging.value = new Paging(data.rows, data.pages, data.cnt)
    data.totp = Math.ceil(Number(data.cnt) / Number(data.rows))
    boardData.value = data
    self.$forceUpdate()
  } catch (e) {
    log.debug('E:', e)
  }
}

const viewArticle = async (item: any) => {
  self.goPage(`/atc/atc01001s02/${item?.id}`)
}

const newArticle = async () => {
  self.goPage(`/atc/atc01001s03/_`)
}

defineExpose({ pageTitle })
</script>
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
    <template v-if="!(boardData?.list?.length)">
      <div class="row">
        <div class="col text-center">
          게시물이 없습니다.
        </div>
      </div>
    </template>
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
          {{ itm.userNm }}
          <template v-if="itm.userId">
            ({{ itm.userId }})
          </template>
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
        <li class="page-item">
          <Button flat
            class="page-link"
            :disabled="Number(boardData.page) < 5"
            @click="search({ page: Number(boardData.page) - Number(boardData.pages) }, true)"
            >
            &lt;&lt;
          </Button>
        </li>
        <li class="page-item">
          <Button flat
            class="page-link"
            :disabled="Number(boardData.page) <= 1"
            @click="search({ page: Number(boardData.page) - 1 }, true)"
            >
            &lt;
          </Button>
        </li>
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
        <li class="page-item">
          <Button flat
            class="page-link"
            :disabled="Number(boardData.page) >= Number(boardData.totp)"
            @click="search({ page: Number(boardData.page) + 1 }, true)"
            >
            &gt;
          </Button>
        </li>
        <li class="page-item">
          <Button flat
            class="page-link"
            :disabled="Number(boardData.page) >= (Number(boardData.totp) - Number(boardData.pages) + 1)"
            @click="search({ page: Number(boardData.page) + Number(boardData.pages) }, true)"
            >
            &gt;&gt;
          </Button>
        </li>
      </ul>
    </nav>
  </div>
</template>