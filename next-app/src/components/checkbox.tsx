/**
 * @File        : checkbox.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 체크박스 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { FormCheck as _Checkbox, FormCheckProps as _CheckboxProps } from 'react-bootstrap'
import app from '@/libs/app-context'
import values from '@/libs/values'
import * as C from '@/libs/constants'
import { registForm, type ValidationType } from '@/components/form'

const CheckboxPropsSchema = {
  model: {} as any,
  onChange: (() => '') as (Function | undefined),
  type: '' as 'checkbox' | 'radio',
  vrules: '' as string,
  validctx: {} as any,
}

/** mui 기본 체크박스(라디오버튼) 속성 타입 상속  */
type CheckboxProps = _CheckboxProps & Record<string, any> & Partial<typeof CheckboxPropsSchema>

const COMPONENT = 'checkbox'
const { useRef, copyExclude, copyRef, useSetup, defineComponent, modelValue, getLogger } = app
const log = getLogger(COMPONENT)

export default defineComponent((props: CheckboxProps, ref: CheckboxProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model'])
  const self = useSetup({
    name: COMPONENT,
    props,
    vars: {
      checked: false,
      elem: useRef<HTMLInputElement>(),
      valid: {
        type: 'checkbox',
        error: false,
        isValidated: false,
        isValid: C.UNDEFINED,
        message: C.UNDEFINED,
      } as ValidationType
    },
    async mounted() {
      copyRef(ref, vars.elem)
      registForm(self, () => vars?.elem)
      /** 초기 데이터 화면반영 */
      const { props, value } = modelValue(self())
      vars.checked = props?.value == value
    },
    async updated() {
      /** 데이터가 변경되면 실제 화면에 즉시 반영 */
      const { props, value } = modelValue(self())
      vars.checked = props?.value == value
    }
  })
  const { uid, vars, update, ready } = self()
  /** 체크박스 변경 이벤트 발생시 처리 */
  const onChange = async (e: InputEvent) => {
    // log.debug('ON-CHANGE:', e)
    const { props, setValue } = modelValue(self())
    setValue(vars?.elem?.current?.checked ? props?.value : '')
    vars.checked = vars?.elem?.current?.checked || false
    update(C.UPDATE_FULL)
  }
  return (
  <span className='form-check inline-block'>
  {/* 표현타입에 따라 체크박스 또는 라디오버튼 으로 표현된다 */}
  { values.matcher(props.type, 'checkbox',
    'checkbox', (
    <input
      ref={ vars?.elem as any }
      id={ ready() ? uid : C.UNDEFINED }
      type='checkbox'
      className='form-check-input'
      { ...pprops }
      checked={ vars.checked || false }
      onChange={ onChange as any }
      tabIndex={ props.tabIndex !== undefined ? props.tabIndex : 0 }
      role='checkbox'
      />
    ),
    'radio', (
    <input
      ref={ vars?.elem as any }
      id={ ready() ? uid : C.UNDEFINED }
      type='radio'
      className='form-check-input'
      { ...pprops }
      checked={ vars.checked || false }
      onChange={ onChange as any }
      tabIndex={ props.tabIndex !== undefined ? props.tabIndex : 0 }
      role='radio'
      />
    )
  )}
  </span>
  )
})