import { log } from '@/libs/commons/log'
import { useBaseSystem } from '@/store/commons/basesystem'
import $ from 'jquery'

const bootstwrap = {
  async new() {
    const bssys = useBaseSystem()
    const win = window as any
    /** @ts-ignore */
    const bootstrap = await import('bootstrap')
    bssys.bootstrap = bootstrap
    bssys.window = win
    bssys.window.$ = $
    return bootstrap
  }
}

export { bootstwrap }