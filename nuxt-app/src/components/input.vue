<script setup lang="ts">
import * as C from '@/libs/constants'
import { useBaseSystem, inst } from '@/store/commons/basesystem'
import log from '@/libs/log'
import { useField, type FieldContext } from 'vee-validate'

const self = inst(getCurrentInstance())
const sys = useBaseSystem()

const props = defineProps({
  type: String,
  name: String,
  label: String,
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
const vmeta: any  = vfield.meta

watch(() => props.modelValue, (v: any) => { value.value = v })

const emitUpdate = async (e: any) => {
  emit(C.UPDATE_MODEL_VALUE, value.value)
}
</script>
<template>
  <input
    class="form-control"
    :name="props.name"
    :type="props.type"
    v-bind="attrs"
    v-model="value"
    @keyup="emitUpdate"
    />
  <span class="err-msg" v-if="vmeta.validated && errorMessage" v-html="errorMessage"></span>
</template>