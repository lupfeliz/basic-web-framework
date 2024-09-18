<template>
  <slot></slot>
</template>
<script setup lang="ts">
import * as C from '@/libs/constants'
import log from '@/libs/log'
import { useForm } from 'vee-validate'
import { defineRule } from 'vee-validate'
import vrules from '@vee-validate/rules'

const vform = useForm()

const userRules: any = { }

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

defineRule('u', (v: any, prm: any[], ctx: any)  => {
  let ret:boolean | string = true
  if (prm && prm.length > 0) {
    const rulenm = prm[0]
    const rule = userRules[rulenm]
    if (rule && rule instanceof Function) {
      ret = rule(v, prm, ctx)
    }
  }
  return ret
})

const reset = (e: any) => {
  return vform.resetForm(e)
}

const resetField = (f: any, s: any) => {
  return vform.resetField(f, s)
}

const validate = async (e: any) => {
  return (await vform.validate(e))?.valid
}

const validateField = async(e: any) => {
  return (await vform.validateField(e))?.valid
}

const addValidRules = (rules: any) => {
  for (const k in rules) {
    userRules[k] = rules[k]
  }
}

defineExpose({ validate, validateField, reset, resetField, addValidRules, _VFORM_: vform })
</script>