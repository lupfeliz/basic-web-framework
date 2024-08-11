'use client'
import { ComponentPropsWithRef, useRef } from 'react'
import { useEditor, EditorContent, EditorContentProps } from '@tiptap/react'
import { Mark, mergeAttributes } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
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

const { log, copyExclude, copyRef, useSetup, defineComponent, modelValue } = app
const { debounce } = lodash
export default defineComponent((props: EditorProps, ref: EditorProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'editor'])
  const elem: any = useRef()
  const editor = useEditor({
    extensions: [StarterKit, Span],
    content: '',
  })

  const self = useSetup({
    name: 'editor',
    props,
    vars: { editor },
    async mounted() {
      copyRef(ref, elem)
    },
    updated: debounce(async (mode: number) => {
      if (mode && vars) {
        const { value } = modelValue(self())
        self()?.vars?.editor?.commands.setContent(value)
      }
    }, 100)
  })
  const { vars, update } = self()
  const onChange = debounce(async (v) => {
    const { setValue } = modelValue(self())
    setValue(v, () => update(C.UPDATE_FULL))
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