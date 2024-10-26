/**
 * @File        : editor-classic.tsx
 * @Author      : 정재백
 * @Since       : 2024-05-07
 * @Description : 클래식 편집기 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import { ComponentPropsWithRef, useRef } from 'react'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import loader from '@/libs/js-loader'
import { registForm } from '@/components/form'
import lodash from 'lodash'
import $ from 'jquery'

const EditorPropsSchema = {
  form: C.UNDEFINED,
  model: C.UNDEFINED,
  maxHeight: 0
}

type EditorProps = ComponentPropsWithRef<'div'> & Partial<typeof EditorPropsSchema> & {
  name?: string
  value?: any
}

const UNFILTERED_HTML = 'unfiltered_html'

const COMPONENT = 'editor-classic'
const { debounce } = lodash
const { defineComponent, copyExclude, putAll, copyRef, until, useSetup, getLogger, modelValue } = app
const log = getLogger(COMPONENT)
const ectx = {
  CKEDITOR: C.UNDEFINED,
  fontNames: '',
  refresh: 0,
}

export default defineComponent((props: EditorProps, ref: EditorProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'form', 'maxHeight'])
  const self = useSetup({
    name: COMPONENT,
    vars: {
      elem: useRef(),
      editor: C.UNDEFINED,
      editable: C.UNDEFINED,
      error: C.UNDEFINED,
      init: C.UNDEFINED as Function,
      message: '',
      anchor: C.UNDEFINED,
    },
    async mounted() {
      try {
        const win = app.window()
        if (!ectx.CKEDITOR) {
          const res = await loader.load(`/assets/ckeditor/ckeditor.js`)
          await until(() => win.CKEDITOR)
          log.trace('CHECK:', win.CKEDITOR)
          win && (ectx.CKEDITOR = win.CKEDITOR).on('instanceCreated', (e: any) => {
            if (e?.editor?.name) {
              const eid = e.editor.name.replace(/^editor-/g, '')
              if (vars) {
                vars.editor = e.editor
                if (vars.init) { vars.init() }
              }
            }
          })
        }
        vars.init = async () => {
          const editor = vars.editor
          const { value, setValue } = modelValue(self())
          editor.setData(value)
        }

        /** 편집기가 활성화 될때까지 기다린다 */
        await until(() => !!$(`#editor-${uid}`)[0])

        const editor = ectx.CKEDITOR.replace(`editor-${uid}`, {
          width: 'auto',
          on: { pluginsLoaded: (e: any) => { log.trace('PLUGIN:', e) } },
          toolbar : [
            ['Undo', 'Redo', 'Format', 'Font', 'FontSize', 'Bold', 'Italic', 'Underline',
            'TextColor', 'BGColor', 'RemoveFormat', 'BulletedList', 'NumberedList',
            'Copy', 'Cut', 'Indent', 'Outdent', 'Link', 'Table', 'Source'],
          ],
          extraPlugins: 'autogrow, colorbutton, font',
          height: 160,
          autoGrow_minHeight: 160,
          autoGrow_maxHeight: props?.maxHeight ? props?.maxHeight : 400,
          // autoGrow_bottomSpace: 10,
          autoGrow_onStartup: true,
          // contentsCss: '/assets/styles/editor.css',
          extraAllowedContent: 'span{*}[*],img{*}[*]',
          /** resize 가 있으면 autogrow 기능을 사용 못함 */
          removePlugins: 'resize, elementspath',
          sourceAreaTabSize: 2,
          font_names: ectx?.fontNames || '',
        })
        if (editor?.on) {
          editor.on('dataReady', () => {
            vars.editable = editor.editable()
            vars.elem.current = editor?.container?.$
            if (ref) {
              copyRef(ref, vars.elem)
              putAll(ref, {
                insertImage,
                storePosition,
              })
            }
          })
          editor.on('change', onEditorChange)
          editor.on('blur', onBlur)
          editor.on('focus', onFocus)
        }
        registForm(self, () => vars?.elem)
      } catch (e) { log.trace('E:', e) }
    },
    async updated(mode) {
      const { setValue, value } = modelValue(self())
      if (mode == C.UPDATE_ENTIRE) {
        await until(() => !!vars?.editable)
        vars.editor.setData(value)
      }
    },
    async unmount() {
      vars?.editor && vars.editor.destroy(true)
    }
  })

  const { uid, vars, update } = self()

  const onEditorChange = debounce(async (e) => {
    const { setValue, value } = modelValue(self())
    setValue(vars?.editor?.getData())
    props?.onChange && props.onChange(e)
    update(C.UPDATE_FULL)
  }, 300)

  const insertImage = async (src: any) => {
    const { setValue, value } = modelValue(self())
    const editor = vars?.editor
    if (editor && editor.insertHtml && src) {
      editor.insertHtml(`<img alt="" src="${src}" />`, UNFILTERED_HTML)
      setValue(editor.getData())
      // log.trace('EDITOR-DATA:', v)
    } else {
      log.trace('E:', src)
    }
  }
  const restorePosition = () => {
    log.trace('RESTORE-POSITION')
    const sel = document.getSelection()
    if (vars?.anchor?.node && sel) {
      const anchor = vars.anchor
      const range = document.createRange()
      range.setStart(anchor.node, anchor.offset)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
  const storePosition = () => {
    const sel = document.getSelection()
    if (vars && sel) {
      vars.anchor = {
        node: sel.anchorNode,
        offset: sel.anchorOffset
      }
    }
  }
  const onFocus = (e: any) => {
    props?.onFocus && props.onFocus(e)
  }
  const onBlur = (e: any) => {
    props?.onBlur && props.onBlur(e)
  }
  return (
  <>
    { ectx.CKEDITOR ? (
    <div
      { ...pprops }
      ref={ (vars?.elem || {}) as any }
      id={ `editor-${uid}` }
      />
    ) : ''}
  </>
  )
})