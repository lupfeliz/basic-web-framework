/**
 * @File        : form.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 폼 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { ComponentPropsWithRef } from 'react'
import Popper from '@/components/popper'
import hangul from '@/libs/hangul'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import $ from 'jquery'
type FormProps = ComponentPropsWithRef<'div'> & { }
type MessageProps = ComponentPropsWithRef<'div'> & {
  popper?: any
  anchor?: any
  open?: any
}

const { defineComponent, useRef, copyExclude, clone, putAll, log, useSetup, isServer } = app

const formElement = {
  name: '',
  props: {} as () => {},
  ctx: {} as () => {},
  ref: {} as () => {},
  rules: {} as any,
  seq: 0,
  el: {} as HTMLElement
}
const formRef = {
  current: {
    form: {
      elements: [] as typeof formElement[]
    }
  }
}
const useForm = () => (useRef(clone(formRef.current) as any))
const registForm = async (props: any, ctx: any, ref: any) => {
  const cprops = props()
  const cref = ref()
  if (cprops?.form?.current?.form) {
    const form = cprops.form.current.form as typeof formRef.current.form
    const pmodel = cprops?.model
    const pname = cprops?.name ? cprops.name.split(/[.]/)[0] : undefined
    const pinx = cprops?.name ? cprops.name.split(/[.]/)[1] : 0
    const pvalue = pmodel && pname ? pmodel[pname] : C.UNDEFINED
    // log.debug('FORM:', form, pname, pvalue, cprops)
    log.trace(`FORM-COMPONENT: ${pname}${!isNaN(pinx) ? '.' + pinx : ''}`, cref?.current)
    form.elements.push({
      name: cprops?.name, props: props,
      ctx: ctx, ref: ref, seq: 0, el: C.UNDEFINED, rules: C.UNDEFINED
    })
  }
}
const DATA_VALID_INX = 'data-valid-inx'
const validateForm = async (vform: any, opt: any = {}) => {
  const form = vform?.current?.form as typeof formRef.current.form
  const elist: typeof formElement[] = []
  log.trace('VALIDATION-START..', form, form.elements, vform)
  let ret = true
  if (form) {
    let qlst = ''
    for (let inx in form.elements) {
      const item = form.elements[inx]
      const cname: any = item.name
      const cprops: any = item.props()
      const cctx: any = item.ctx()
      const cref: any = item.ref()
      const elem = cref?.current ? cref.current : C.UNDEFINED
      item.rules = parseRules(cprops)
      if (elem) {
        // log.debug('ELEM:', elem)
        elem.setAttribute(DATA_VALID_INX, inx)
        if (qlst) { qlst = `${qlst},` }
        qlst = `${qlst}[${DATA_VALID_INX}='${inx}']`
        elist[inx] = item
      }
      cctx.error = false
    }
    const list = $(document.body).find(qlst)
    for (let inx = 0; inx < list.length; inx++) {
      const elem: any = list[inx]
      const vinx = Number(elem.getAttribute(DATA_VALID_INX))
      const item = elist[vinx]
      elem.removeAttribute(DATA_VALID_INX)
      item.seq = inx
      item.el = elem
    }
    elist.sort((a: any, b: any) => Number(a.seq) - Number(b.seq))
    // log.debug('VALIDATION-COUNT:', elist.length)
    for (const item of elist) {
      let res = await validate(item, opt)
      if (res === false) {
        log.debug('INVALID:', item, opt)
        ret = false
        break
      }
    }
    app.state(1)
  }
  return ret
}
const validate = async (item: any, opt: any = {}) => new Promise((resolve) => {
  // let ret = true
  // let result
  // const cctx: any = item.ctx()
  // const cprops: any = item.props()
  // try {
  //   const rlist = String(item.rules).split(/\|/g)
  //   const label = cprops.label ? cprops.label : cprops.name
  //   for (const rule of rlist) {
  //     const rdata = rule.split(/\:/g)
  //     const rparm = rdata.length > 1 ? String(rdata[1]).split(/\,/g) : []
  //     /** NULL, UNDEFINED 값 통일 */
  //     cctx.value = values.nval(cctx.value, C.UNDEFINED)
  //     // log.debug('RULE:', rule, rdata, cctx.value, cprops)
  //     if (!rdata || rdata.length < 1) { continue }
  //     const vitm  = validations()[rdata[0]]
  //     log.trace('VITM:', rule, rdata[0], vitm ? true: false, cctx.value, rparm)
  //     if (!vitm) { continue }
  //     if (rule !== C.REQUIRED &&
  //       !/^u:/.test(rule) &&
  //       (cctx.value === '' || cctx.value === undefined)) {
  //       result = true
  //     } else {
  //       result = vitm({ value: cctx.value, name: label }, rparm, cctx)
  //     }
  //     log.trace('RESULT:', result, typeof result)
  //     if (typeof result === C.STRING) {
  //       if (!opt?.noerror) {
  //         cctx.error = true
  //         cctx.message = result
  //       }
  //       if (opt) { opt.message = result }
  //       result = false
  //     }
  //     if (result === false) {
  //       ret = false
  //       break
  //     }
  //   }
  //   // log.trace('FINAL-RESULT:', pprops?.name, ret)
  // } catch (e) {
  //   log.debug('E:', e)
  // }
  // cctx.validated = true
  // cctx.valid = ret
  // resolve(ret)
  // return ret;
})
/** 오류메시지에서 한글 어휘에 맞게 필드명에 조사를 붙여주는 역할. */
const { detectJosa } = hangul
const josa = (name: string, tail: string, wrap?: string) => {
  // if (self.curLocale() === C.KO) { name = jj(name, tail, wrap) }
  name = detectJosa(name, tail, wrap)
  return name
}
/** 사전 정의된 validation 함수들 */
const validations = () => {
  return {
    // 'auto': {
    //   validate: (v: any, p: any) => {
    //     log.trace('V-AUTO:', v, p, (v !== undefined && v !== '' && v !== false))
    //     return true
    //   }
    // },
    // 'test': {
    //   validate: (v: any, p: any) => {
    //     return true
    //   },
    //   message: (v: any, p: any) => {
    //   }
    // },
    // 'required': (v: any, p: any, c?: any) => {
    //   const value = v.value
    //   log.trace('V-REQUIRED:', value, p, !(value !== undefined && value !== '' && value !== false))
    //   if (!(value !== undefined && value !== null && value !== '' && value !== false)) {
    //     if (c && c.hasOwnProperty('checked')) {
    //       let name = josa(v.name, '에')
    //       return String(`#(name) 반드시 체크해 주세요`)
    //         .replace(/\#\(name\)/g, name)
    //     } else if (c && c.hasOwnProperty('index')) {
    //       let name = josa(v.name, '은')
    //       return String(`#(name) 반드시 선택해 주세요`)
    //         .replace(/\#\(name\)/g, name)
    //     } else {
    //       let name = josa(v.name, '은')
    //       return String(`#(name) 반드시 입력해 주세요`)
    //         .replace(/\#\(name\)/g, name)
    //     }
    //   }
    //   return true
    // },
    // 'nospc': (v: any, p: any) => {
    //   if (/ /g.test(v.value)) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) 공백을 입력할수 없어요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'number': (v: any, p: any) => {
    //   if (!format.pattern(C.NUMBER, v.value)) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) 숫자만 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'numeric': (v: any, p: any) => {
    //   if (!format.pattern(C.NUMERIC, v.value)) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) 숫자만 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'alpha': (v: any, p: any) => {
    //   if (!format.pattern(C.ALPHA, v.value)) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) 영문으로만 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'alphaspc': (v: any, p: any) => {
    //   if (!format.pattern(C.ALPHASPC, v.value)) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) 영문으로만 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'alphastart': (v: any, p: any) => {
    //   if (!(format.pattern(C.ALPHASTART, v.value))) {
    //     let name = josa(v.name, '의')
    //     return String(`#(name) 첫글자는 반드시 영문으로 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'alphanum': (v: any, p: any) => {
    //   if (!(format.pattern(C.ALPHANUM, v.value))) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) 영문 또는 숫자로만 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'alphanumspc': (v: any, p: any) => {
    //   if (!(format.pattern(C.ALPHANUMSPC, v.value))) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) 영문 또는 숫자로만 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'ascii': (v: any, p: any) => {
    //   if (!format.pattern(C.ASCII, v.value)) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) 영문, 숫자 또는 기호만 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'hangul': (v: any, p: any) => {
    //   if (!format.pattern(C.HANGUL, v.value)) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) 한글만 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'date': (v: any, p: any) => {
    //   let valid = true
    //   if (valid && !format.pattern(C.DATE, v.value)) { valid = false }
    //   if (valid) {
    //     const d = String(v.value).split('-')
    //     const f = format.formatDate(format.date(d[0], d[1], d[2]), C.DATE_FORMAT_YMD)
    //     // log.debug('CHECK-DATE:', v.value, valid, d, f);
    //     if (v.value != f) { valid = false }
    //   }
    //   if (!valid) {
    //     let name = josa(v.value, '은')
    //     return String(`#(name) 올바른 날자 형식이 아니예요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'date-ym': (v: any, p: any) => {
    //   let valid = true
    //   if (valid && !/^([0-9]{4}-[0-9]{1,2})$/.test(v.value)) { valid = false }
    //   if (valid) {
    //     const d = String(v.value).split('-')
    //     const f = format.formatDate(format.date(d[0], d[1]), C.DATE_FORMAT_YM)
    //     const check = `${values.lpad(d[0], 4, '0')}-${values.lpad(d[1], 2, '0')}`
    //     if (check != f) { valid = false }
    //   }
    //   if (!valid) {
    //     let name = josa(v.value, '은')
    //     return String(`#(name) 올바른 날자 형식이 아니예요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'email': (v: any, p: any) => {
    //   let t: any
    //   if (!format.pattern(C.EMAIL, v.value)) {
    //     let name = josa(v.value, '은', '"')
    //     return String(`#(name) 정상적인 이메일 형식이 아니예요`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'password': (v: any, p: any) => {
    //   let t: any
    //   if (!format.pattern(C.PASSWORD, v.value)) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) 4자리 이상, 영문자, 숫자, 기호를 반드시 섞어서 입력해 주세요.`)
    //       .replace(/\#\(name\)/g, name)
    //   }
    //   return true
    // },
    // 'content-len': (v: any, p: any) => {
    //   let t: any
    //   const vmin = values.num(values.nval(p, 0), 0)
    //   const vmax = values.num(values.nval(p, 1), 0)
    //   const div = document.createElement(C.DIV)
    //   div.innerHTML = v.value
    //   const clen = String(div.innerText).trim().length
    //   if (vmin > 0 && clen < vmin) {
    //     let name = josa(v.name, '의')
    //     return String(`#(name) 길이는 최소 #(min) 글자 입니다.`)
    //       .replace(/\#\(name\)/g, name)
    //       .replace(/\#\(min\)/g, String(vmin))
    //   }
    //   if (vmax > 0 && clen > vmax) {
    //     let name = josa(v.name, '의')
    //     return String(`#(name) 길이는 최대 #(max) 글자 입니다.`)
    //       .replace(/\#\(name\)/g, name)
    //       .replace(/\#\(min\)/g, String(vmin))
    //   }
    //   return true
    // },
    // 'len': (v: any, p: any, c: any) => {
    //   let t: any
    //   const vmin = values.num(values.item(p, 0), 0)
    //   const vmax = values.num(values.item(p, 1), 0)
    //   if (vmin > 0 && v.value && String(v.value || '').trim().length < vmin) {
    //     let name = josa(v.name, '의')
    //     return String(`#(name) 길이는 최소 #(min) 글자 입니다.`)
    //       .replace(/\#\(name\)/g, name)
    //       .replace(/\#\(min\)/g, String(vmin))
    //   }
    //   if (vmax > 0 && v.value && String(v.value).length > vmax) {
    //     let name = josa(v.name, '의')
    //     return String(`#(name) 길이는 최대 #(max) 글자 입니다.`)
    //       .replace(/\#\(name\)/g, name)
    //       .replace(/\#\(min\)/g, String(vmin))
    //   }
    //   return true
    // },
    // 'minv': (v: any, p: any, c: any) => {
    //   let t: any
    //   const vmin = values.num(values.item(p, 0), 0)
    //   if (Number(v.value || 0) < vmin) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) #(min) 이상의 값을 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //       .replace(/\#\(min\)/g, String(vmin))
    //   }
    //   return true
    // },
    // 'maxv': (v: any, p: any, c: any) => {
    //   let t: any
    //   const vmax = values.num(values.item(p, 0), 0)
    //   if (Number(v.value || 0) > vmax) {
    //     let name = josa(v.name, '은')
    //     return String(`#(name) #(max) 이하의 값을 입력해 주세요`)
    //       .replace(/\#\(name\)/g, name)
    //       .replace(/\#\(max\)/g, String(vmax))
    //   }
    //   return true
    // },
    // 'u': (v: any, p: any, c: any) => {
    //   // log.trace('CHECK-USER-FUNCTION:FORM:', cform.value?.userRules, p)
    //   // if (cform.value?.userRules && p && p[0] && cform.value.userRules[p[0]]) {
    //   //   return cform.value.userRules[p[0]](v, p, c)
    //   // }
    // }
  } as any
}

