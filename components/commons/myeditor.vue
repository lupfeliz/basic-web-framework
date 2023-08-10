<template>
  <editor-content
    name="contents"
    @keyup="emitUpdate"
    :editor="editor"
    />
  <span class="err-msg" v-if="errorMessage" v-html="errorMessage"></span>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { useField } from 'vee-validate';
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

import lodash from 'lodash'

const props = defineProps({
  label: String,
  name: String,
  modelValue: String
})

const attrs = useAttrs()
const emit = defineEmits([C.UPDATE_MODEL_VALUE])
const vfield = useField(() => props.name || '')
const { value, errorMessage } = vfield
const vmeta: any = vfield.meta
const { debounce } = lodash

const editor = useEditor({
  content: '',
  extensions: [StarterKit],
})

onBeforeMount(async () => {
  vmeta.label = props.label
  value.value = props.modelValue
})

watch(() => props.modelValue, (v: any) => {
  value.value = v
  initContent()
})

watch(editor, _ => initContent())

const initContent = () => {
  if (editor.value && value.value) {
    editor.value.commands.setContent(value.value)
  }
}

const emitUpdate = debounce(async (e?: any) => {
  log.debug('META:', vfield)
  value.value = editor.value?.getHTML()
  emit(C.UPDATE_MODEL_VALUE, value.value)
}, 300)
</script>