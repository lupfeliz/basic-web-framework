/**
 * @File        : datagrid.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 그리드 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import { ComponentPropsWithRef } from 'react'
import { AgGridReact, AgGridReactProps } from 'ag-grid-react'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
type DataGridProps = AgGridReactProps & ComponentPropsWithRef<'div'> & { }

const { useSetup, clone, defineComponent, log } = app

export default defineComponent((props: DataGridProps, ref: DataGridProps['ref']) => {
  const self = useSetup({
    props,
    vars: {
      rowData: [ ] as any[],
      columnDefs: [ ] as any[]
    },
    async mounted() {
      vars.columnDefs = clone(props?.columnDefs || [])
      vars.rowData = clone(props?.rowData || [])
      update(C.UPDATE_SELF)
    },
    async unmount() {

    },
    async updated(mode) {
      if (mode === C.UPDATE_ENTIRE && vars) {
        const props = self().props
        vars.columnDefs = clone(props?.columnDefs || [])
        vars.rowData = clone(props?.rowData || [])
        update(C.UPDATE_IF_NOT)
      }
    }
  })
  const { vars, update, ready } = self()
  return (
  <>
  { ready && (
    <div 
      className='ag-theme-quartz'
      style={{ height: 500 }}
      >
      <AgGridReact
        columnDefs={ vars?.columnDefs || [] }
        rowData={ vars?.rowData || [] }
        />
    </div>
  ) }
  </>
  )
})