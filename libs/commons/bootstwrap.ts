import { log } from '@/libs/commons/log'
import { shared as s } from '@/libs/commons/shared'
import $ from 'jquery'

const bootstwrap = {
  async new() {
    const win = window as any
    /** @ts-ignore */
    const bootstrap = await import('bootstrap')
    s.bootstrap = bootstrap
    s.window = win
    s.window.$ = $
    return bootstrap
  }
}

export { bootstwrap }