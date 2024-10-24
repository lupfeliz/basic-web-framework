/**
 * @File        : select.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 선택 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { Dropdown , DropdownProps } from 'react-bootstrap'

import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import { registForm, type ValidationType } from '@/components/form'
import { isEvent, cancelEvent, KEYCODE_TABLE } from '@/libs/evdev'

/** 선택목록 타입 */
type OptionType = {
  name?: string
  value?: any
  selected?: boolean
}
/** mui 선택기 타입 상속 */
type InputProps = DropdownProps & Record<string, any> & {
  model?: any
  options?: OptionType[]
}

const COMPONENT = 'select'

const { getLogger, useRef, copyExclude, clear, copyRef, useSetup, defineComponent, modelValue, putAll } = app

const log = getLogger(COMPONENT)
log.setLevel('trace')

export default defineComponent((props: InputProps, ref: InputProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'options', 'onChange'])
  const self = useSetup({
    name: COMPONENT,
    props,
    vars: {
      index: 0,
      value: '',
      text: '',
      options: [] as OptionType[],
      menuvisb: false,
      elem: useRef<any>(),
      valid: {
        type: 'select',
        error: false,
        isValidated: false,
        isValid: C.UNDEFINED,
        message: C.UNDEFINED,
      } as ValidationType
    },
    async mounted() {
      copyRef(ref, vars.elem)
      registForm(self, () => vars?.elem)
    }
  })
  const { vars, update } = self()

  /** 렌더링 시 필요한 선택목록 정보 조합 */
  if (props?.options && props?.options instanceof Array && vars?.options) {
    clear(vars.options)
    const { value: mvalue } = modelValue(self())
    for (let inx = 0; inx < props.options.length; inx++) {
      const item: any = props.options[inx]
      let value = typeof item === C.STRING ? item : item?.value || ''
      let name = item?.name || value
      if (value == mvalue) {
        vars.index = inx
        vars.value = value
      }
      vars.options.push({ name: name, value: value, selected: value == mvalue })
    }
    if (mvalue === undefined) { vars.index = 0 }
    vars.text = vars.options[vars.index].name || ''
  }

  const onChange = async (e: any, v: any) => {
    // log.debug('CHANGE..', e?.target, v)
    const { setValue } = modelValue(self())
    let options: OptionType[] = vars.options as any
    const inx = vars.index = Number(v || 0)
    setValue(options[inx].value, () => update(C.UPDATE_FULL))
    /** 변경시 데이터모델에 값전달 */
    if (props.onChange) { props.onChange(e as any) }
  }

  const onKeyDown = async (e: KeyboardEvent) => {
    const { setValue } = modelValue(self())
    if (vars.menuvisb) {
      /** FIXME: evdev 완성후 수정할것 */
      switch (Number(e.keyCode)) {
      case KEYCODE_TABLE.PC.ArrowUp: {
        if (vars.index > 0) { vars.index -= 1 }
        if (isEvent(e)) { cancelEvent(e) }
        update(C.UPDATE_SELF)
      } break
      case KEYCODE_TABLE.PC.ArrowDown: {
        if (vars.index < vars.options.length - 1) { vars.index += 1 }
        if (isEvent(e)) { cancelEvent(e) }
        update(C.UPDATE_SELF)
      } break 
      default: }
      vars.options[vars.index].selected = true
      setValue(vars.options[vars.index].value)
    }
  }

  const onToggle = async (v: boolean) => { vars.menuvisb = v }

  return (
  <Dropdown
    onSelect={ (v, e) => onChange(e, v) }
    onKeyDown={ onKeyDown as any }
    onToggle={ onToggle }
    >
    <Dropdown.Toggle
      ref={ vars?.elem }
      variant='light'
      style={{
        border: '1px solid #ccc'
      }}
      role='combobox'
      tabIndex={ props.tabIndex !== undefined ? props.tabIndex : 0 }
      >
      { vars.text || props.children }
    </Dropdown.Toggle>
    {/* 선택목록 생성*/}
    <Dropdown.Menu show={ vars.menuvisb }>
      { vars?.options?.length > 0 && vars.options.map((itm, inx) => (
      <Dropdown.Item
        key={ inx }
        eventKey={ inx }
        active={ itm?.selected || false }
        >
        { `${itm?.name}` }
      </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
  )
})