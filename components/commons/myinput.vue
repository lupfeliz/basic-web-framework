<template>
  <input
    class="form-control"
    :name="props.name"
    :type="props.type"
    v-bind="attrs"
    v-model="value"
    @keydown="emitUpdate"
    />
  <span class="err-msg" v-if="vmeta.validated && errorMessage" v-html="errorMessage"></span>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { useField } from 'vee-validate'

const props = defineProps({
  type: String,
  name: String,
  label: String,
  validrules: {} as any,
  validopts: {} as any,
  modelValue: String
})

const attrs = useAttrs()
const emit = defineEmits([C.UPDATE_MODEL_VALUE])
const vfield = useField(() => props.name || '', props.validrules, props.validopts)
const { value, errorMessage } = vfield
const vmeta: any  = vfield.meta

onBeforeMount(async () => {
  vmeta.label = props.label
})

watch(() => props.modelValue, (v: any) => { value.value = v })

const emitUpdate = async (e: any) => {
  emit(C.UPDATE_MODEL_VALUE, value.value)
}
</script>