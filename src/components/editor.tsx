'use client'
import { ElementType, ComponentPropsWithRef, createElement, MouseEvent, useState, useRef } from 'react'
import TCKEditor from '@ckeditor/ckeditor5-react/dist/ckeditor'
import TClassicEditor from '@ckeditor/ckeditor5-build-classic/build/ckeditor'
import * as C from '@/libs/constants'
import app, { type ContextType } from '@/libs/app-context'

type EditorProps = ComponentPropsWithRef<'div'> & {
  model?: any
  name?: string
}
type ItemType = {
  props: EditorProps
  elem: any
}
type StoreType = {
  CKEditor?: typeof TCKEditor<TClassicEditor>
  ClassicEditor?: typeof TClassicEditor
}

const { log, genId, copyExclude, copyRef, useUpdate, useLauncher, putAll, subscribe, defineComponent, modelValue } = app

const ctx: ContextType<ItemType> & StoreType = {
  CKEditor: C.UNDEFINED,
  ClassicEditor: C.UNDEFINED
}
export default defineComponent((props: EditorProps, ref: EditorProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model'])
  const [id] = useState(genId())
  const elem: any = useRef()
  ctx[id] = putAll(ctx[id] || {}, { props, elem })
  useLauncher({
    async mounted() {
      copyRef(ref, elem)
      const { props, value } = modelValue(ctx[id])
      subscribe((state: number, mode: number) => {
        if (mode && ctx[id]) {
          const { props, value } = modelValue(ctx[id])
          update(app.state(1, 0))
        }
        update(state)
      })
      update(app.state(1))
    },
    async unmount() { delete ctx[id] }
  })
  const update = useUpdate()
  const onChange = async (e: any, v: any) => {
    const { props, setValue } = modelValue(ctx[id])
    setValue(v ? props?.value : '')
    update(app.state(1, 1))
  }
  return (
  <>
    <div>
      
    </div>
  </>
  )
})