/**
 * @File        : link.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 페이지 링크 컴포넌트 (a태그)
 * @Site        : https://devlog.ntiple.com
 **/
import { ComponentPropsWithRef, createElement, MouseEvent } from 'react'
import lodash from 'lodash'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
import { cancelEvent } from '@/libs/evdev'

type LinkProps = ComponentPropsWithRef<'a'> & {
  href?: any
  param?: any
}
const { throttle } = lodash
const { defineComponent, copyExclude, goPage, putAll } = app

/** 기본적으로는 일반 a 태그와 같지만 SPA 방식으로 화면을 전환한다 */
export default defineComponent((props: LinkProps, ref: LinkProps['ref']) => {
  const pprops = putAll(copyExclude(props, ['param']), {
    'role': 'button',
    'tabIndex': props.tabIndex !== undefined ? props.tabIndex : 0
  })
  const onClick = throttle(async (e: MouseEvent) => {
    if (props.href !== C.UNDEFINED) {
      /** 입력된 이벤트 전달을 취소하고 */
      cancelEvent(e)
      /** SPA 방식(router.push) 화면이동을 시도한다 */
      goPage(props.href, props.param)
    }
    if (props?.onClick) { props.onClick(e as any) }
  }, 300)
  return createElement('a', { ref: ref, onClick: onClick, ...pprops })
})