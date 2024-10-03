/**
 * @File        : pagination.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : Pagination 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
// import _Pagination, { PaginationProps as _PaginationProps } from '@mui/material/Pagination';
// import _Stack from '@mui/material/Stack';
import _Pagination, { PaginationProps as _PaginationProps } from 'react-bootstrap/Pagination'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'

const { defineComponent, copyExclude, useSetup, copyRef, useRef, log } = app

type PaginationProps = _PaginationProps & Record<string, any> & {
  onChange?: Function
  model?: {
    currentPage?: number
    pageCount?: number
    rowCount?: number
    rowStart?: number
    rowTotal?: number
  },
}
export default defineComponent((props: PaginationProps, ref: PaginationProps['ref']) => {
  const pprops = copyExclude(props, ['onChange', 'model'])
  const elem = useRef({} as HTMLDivElement)
  const self = useSetup({
    name: 'pagination',
    vars: props.model || { },
    async mounted() {
      copyRef(ref, elem)
      update(C.UPDATE_FULL)
    },
    async updated() {
      if (!vars.currentPage) { vars.currentPage = 1 }
      if (!vars.rowCount) { vars.rowCount = 10 }
      if (!vars.rowTotal) { vars.rowTotal = 0 }
      if (!vars.pageCount) { vars.pageCount = Math.ceil(1.0 * vars.rowTotal / vars.rowCount) }
      if (vars.currentPage > vars.pageCount) { vars.currentPage = vars.pageCount }
      vars.rowStart = (vars.currentPage - 1) * vars.rowCount
      update(C.UPDATE_SELF)
    }
  })
  const { vars, update } = self()
  const onChange = (e: any, n: number) => {
    log.debug('ON-CHANGE:', e, n)
    if (!n) { n = 1 }
    if (!vars.pageCount) { vars.pageCount = 0 }
    if (n > vars.pageCount) { n = vars.pageCount || 1 }
    if (n < 1) { n = 1 }
    vars.rowStart = (n - 1) * (vars.rowCount || 10)
    vars.currentPage = n
    if (props?.onChange && props.onChange instanceof Function) {
      (props as any).onChange()
    }
  }
  return (
  <>
  <div>
    <_Pagination
    >
    { Array.from({ length: Number(vars.pageCount) }, (_, inx) => {
      const page = (Math.ceil(1.0 * Number(vars.rowStart) / Number(vars.rowCount)) || 1) + inx 
      return (
      <_Pagination.Item
        key={ page }
        active={ Number(page) == Number(vars.currentPage) }
        onClick={ (e) => onChange(e, page) }
        >
        { page }
      </_Pagination.Item>
      ) }) }
    </_Pagination>
  </div>
  </>
  )
})