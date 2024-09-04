/**
 * @File        : datagrid.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 그리드 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import { AgGridReact, AgGridReactProps, CustomDateProps } from 'ag-grid-react'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
import $ from 'jquery'
import lodash from 'lodash'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { CSSProperties, MutableRefObject } from 'react'
import { ColDef, ColSpanParams, GridApi, GridReadyEvent, RowSpanParams, CellClassParams, RowDataUpdatedEvent, SortChangedEvent } from 'ag-grid-community'
type DataGridProps = AgGridReactProps & {
  gridClass: string
  gridStyle: CSSProperties
  ref: MutableRefObject<HTMLDivElement>
}

const { useSetup, clone, putAll, defineComponent, log, copyExclude, copyRef, useRef } = app
const { debounce } = lodash

export default defineComponent((props: DataGridProps, ref: DataGridProps['ref']) => {
  const pprops = copyExclude(props, ['columnDefs', 'rowData', 'onGridReady'])
  const eref = useRef<any>()
  const self = useSetup({
    props,
    vars: {
      rowData: [ ] as any[],
      columnDefs: [ ] as ColDef[],
      ctx: {
        cols: [] as any[],
        rows: [] as any[],
        sort: [] as any[],
        rowSpan: {} as any,
        cellStyle: {} as any,
        phase: 0
      },
      api: { } as GridApi
    },
    async mounted() {
      copyRef(ref, eref)
      refreshData(props)
      update(C.UPDATE_SELF)
    },
    async unmount() {
    },
    async updated(mode) {
      if (mode === C.UPDATE_ENTIRE && vars) {
        refreshData(self().props)
        /** FIXME: rowspan 적용, cellclass 적용 이 한꺼번에 되지 않아 부득이 2번 호출해 주어야 함. */
        setTimeout(() => refreshData(self().props), 100)
        // setTimeout(() => render1(), 100)
        // setTimeout(() => {
        //   const { props } = self()
        //   vars.columnDefs = putAll([], props?.columnDefs)
        //   vars.rowData = putAll([], props?.rowData)
        // }, 100)
        update(C.UPDATE_SELF)
      }
    }
  })
  const { vars, update, ready } = self()
  const refreshData = (props: any, phase: number = 0) => {
    vars.ctx.phase = phase
    switch (phase) {
    case 0: {
      vars.columnDefs = putAll([], props?.columnDefs)
      vars.rowData = putAll([], props?.rowData)
      vars.ctx.rows = []
      vars.ctx.cols = []
      // /**  처음부터 rowspan 등을 계산한다 */
      // for (let rinx = 0; rinx < vars.rowData.length; rinx++) { }
      LOOP_COL: for (let cinx = 0; cinx < vars.columnDefs.length; cinx++) {
        const cdef = vars.columnDefs[cinx]
        const cfld = String(cdef.field || '')
        vars.ctx.cols.push({
          rowSpan: cdef?.rowSpan,
          cellClass: cdef?.cellClass,
          cellStyle: cdef?.cellStyle
        })
        {
          if ((cdef as any).groupBy) {
            for (let rinx = 0; rinx < vars.rowData.length; rinx++) {
              const row = vars.rowData[rinx]
            }
          }
        }
        // {
        //   const ocspn = cdef?.colSpan
        //   cdef.colSpan = (p: ColSpanParams<any, any>) => {
        //     return 1
        //   }
        // }
        {
          cdef.rowSpan = (p: RowSpanParams<any, any>) => {
            let ret = 1
            if (p.node) {
              if(vars.ctx.rowSpan[cfld]) {
                ret = (vars.ctx.rowSpan[cfld][p.node.rowIndex || 0] || {}).size || 1
              }
            }
            return ret
          }
        }
        {
          cdef.cellClass = (p: CellClassParams) => {
            let o: any
            const ccls = p.colDef.cellClass
            const rinx = Number(p.node.rowIndex || 0)
            let ret: string[] = []
            ret.push(`dgi-${rinx}-${cinx}`)
            {
              if ((vars.ctx.cellStyle[cfld] || [])[rinx]) {
                ret.push(vars.ctx.cellStyle[cfld][rinx])
              }
            }
            return ret.join(' ')
          }
        }
  //       {
  //         const ocmpr = cdef?.comparator
  //         cdef.comparator = (v1: any, v2: any, n1: any, n2: any, desc: any) => {
  // // if (v1 === 33850) {
  // //   n1.data.__cell_class = { make: `red` }
  // //   n1.data.price = 1
  // //   dbupdate()
  // // }
  //           // log.debug('VALUE:', v1, v2, n1, n2, vars.columnDefs[cinx].field, desc)
  //           if (v1 == v2) { return 0 }
  //           return (v1 > v2) ? 1 : -1
  //         }
  //         if (ocmpr) { (cdef.comparator as any).ocmpr = ocmpr }
  //       }
      }
    } break
    case 1: {

    } break
    default: }
    afterSort()
    // setTimeout(render1, 500)
  }
  const afterSort = () => {
    let o: any
    vars.ctx.rowSpan = {}
    CLOOP: for (let cinx = 0; cinx < vars.columnDefs.length; cinx++) {
      const cdef = o = vars.columnDefs[cinx]
      const cfld = cdef.field || ''
      const vcrsp = vars.ctx.rowSpan[cfld] = [] as any[]
      const vccst = vars.ctx.cellStyle[cfld] = [] as any[]
      if (cfld && o.groupBy) {
        let sval = C.UNDEFINED
        const getSpaninf = (rinx1: number) => vcrsp[rinx1] || (vcrsp[rinx1] = {})
        let spaninf = C.UNDEFINED
        RLOOP: for (let rinx = 0; rinx < vars.rowData.length; rinx++) {
          const rinx1 = vars.api?.getDisplayedRowAtIndex(rinx)?.rowIndex || 0
          const crow = vars.rowData[rinx1]
          if (sval === crow[cfld]) {
            if (spaninf) {
              spaninf.topctx.size += 1
              if (!vccst[spaninf.topinx]) { vccst[spaninf.topinx] = [] }
              if (!vccst[rinx]) { vccst[rinx] = [] }
              if (vccst[spaninf.topinx].indexOf('rspan-prime') === -1) { vccst[spaninf.topinx].push('rspan-prime') }
              if ((o = vccst[spaninf.topinx].indexOf('rspan-slave')) !== -1) { vccst[spaninf.topinx].splice(o, 1) }
              if (vccst[rinx].indexOf('rspan-slave') === -1) { vccst[rinx].push('rspan-slave') }
              if ((o = vccst[rinx].indexOf('rspan-prime')) !== -1) { vccst[rinx].splice(o, 1) }
            }
          } else {
            putAll(spaninf = getSpaninf(rinx), { size: 1, topinx: rinx, toprow: crow, topctx: spaninf })
          }
          sval = crow[cfld]
        }
        log.debug('CHECK-ROWSPAN:', cfld, vcrsp)
      }
    }
  }
  const render1 = async () => {
    vars.columnDefs = putAll([], vars.columnDefs)
    vars.rowData = putAll([], vars.rowData)
  }
  // const render1 = async () => {
  //   vars.ctx.phase = 1
  //   let cinx = 0
  //   let cfld = 'make'
  //   for (let rinx = 0; rinx < vars.rowData.length; rinx++) {
  //     const rowIndex = vars.api?.getDisplayedRowAtIndex(rinx)?.rowIndex || 0
  //     const row = vars.rowData[rowIndex]
  //   }
  //   update(C.UPDATE_SELF)
  // }
  // const render2 = async () => {
  //   vars.ctx.phase = 2
  //   update(C.UPDATE_SELF)
  // }
  const onGridReady = async (e: GridReadyEvent) => {
    vars.api = e.api
    // vars.api?.getState()?.sort?.sortModel
    const props = self().props
    if (props?.onGridReady) { props.onGridReady(e) }

// ({ GRIDUPDATE: dbupdate, GRIDAPI: e.api, VARS: vars })
{
(window as any).GRIDUPDATE = dbupdate;
(window as any).GRIDAPI = e.api;
(window as any).VARS = vars;
}
  }
  const onRowDataUpdated = async (e: RowDataUpdatedEvent) => {
  }
  const onSortChanged = async (e: SortChangedEvent) => {
    const sorted = []
    for (let inx = 0; inx < vars.rowData.length; inx++) {
      sorted.push(vars.api.getDisplayedRowAtIndex(inx)?.data)
    }
    log.debug('SORTED:', sorted)
    refreshData(self().props)
    setTimeout(() => refreshData(self().props), 100)
    update(C.UPDATE_SELF)
  }
  const dbupdate = debounce(() => {
    log.debug('ROW-DATA:', vars.rowData)
    vars.api.setGridOption('columnDefs', vars.columnDefs)
    vars.api.setGridOption('rowData', vars.rowData)
  }, 100)
  return (
  <>
  { ready() && (
    <div 
      ref={ eref }
      className={ props.gridClass || 'ag-theme-quartz' }
      style={ props.gridStyle }
      >
      <AgGridReact
        suppressPropertyNamesCheck={ true }
        suppressRowTransform={ true }
        columnDefs={ vars?.columnDefs || [] }
        rowData={ vars?.rowData || [] }
        onGridReady={ onGridReady }
        onRowDataUpdated={ onRowDataUpdated }
        onSortChanged={ onSortChanged }
        { ...(pprops as any) }
        />
    </div>
  ) }
  </>
  )
})