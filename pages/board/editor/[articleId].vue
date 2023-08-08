<template>
  <div class="container board-article">
    <div class="row">
      <div class="col-2 head">
        제목
      </div>
      <div class="col">
        <input
          type="text"
          v-model="article.title"
          >
      </div>
    </div>
    <div class="row content editor">
      <div class="col-2 head">
        내용
      </div>
      <div
        class="col"
        >
         <editor-content
          :editor="editor"
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
  </div>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { shared as s, inst } from '@/libs/commons/shared'
import { log } from '@/libs/commons/log'
import { apiGet, apiPut } from '@/libs/commons/api'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

import Button from '@/components/commons/button.vue'

const self = inst(getCurrentInstance())

const articleId = ref()

const pageTitle = () => articleId.value ? '게시글 수정' : '게시글 작성'

const article = ref({} as any)

const editor = useEditor({
  content: '',
  extensions: [StarterKit],
})

watch(editor, _ => initContent())
watch(() => article.value?.contents, _ => initContent())

onMounted(async() => {
  await getArticle()
})

const initContent = () => {
  log.debug('', article.value?.contents, editor.value?.commands?.setContent)
  if (editor.value && article.value?.contents) {
    editor.value.commands.setContent(article.value.contents);
  }
}

const getArticle = async () => {
  const id = Number(self.getParameter('articleId'))
  log.debug('ARTICLE_ID:', id, isNaN(id))
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
  const data = {
    id: articleId.value,
    title: article.value?.title,
    contents: editor.value?.getHTML()
  }
  await apiPut({
    act: 'board',
    data: data
  })
  log.debug('DATA:', data)
}

const cancelEdit = async () => {
  self.goPage(-1)
}

defineExpose({ pageTitle })
</script>