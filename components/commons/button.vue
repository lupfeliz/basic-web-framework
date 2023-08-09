<template>
  <button
    type="button"
    :class="{ 'btn': props.flat ? false : true }"
    v-bind="attrs"
    @click="emitClick"
    >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'

const props = defineProps({
  flat: {
    type: Boolean
  }
})
const attrs = useAttrs()
const emit = defineEmits([C.CLICK])

onMounted(async () => {
})

const emitClick = async (e: any) => {
  emit(C.CLICK, e)
}
</script>