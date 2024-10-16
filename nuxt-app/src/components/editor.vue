<script setup lang="ts">
import * as C from '@/libs/constants'
import log from '@/libs/log'
import { inst } from '@/store/commons/basesystem'
import { useField, type FieldContext } from 'vee-validate';
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

import lodash from 'lodash'

const self = inst(getCurrentInstance())

const props = defineProps({
  label: String,
  name: String,
  validrules: {} as any,
  modelValue: String
})

const attrs = useAttrs()
const emit = defineEmits([C.UPDATE_MODEL_VALUE])
const vfield = props.name ?
  useField(() => props.name || '', props.validrules,
    { label: ref(props.label), validateOnValueUpdate: false }) :
  { value: ref(''), errorMessage: {}, meta: {} } as FieldContext
const { value, errorMessage } = vfield
const vmeta: any = vfield.meta
const { debounce } = lodash

const editor = useEditor({
  content: '',
  extensions: [StarterKit],
})

watch(() => props.modelValue, (v: any) => {
  editor.value?.commands?.setContent(v)
  value.value = v
})

const emitUpdate = debounce(async (e?: any) => {
  value.value = editor.value?.getHTML()
  emit(C.UPDATE_MODEL_VALUE, value.value)
}, 300)
</script>
<template>
  <editor-content
    :name="props.name"
    v-bind="attrs"
    @keyup="emitUpdate"
    :editor="editor"
    />
  <span class="err-msg" v-if="vmeta.validated && errorMessage" v-html="errorMessage"></span>
</template>