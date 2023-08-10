<template>
  <slot></slot>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { useForm } from 'vee-validate'
import { defineRule } from 'vee-validate'
import vrules from '@vee-validate/rules'

const vform = useForm()

onBeforeMount(async () => {
  log.debug('V-FORM:', vform)
})

Object.keys(vrules).forEach(rule => {
  defineRule(rule, vrules[rule])
})

defineRule('content-len', (v: any, [vlmin, vlmax]: [number, number], ctx: any) => {
  let ret:boolean | string = true
  const c = document.createElement(C.DIV)
  c.innerHTML = v
  const clen = String(c.innerText).trim().length
  if (!vlmin) { vlmin = 0 }
  if (!vlmax) { vlmax = 0 }
  if (vlmin > 0 && clen < vlmin) { ret = `"${ctx.label || ctx.name}" 항목은 ${vlmin} 자 이상 입력해 주세요` }
  if (vlmax > 0 && clen > vlmax) { ret = `"${ctx.label || ctx.name}" 항목을 ${vlmax} 자 이상 입력할 수 없습니다` }
  return ret
})

defineRule('required', (v: any, prm: any, ctx: any) => {
  let ret:boolean | string = true
  if (!v) { ret = `"${ctx.label || ctx.name}" 항목은 반드시 입력해 주세요` }
  return ret
})

defineRule('len', (v: any, [vlmin, vlmax]: [number, number], ctx: any) => {
  let ret:boolean | string = true
  const clen = String(v || '').length
  if (!vlmin) { vlmin = 0 }
  if (!vlmax) { vlmax = 0 }
  if (vlmin > 0 && clen < vlmin) { ret = `"${ctx.label || ctx.name}" 항목은 ${vlmin} 자 이상 입력해 주세요` }
  if (vlmax > 0 && clen > vlmax) { ret = `"${ctx.label || ctx.name}" 항목은 ${vlmax} 자 이상 입력할 수 없습니다` }
  return ret
})

const reset = (e: any) => {
  return vform.resetForm(e)
}

const resetField = (f: any, s: any) => {
  return vform.resetField(f, s)
}

const validate = async (e: any) => {
  const ret = await vform.validate(e)
  return ret?.valid
}

defineExpose({ validate, reset, resetField, VFORM: vform })
</script>