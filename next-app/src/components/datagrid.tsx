/**
 * @File        : datagrid.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 그리드 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { AgGridReact, AgGridReactProps, CustomDateProps } from 'ag-grid-react'
import app from '@/libs/app-context'
import values from '@/libs/values'
import * as C from '@/libs/constants'
import $ from 'jquery'

import { CSSProperties, MutableRefObject } from 'react'
import { ColDef, ColSpanParams, GridApi, GridReadyEvent, RowSpanParams, CellClassParams, RowDataUpdatedEvent, SortChangedEvent, GridPreDestroyedEvent, CellMouseOverEvent, CellMouseOutEvent } from 'ag-grid-community'

type DataGridProps = AgGridReactProps & Record<string, any> & Partial<typeof DataGridPropsSchema> & { }

const DataGridPropsSchema = {
  gridClass: '',
  gridStyle: {},
  ref: C.UNDEFINED as MutableRefObject<HTMLDivElement>,
  suppressPropertyNamesCheck: true,
  suppressRowTransform: true,
  columnDefs: [] as ColDef[],
  rowData: [] as any[],
  onGridReady: async (e: GridReadyEvent) => ({} as any),
  onGridPreDestroyed: async (e: GridPreDestroyedEvent) => ({} as any),
  onRowDataUpdated: async (e: RowDataUpdatedEvent) => ({} as any),
  onSortChanged: async (e: SortChangedEvent) => ({} as any),
}

const COMPONENT = 'datagrid'
const { useSetup, putAll, defineComponent, getLogger, copyExclude, copyRef, useRef, until, getFrom } = app
const log = getLogger(COMPONENT)

export default defineComponent((props: DataGridProps, ref: DataGridProps['ref']) => {
  const pprops = copyExclude(props, values.merge(Object.keys(DataGridPropsSchema), [ ]))
  const self = useSetup({
    name: COMPONENT,
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
      api: C.UNDEFINED as GridApi,
      gridobj: C.UNDEFINED as any,
      elem: useRef<any>(),
      $gridwrap: C.UNDEFINED as JQuery<HTMLElement>,
      $gridview: C.UNDEFINED as JQuery<HTMLElement>,
    },
    async mounted() {
      copyRef(ref, vars.elem)
      await refreshData(self().props)
      update(C.UPDATE_SELF)
    },
    async unmount() {
    },
    async updated(mode) {
      if (mode === C.UPDATE_ENTIRE) {
        // log.debug('UPDATE-GRID:', self().props?.rowData)
        await refreshData(self().props)
        update()
      }
    }
  })
  const { vars, update, ready } = self()
  const refreshData = async (props: any, phase: number = 0) => {
    vars.ctx.phase = phase
    vars.columnDefs = putAll([], props?.columnDefs)
    vars.rowData = putAll([], props?.rowData)
    await until(() => ready())
    switch (phase) {
    case 1: {
      afterSort()
      LOOP_COL: for (let cinx = 0; cinx < vars.columnDefs.length; cinx++) {
        const cdef = vars.columnDefs[cinx]
        const cfld = String(cdef.field || '')
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
            // log.debug('CELL-CLASS:', p.colDef.field, p.rowIndex)
            // const spaninf = vars.ctx.rowSpan[`${p.colDef.field}`][p.rowIndex]
            // if (spaninf) { log.debug('CELL-SPAN:', spaninf) }
            // const ccls = p.colDef.cellClass
            const rinx = Number(p.node.rowIndex || 0)
            let ret: string[] = []
            ret.push(`dgi-${p.colDef.field}-${rinx}`)
            {
              if ((vars.ctx.cellStyle[cfld] || [])[rinx]) {
                ret.push(vars.ctx.cellStyle[cfld][rinx])
              }
            }
            return ret.join(' ')
          }
        }
      }
      update(C.UPDATE_SELF)
    } break
    default: }
    // vars.gridobj.setGridOption('columnDefs', vars.columnDefs)
    // vars.gridobj.setGridOption('rowData', vars.rowData) 
  }
  const afterSort = () => {
    let o: any
    vars.ctx.rowSpan = {}
    CLOOP: for (let cinx = 0; cinx < vars.columnDefs.length; cinx++) {
      const cdef = o = vars.columnDefs[cinx]
      const cfld = cdef.field || ''
      const vcrsp = vars.ctx.rowSpan[cfld] = [] as any[]
      const vccst = vars.ctx.cellStyle[cfld] = [] as any[]
      const sorted = []
      if (cfld && o.groupBy) {
        let sval = C.UNDEFINED
        const getSpaninf = (rinx1: number) => vcrsp[rinx1] || (vcrsp[rinx1] = {})
        let spaninf = C.UNDEFINED
        for (let rinx = 0; rinx < vars.rowData.length; rinx++) { sorted[rinx] = vars.api?.getDisplayedRowAtIndex(rinx) }
        RLOOP: for (let rinx = 0; rinx < sorted.length; rinx++) {
          const oinx = Number(sorted[rinx]?.rowIndex || 0)
          const crow = sorted[rinx]?.data || {}
          if (sval === crow[cfld]) {
            if (spaninf) {
              spaninf.topctx.size += 1
              if (!vccst[spaninf.topinx]) { vccst[spaninf.topinx] = [] }
              if (!vccst[oinx]) { vccst[oinx] = [] }
              if (vccst[spaninf.topinx].indexOf('rspan-prime') === -1) { vccst[spaninf.topinx].push('rspan-prime') }
              if ((o = vccst[spaninf.topinx].indexOf('rspan-slave')) !== -1) { vccst[spaninf.topinx].splice(o, 1) }
              if (vccst[oinx].indexOf('rspan-slave') === -1) { vccst[oinx].push('rspan-slave') }
              if ((o = vccst[oinx].indexOf('rspan-prime')) !== -1) { vccst[oinx].splice(o, 1) }
            }
            putAll(getSpaninf(rinx), { size: 1, oinx: oinx, topinx: spaninf? spaninf.oinx : oinx, topctx: spaninf })
          } else {
            putAll(spaninf = getSpaninf(rinx), { size: 1, oinx: oinx, topinx: oinx, topctx: spaninf })
          }
          sval = crow[cfld]
        }
        log.trace('CHECK-ROWSPAN:', cfld, vcrsp)
      }
    }
  }
  const onGridReady = async (e: GridReadyEvent) => {
    vars.api = e.api
    const props = self().props
    vars.$gridwrap = $(vars.elem.current).find('.ag-root-wrapper')
    vars.$gridview = vars.$gridwrap.find('.ag-body-viewport')
    if (props?.onGridReady) { props.onGridReady(e) }
  }
  const onGridPreDestroyed = async (e: GridPreDestroyedEvent) => {
    const props = self().props
    if (props?.onGridPreDestroyed) { props.onGridPreDestroyed(e) }
  }
  const onRowDataUpdated = async (e: RowDataUpdatedEvent) => {
    const props = self().props
    log.trace('ONROWDATAUPDATED:', vars.ctx.phase)
    switch (vars.ctx.phase) {
    case 0: {
      refreshData(self().props, 1)
    } break
    default: }
    if (props?.onRowDataUpdated) { props.onRowDataUpdated(e) }
  }
  const onSortChanged = async (e: SortChangedEvent) => {
    await until(() => vars.api, { maxcheck: 1000, interval: 10 })
    afterSort()
    vars.api.setGridOption('columnDefs', vars.columnDefs)
    if (props?.onSortChanged) { props.onSortChanged(e) }
  }
  const onCellMouseOver = async (e: CellMouseOverEvent) => {
    const { props } = self()
    // log.debug('MOUSE-OVER:', e)
    // log.debug('CHECK:', vars.rowData[Number(e.rowIndex || 0)][`${e.colDef.field}`])
    // const spaninf = vars.ctx.rowSpan[`${e.colDef.field}`]
    const rinx = Number(e.rowIndex)
    LOOP1: for (const col of props?.columnDefs || []) {
      const spaninf = vars.ctx.rowSpan[`${col.field}`]
      if (spaninf && spaninf[rinx]?.topctx) {
        const topctx = spaninf[rinx]?.topctx
        const el = $(vars.elem.current).find(`.dgi-${col.field}-${topctx.oinx}`)
        if (el.length > 0) {
          el.addClass('ag-cell-hover')
          // log.debug('SPAN-INF:', spaninf[rinx], el)
          // spaninf[rinx].topctx.hover = true
        }
      }
      // LOOP2: for (const itm of spaninf) {
      //   if (!itm) { continue LOOP2 }
      //   if (rinx >= itm.oinx && rinx < (itm.oinx + itm.size)) {
      //     log.debug('ROWSPAN:', col.field, rinx, itm.oinx, itm.topinx)
      //   }
      // }
    }
    // for (let inx = 0; inx < (spaninf?.length || 0); inx++) {
    //   if (spaninf[inx]) {
    //     log.debug('CHECK:', rinx, rinx >= spaninf[inx].oinx, rinx < (spaninf[inx].oinx + spaninf[inx].size), spaninf)
    //   }
    // }
  }
  const onCellMouseOut = async (e: CellMouseOutEvent) => {
    const { props } = self()
    const rinx = Number(e.rowIndex)
    LOOP1: for (const col of props?.columnDefs || []) {
      const spaninf = vars.ctx.rowSpan[`${col.field}`]
      if (spaninf && spaninf[rinx]?.topctx) {
        const topctx = spaninf[rinx]?.topctx
        const el = $(vars.elem.current).find(`.dgi-${col.field}-${topctx.oinx}`)
        if (el.length > 0) { el.removeClass('ag-cell-hover') }
      }
    }
  }
  return (
  <>
  { ready() && (
    <div 
      ref={ vars?.elem }
      className={ props.gridClass || 'ag-theme-quartz' }
      style={ props.gridStyle || {} }
      >
      <AgGridReact
        suppressDragLeaveHidesColumns={ true }
        suppressPropertyNamesCheck={ true }
        suppressRowTransform={ true }
        columnDefs={ vars?.columnDefs || [] }
        rowData={ vars?.rowData || [] }
        onGridReady={ onGridReady }
        onGridPreDestroyed={ onGridPreDestroyed }
        onRowDataUpdated={ onRowDataUpdated }
        onSortChanged={ onSortChanged }
        onCellMouseOver={ onCellMouseOver }
        onCellMouseOut={ onCellMouseOut }
        { ...(pprops as any) }
        />
    </div>
  ) }
  </>
  )
})