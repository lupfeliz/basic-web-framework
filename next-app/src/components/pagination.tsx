/**
 * @File        : pagination.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : Pagination 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import _Pagination, { PaginationProps as _PaginationProps } from 'react-bootstrap/Pagination'
import * as C from '@/libs/constants'
import Paging from '@/libs/paging'
import app from '@/libs/app-context'
import values from '@/libs/values'

const COMPONENT = 'pagination'
const { defineComponent, copyExclude, useSetup, copyRef, useRef, getLogger, modelValue, putAll } = app
const log = getLogger(COMPONENT)

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
    name: COMPONENT,
    vars: {
      pageTotal: 0,
      pageStart: 0,
      pageEnd: 0,
      rowStart: 0,
      rowEnd: 0,
    },
    async mounted() {
      copyRef(ref, elem)
      update(C.UPDATE_FULL)
    },
    async updated() {
      if (!model.currentPage) { model.currentPage = 1 }
      if (!model.rowCount) { model.rowCount = 10 }
      if (!model.pageCount) { model.pageCount = 10 }
      if (!model.rowTotal) { model.rowTotal = 0 }
      if (!vars.pageTotal) { vars.pageTotal = Math.ceil(1.0 * model.rowTotal / model.rowCount) }
      if (model.currentPage > vars.pageTotal) { model.currentPage = vars.pageTotal }
      log.debug('ROW-TOTAL:', model.rowTotal)
      model.rowStart = (model.currentPage - 1) * model.rowCount
      const paging = new Paging(model.rowCount, model.pageCount, model.rowTotal)
      const [pageStart, pageEnd, pageTotal] = paging.pageNumbers(model.currentPage)
      putAll(vars, { pageStart, pageEnd, pageTotal })
      log.debug('PAGES:', model.currentPage, paging.pageNumbers(model.currentPage))
      log.debug('ROWS:', model.currentPage, paging.rowNumbers(model.currentPage))
      update(C.UPDATE_SELF)
    }
  })
  const { vars, update } = self()
  const model = props.model || {}
  const onChange = (e: any, n: number) => {
    log.debug('ON-CHANGE:', e, n)
    if (!n) { n = 1 }
    if (!vars.pageTotal) { vars.pageTotal = 0 }
    if (n > vars.pageTotal) { n = vars.pageTotal || 1 }
    if (n < 1) { n = 1 }
    model.rowStart = (n - 1) * (model.rowCount || 10)
    model.currentPage = n
    if (props?.onChange && props.onChange instanceof Function) {
      (props as any).onChange()
    }
  }
  return (
  <>
  { vars.pageStart > 0 && (
  <div>
    <_Pagination>
    { Array.from({ length: Number(vars.pageEnd - vars.pageStart + 1) }, (_, inx) => {
      const page = vars.pageStart + inx 
      return (
      <_Pagination.Item
        key={ page }
        active={ Number(page) == Number(model.currentPage) }
        onClick={ (e) => onChange(e, page) }
        >
        { page }
      </_Pagination.Item>
      ) }) }
    </_Pagination>
  </div>
  ) }
  </>
  )
})