const parseRules = (props: any, attrs?: any) => {
  let ret: string = ''
  let list = String(props?.vrules || '').split(/\s*\|\s*/)
  let auto = false
  let pinx = 0

  for (let inx = 0; inx < list.length; inx++) {
    const item = list[inx]
    switch (item) {
    case C.AUTO:
      auto = true
      list.splice(inx, 1)
      inx--
      break
    case C.REQUIRED:
      list.splice(inx, 1)
      list.splice(0, 0, C.REQUIRED)
      pinx = 1
      break
    }
  }
  if (auto) {
    {
      /** type */
      log.trace('DATA-TYPE:', props.type)
      let rule = ''
      switch (props.type) {
      case C.NUMBER: rule = C.NUMBER; break
      case C.NUMERIC: rule = C.NUMERIC; break
      case C.ALPHA: rule = C.ALPHA; break
      case C.ALPHANUM: rule = C.ALPHANUM; break
      case C.ASCII: rule = C.ASCII; break
      case C.EMAIL: rule = C.EMAIL; break
      // case C.PASSWORD: rule = C.PASSWORD; break
      // case C.DATE: rule = C.DATE; break
      // case C.DATETIME: rule = C.DATETIME; break
      }
      if (rule) {
        list.splice(pinx, 0, `${rule}`)
        pinx++
      }
    }
    {
      /** min-max length */
      let min = 0
      let max = 0
      if (props.minLength !== undefined) { min = Number(props.minLength) }
      if (props.maxLength !== undefined) { max = Number(props.maxLength) }
      if (min != 0 || max != 0) {
        list.splice(pinx, 0, `len:${min},${max}`)
        pinx++
      }
    }
  }
  log.trace('VALID-RULES:', list, props?.vrules)
  ret = list.join('|')
  return ret
}

