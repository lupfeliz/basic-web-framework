<template>
  <editor-content
    :name="props.name"
    v-bind="attrs"
    @keydown="emitUpdate"
    :editor="editor"
    />
  <span class="err-msg" v-if="vmeta.validated && errorMessage" v-html="errorMessage"></span>
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
  validrules: {} as any,
  validopts: {} as any,
  modelValue: String
})

const attrs = useAttrs()
const emit = defineEmits([C.UPDATE_MODEL_VALUE])
const vfield = useField(() => props.name || '', props.validrules, props.validopts)
const { value, errorMessage } = vfield
const vmeta: any = vfield.meta
const { debounce } = lodash

const editor = useEditor({
  content: '',
  extensions: [StarterKit],
})

onBeforeMount(async () => {
  vmeta.label = props.label
})

watch(() => props.modelValue, (v: any) => {
  editor.value?.commands?.setContent(v)
})

const emitUpdate = debounce(async (e?: any) => {
  value.value = editor.value?.getHTML()
  emit(C.UPDATE_MODEL_VALUE, value.value)
}, 300)
</script>