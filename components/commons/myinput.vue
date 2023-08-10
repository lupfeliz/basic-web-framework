<template>
  <input
    class="form-control"
    :type="props.type"
    v-bind="attrs"
    @update:modelValue="emitUpdate"
    />
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'

const props = defineProps({
  type: String,
  value: String
})
const attrs = useAttrs()
const emit = defineEmits([C.UPDATE_MODEL_VALUE])

onMounted(async () => {
})

const emitUpdate = async (e: any) => {
  emit(C.UPDATE_MODEL_VALUE, e)
}
</script>