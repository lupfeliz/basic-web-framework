import { log } from '@/libs/commons/log'
// import { shared as s } from '@/libs/commons/shared'
import { useBaseSystem } from '@/store/commons/basesystem'
import $ from 'jquery'

const bootstwrap = {
  async new() {
    const bssys = useBaseSystem()
    // const bssys = s
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