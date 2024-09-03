/**
 * @File        : datagrid.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 그리드 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import { AgGridReact, AgGridReactProps } from 'ag-grid-react'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { MutableRefObject } from 'react'
type DataGridProps = AgGridReactProps & {
  ref: MutableRefObject<HTMLDivElement>
}

const { useSetup, clone, putAll, defineComponent, log, copyExclude, copyRef, useRef } = app

export default defineComponent((props: DataGridProps, ref: DataGridProps['ref']) => {
  const pprops = copyExclude(props, ['columnDefs', 'rowData', 'onGridReady'])
  const eref = useRef<any>()
  const self = useSetup({
    props,
    vars: {
      rowData: [ ] as any[],
      columnDefs: [ ] as any[]
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
        update(C.UPDATE_IF_NOT)
      }
    }
  })
  const { vars, update, ready } = self()
  const refreshData = (props: any) => {
    vars.columnDefs = putAll([], props?.columnDefs)
    vars.rowData = putAll([], props?.rowData)

    for (let cinx = 0; cinx < vars.columnDefs.length; cinx++) {
      const cdef = vars.columnDefs[cinx]
      const ocls = cdef?.cellClass || ''
      cdef.cellClass = (p: any) => {
        let o: any
        const ccls = p.colDef.cellClass
        let ret: string[] = []
        ret.push(`dgi-${p.node.rowIndex}-${ccls.inx}`)
        {
          let ocls = ccls?.ocls || '';
          if (ocls && ocls instanceof Function) { ocls = ocls(p) }
          if (ocls) { ret.push(ocls) }
        }
        {
          let rspan = (p.colDef?.rowSpan && p.colDef.rowSpan(p)) || 1
          if (rspan > 1) { ret.push('rspan-prime') }
        }
        {
          if ((o = p.data?.__cell_class) && (o = o[p.colDef.field])) { ret.push(o) }
        }
        return ret.join(' ')
      }
      cdef.cellClass.inx = cinx
      if (ocls) { cdef.cellClass.ocls = ocls }
    }
  }
  const onGridReady = async (e: any) => {
    const props = self().props
    if (props?.onGridReady) { props.onGridReady(e) }
  }
  return (
  <>
  { ready() && (
    <div 
      ref={ eref }
      className='ag-theme-quartz'
      style={{ height: 500 }}
      >
      <AgGridReact
        suppressRowTransform={ true }
        columnDefs={ vars?.columnDefs || [] }
        rowData={ vars?.rowData || [] }
        onGridReady={ onGridReady }
        { ...(pprops as any) }
        />
    </div>
  ) }
  </>
  )
})