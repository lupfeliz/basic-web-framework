<template>
  <Form as=""
    ref="form"
    v-slot="{ values }"
    v-bind="attrs"
    >
    <slot></slot>
    <pre>{{ values }}</pre>
  </Form>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { Form } from 'vee-validate'
import { defineRule } from 'vee-validate'
import vrules from '@vee-validate/rules'

Object.keys(vrules).forEach(rule => {
  defineRule(rule, vrules[rule])
})

const contentLenRule = (v: any, [vlmin, vlmax]: [number, number], ctx: any) => {
  let ret:boolean | string = true
  const c = document.createElement(C.DIV)
  c.innerHTML = v
  const clen = String(c.innerText).trim().length
  if (!vlmin) { vlmin = 0 }
  if (!vlmax) { vlmax = 0 }
  if (vlmin > 0 && clen < vlmin) { ret = `${ctx.label || ctx.name} 를 ${vlmin} 자 이상 적어 주세요` }
  if (vlmax > 0 && clen > vlmax) { ret = `${ctx.label || ctx.name} 는 ${vlmax} 자 이상 적을 수 없습니다` }
  log.debug('CHECK:', ctx, form.value)
  return ret
}

defineRule('content-len', contentLenRule)

const attrs = useAttrs()
const form = ref()

const reset = (e: any) => {
  return form.value.resetForm(e)
}

const resetField = (f: any, s: any) => {
  return form.value.resetField(f, s)
}

const validate = async (e: any) => {
  return await form.value.validate(e)
}

defineExpose({ validate, reset, resetField })
</script>