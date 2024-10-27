/**
 * @File        : select.tsx
 * @Author      : 정재백
 * @Since       : 2024-10-27
 * @Description : 포탈 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import type { ReactElement } from 'react'
import { createPortal } from 'react-dom'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import $ from 'jquery'

const PortalPropsSchema = {
  dest: C.UNDEFINED,
  children: C.UNDEFINED as ReactElement,
}

type PortalProps = Partial<typeof PortalPropsSchema> & Record<string, any> & {
}

const COMPONENT = 'portal'
const { defineComponent, useSetup, getLogger } = app
const log = getLogger(COMPONENT)

export default defineComponent((props: PortalProps) => {
  const self = useSetup({
    name: COMPONENT,
    vars: {
      ready: false,
      gutter: C.UNDEFINED
    },
    async mounted() {
      vars.gutter = document.createElement('div')
      vars.ready = true
    }
  })
  const dest = (props: PortalProps) => {
    let ret = C.UNDEFINED
    log.trace('DEST:', props.dest, props?.dest?.jquery, props?.dest?.__proto__)
    if (!ret && props?.dest?.jquery) { ret = props.dest[0] }
    if (!ret && props?.dest?.current) { ret = props.dest.current }
    if (!ret && props?.dest?.nodeName) { ret = props.dest }
    if (!ret) {
      log.error('dest property of portal is not valid', props?.dest)
      ret = vars.gutter
    }
    return ret
  }
  const { vars, update } = self()
  return (
    <>
    { vars.ready && createPortal(props.children, dest(props)) }
    </>
  )
}, { nossr: true })