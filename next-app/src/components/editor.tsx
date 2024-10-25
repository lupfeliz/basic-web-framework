/**
 * @File        : editor.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 편집기 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { ComponentPropsWithRef } from 'react'
import { useEditor, EditorContent, type EditorContentProps, type Editor } from '@tiptap/react'
import { Mark, mergeAttributes } from '@tiptap/core'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import lodash from 'lodash'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'

const MenuBar = ({ editor }: { editor: Editor }) => {
  // const { editor } = useCurrentEditor()
  if (!editor) {
    return null
  }
  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={ () => editor.chain().focus().toggleBold().run() }
          disabled={ !editor.can().chain().focus().toggleBold().run() }
          className={ editor.isActive('bold') ? 'is-active' : '' }
          >
          <i className='bi bi-type-bold' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleItalic().run() }
          disabled={ !editor.can().chain().focus().toggleItalic().run() }
          className={ editor.isActive('italic') ? 'is-active' : '' }
          >
          <i className='bi bi-type-italic' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleStrike().run() }
          disabled={ !editor.can().chain().focus().toggleStrike().run() }
          className={ editor.isActive('strike') ? 'is-active' : '' }
          >
          <i className='bi bi-type-strikethrough' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleCode().run() }
          disabled={ !editor.can().chain().focus().toggleCode().run() }
          className={ editor.isActive('code') ? 'is-active' : '' }
          >
          <i className='bi bi-code-slash' />
        </button>
        <button onClick={ () => editor.chain().focus().unsetAllMarks().run() }>
          <i className='bi bi-trash3' />
        </button>
        {/* <button onClick={ () => editor.chain().focus().clearNodes().run() }>
          Clear nodes
        </button> */}
        <button
          onClick={ () => editor.chain().focus().setParagraph().run() }
          className={ editor.isActive('paragraph') ? 'is-active' : '' }
          >
          <i className='bi bi-paragraph' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleHeading({ level: 1 }).run() }
          className={ editor.isActive('heading', { level: 1 }) ? 'is-active' : '' }
          >
          <i className='bi bi-type-h1' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleHeading({ level: 2 }).run() }
          className={ editor.isActive('heading', { level: 2 }) ? 'is-active' : '' }
          >
          <i className='bi bi-type-h2' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleHeading({ level: 3 }).run() }
          className={ editor.isActive('heading', { level: 3 }) ? 'is-active' : '' }
          >
          <i className='bi bi-type-h3' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleHeading({ level: 4 }).run() }
          className={ editor.isActive('heading', { level: 4 }) ? 'is-active' : '' }
          >
          <i className='bi bi-type-h4' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleHeading({ level: 5 }).run() }
          className={ editor.isActive('heading', { level: 5 }) ? 'is-active' : '' }
          >
          <i className='bi bi-type-h5' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleHeading({ level: 6 }).run() }
          className={ editor.isActive('heading', { level: 6 }) ? 'is-active' : '' }
          >
          <i className='bi bi-type-h6' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleBulletList().run() }
          className={ editor.isActive('bulletList') ? 'is-active' : '' }
          >
          <i className='bi bi-list-ul' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleOrderedList().run() }
          className={ editor.isActive('orderedList') ? 'is-active' : '' }
          >
          <i className='bi bi-list-ol' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleCodeBlock().run() }
          className={ editor.isActive('codeBlock') ? 'is-active' : '' }
          >
          <i className='bi bi-code-square' />
        </button>
        <button
          onClick={ () => editor.chain().focus().toggleBlockquote().run() }
          className={ editor.isActive('blockquote') ? 'is-active' : '' }
          >
          <i className='bi bi-quote' />
        </button>
        <button onClick={ () => editor.chain().focus().setHorizontalRule().run() }>
          <i className='bi bi-dash-lg' />
        </button>
        <button onClick={ () => editor.chain().focus().setHardBreak().run() }>
          <i className='bi bi-arrow-return-left' />
        </button>
        <button
          onClick={ () => editor.chain().focus().undo().run() }
          disabled={ !editor.can().chain().focus().undo().run() }
          >
          <i className='bi bi-arrow-clockwise' />
        </button>
        <button
          onClick={ () => editor.chain().focus().redo().run() }
          disabled={ !editor.can().chain().focus().redo().run() }
          >
          <i className='bi bi-arrow-counterclockwise' />
        </button>
        <button
          onClick={ () => editor.chain().focus().setColor('#958DF1').run() }
          className={ editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : '' }
          >
          <i className='bi bi-eyedropper' />
        </button>
      </div>
    </div>
  )
}

/** 편집기 속성타입 상속 */
type EditorProps = ComponentPropsWithRef<'div'> & EditorContentProps & {
  model?: any
  name?: string
}

const COMPONENT = 'editor'
const { useRef, copyExclude, copyRef, useSetup, defineComponent, modelValue, getLogger, strm } = app
const { debounce } = lodash
const log = getLogger(COMPONENT)

export default defineComponent((props: EditorProps, ref: EditorProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'editor'])

  const self = useSetup({
    name: COMPONENT,
    props,
    vars: {
      elem: useRef(),
      editor: C.UNDEFINED as Editor
    },
    async mounted() {
      copyRef(ref, vars.elem)
    },
    updated: debounce(async (mode: number) => {
      /** 외부에서 강제 업데이트 신호를 받아도 100ms 정도 debounce 를 걸어준다 */
      if (mode === C.UPDATE_ENTIRE && vars) {
        const { value } = modelValue(self())
        self()?.vars?.editor?.commands.setContent(value)
      }
    }, 100)
  })
  const { vars, update } = self()

  vars.editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ }),
      // TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          /** TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help  */
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          /** TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help */
          keepAttributes: false,
        },
      }),
    ],
    content: '',
  }) as Editor

  /** 편집기 편집 이벤트는 자주 발생하기 때문에 debounce 로 이벤트 발생빈도를 낮춘다 */
  const onChange = debounce(async (v) => {
    const { setValue } = modelValue(self())
    setValue(v, () => update(C.UPDATE_FULL))
    if (props?.onChange) { props.onChange(v) }
  }, 100)
  vars.editor && vars.editor.on('transaction', ({ editor }) => {
    onChange(editor.getHTML())
  })
  return (
  <>
  <div className={ strm(`editor-component`) }>
    { vars.editor && (
      <MenuBar
        editor={ vars.editor }
        />
    ) }
    <EditorContent
      ref={ vars.elem as any }
      /* @ts-ignore */
      editor={ vars.editor }
      { ...pprops }
      />
  </div>
  </>
  )
})