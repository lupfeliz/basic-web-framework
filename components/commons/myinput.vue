<template>
  <input
    class="form-control"
    :name="props.name"
    :type="props.type"
    v-bind="attrs"
    v-model="value"
    @update:modelValue="emitUpdate"
    />
  <span class="err-msg" v-if="errorMessage" v-html="errorMessage"></span>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { useField } from 'vee-validate'

const props = defineProps({
  type: String,
  name: String,
  modelValue: String
})

const attrs = useAttrs()
const emit = defineEmits([C.UPDATE_MODEL_VALUE])
const { value, errorMessage } = useField(() => props.name || '')

watch(() => props.modelValue, (v: any) => {
  value.value = v
})

const emitUpdate = async (e: any) => {
  emit(C.UPDATE_MODEL_VALUE, e)
}
</script>