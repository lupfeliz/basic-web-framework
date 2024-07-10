'use client'
import { ComponentPropsWithRef, useState, useRef } from 'react'
import { useEditor, EditorContent, EditorContentProps } from '@tiptap/react'
import { Mark, mergeAttributes } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import app, { type ContextType } from '@/libs/app-context'
import lodash from 'lodash'

const Span = Mark.create({
  name: 'span',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: false,
  parseHTML() { return [ { tag: 'span' }, ] },
  renderHTML({ HTMLAttributes }) { return ['span', mergeAttributes(HTMLAttributes), 0] },
  addAttributes() { return { class: { default: null }, style: { default: null } } },
})

type EditorProps = ComponentPropsWithRef<'div'> & EditorContentProps & {
  model?: any
  name?: string
}
type ItemType = {
  props: EditorProps
  elem: any,
  editor: any
}

const { genId, copyExclude, copyRef, useUpdate, useLauncher, putAll, subscribe, defineComponent, modelValue } = app
const { debounce } = lodash
const ctx: ContextType<ItemType> = {
}
export default defineComponent((props: EditorProps, ref: EditorProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'editor'])
  const [id] = useState(genId())
  const elem: any = useRef()
  const editor = useEditor({
    extensions: [StarterKit, Span],
    content: '',
  })

  ctx[id] = putAll(ctx[id] || {}, { props, elem, editor })
  useLauncher({
    async mounted() {
      copyRef(ref, elem)
      subscribe((state: number, mode: number) => {
        if (mode && ctx[id]) {
          const { value } = modelValue(ctx[id])
          ctx[id].editor && ctx[id].editor.commands.setContent(value)
          update(app.state(1, 0))
        }
        update(state)
      })
      update(app.state(1))
    },
    async unmount() { delete ctx[id] }
  })
  const update = useUpdate()
  const onChange = debounce(async (v) => {
    const { props, setValue } = modelValue(ctx[id])
    setValue(v)
    update(app.state(1))
  }, 100)
  editor && editor.on('transaction', ({ editor }) => {
    onChange(editor.getHTML())
  })
  return (
  <EditorContent ref={ elem }
    /* @ts-ignore */
    editor={ editor }
    { ...pprops }
    />
  )
})