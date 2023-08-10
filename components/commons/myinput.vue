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
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { shared as s, inst } from '@/libs/commons/shared'
import { log } from '@/libs/commons/log'
import { useField } from 'vee-validate'

const self = inst(getCurrentInstance())

const props = defineProps({
  type: String,
  name: String,
  label: String,
  validrules: {} as any,
  modelValue: String
})

const attrs = useAttrs()
const emit = defineEmits([C.UPDATE_MODEL_VALUE])
const vfield = useField(() => props.name || '', props.validrules, { label: ref(props.label) })
const { value, errorMessage } = vfield
const vmeta: any  = vfield.meta

watch(() => props.modelValue, (v: any) => { value.value = v })

const emitUpdate = async (e: any) => {
  emit(C.UPDATE_MODEL_VALUE, value.value)
}
</script>