const Message = defineComponent((props: MessageProps, ref: MessageProps['ref']) => {
  const self = useSetup({
    vars: {
      visible: false,
      style: {},
      anchor: C.UNDEFINED,
    },
    async updated() {
      if (props?.anchor) { vars.anchor = props.anchor?.current }
      // log.debug('CHECK-ERROR:', props.open(), vars.anchor)
      vars.visible = props.open()
      if (vars.visible) {
        const $el = $(vars.anchor)
        vars.style = { minWidth: `${$el.width()}px` }
      }
      update(C.UPDATE_SELF)
    }
  })
  const { vars, update } = self()
  return (
    <>
    {!isServer() && vars.anchor && vars.visible ? (
      <>
      { props.popper ? (
      <Popper
        open={ vars.visible }
        anchorEl={ vars.anchor }
        placement='bottom-start'
        >
        <div
          className={ 'msgspot error' }
          style={ vars.style }
          >
          { props.children }
        </div>
      </Popper>
      ) : (
      <div
        className={`msgspot error`}
        >
        { props.children }
      </div>
      ) }
      </>
    ) : '' }
    </>
  )
})
export { useForm, registForm, validateForm }
export default defineComponent((props: FormProps, ref: FormProps['ref'] & any) => {
  const pprops = copyExclude(props, [])
  const self = useSetup({
    async mounted() {
      if (ref && ref.hasOwnProperty('current')) {
        // log.debug('REF:', ref.current)
        const form = ref.current?.form
        ref.current = { }
        ref.current.form = form
      }
    }
  })
  return (<> {pprops.children} </>)
}, {
  displayName: 'form',
  Message
})