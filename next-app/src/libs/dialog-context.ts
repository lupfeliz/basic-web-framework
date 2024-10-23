/**
 * @File        : dialog-context.tsx
 * @Author      : 정재백
 * @Since       : 2024-05-02
 * @Description : 단순대화창 제어용 스토어 라이브러리
 * @Site        : https://devlog.ntiple.com
 **/
import { createSlice } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

import * as C from '@/libs/constants'
import log from '@/libs/log'
import values from '@/libs/values'
import app from '@/libs/app-context'
import proc from '@/libs/proc'
import lodash from 'lodash'

const { debounce } = lodash
const { clone } = values
const { until } = proc

type OptionType = {
  width?: number,
  height?: number,
  top?: number,
  left?: number,
  target?: string,
  menubar?: string,
  scrollbars?: string,
  status?: string,
  location?: string,
  resizable?: string
}

const schema = {
  modal: {
    // element: {} as any as Element,
    instance: {} as any,
    current: {} as any,
    queue: [] as any[],
    buttons: [
      { text: '확인', cls: 'primary', value: true },
      { text: '취소', cls: 'secondary', value: false },
    ],
    type: '',
    message: '',
    visible: false,
    resolveId: 0,
  },
  progress: {
    // element: {} as any as Element,
    queue: [] as any[],
    visible: false,
    resolveId: 0,
    stack: 0
  },
  authmodal: {
    visible: false,
  }
}

/** resolve 함수는 serialize 할 수 없으므로 별도로 저장해 준다 */
const dialogvars = {
  maxuid: 0,
  list: { } as any,
  nextId: (resolve?: Function) => {
    const ret = dialogvars.maxuid = (dialogvars.maxuid + 1) % Number.MAX_SAFE_INTEGER
    if (resolve) { dialogvars.list[ret] = resolve }
    return ret
  },
  winpopups: {
  } as any,
  closeListener: C.UNDEFINED
}

const slice = createSlice({
  name: C.DIALOG,
  initialState: schema,
  reducers: {
    modal: (state, action) => {
      let o: any
      // log.debug('MODAL', state, action.payload)
      const modal = state.modal
      const payload = action.payload
      switch (payload?.type) {
      case C.ALERT: case C.CONFIRM: { modal.queue.push(payload) }
      case C.FETCH: {
        if (!modal.visible && modal.queue.length > 0) {
          const itm = modal.queue.splice(0, 1)[0]
          modal.type = itm.type
          modal.resolveId = itm.resolveId
          modal.message = itm.message
          modal.visible = true
          switch (itm.type) {
          case C.ALERT: {
            modal.buttons = [ clone(schema.modal.buttons[0]) ]
          } break
          case C.CONFIRM: {
            modal.buttons = clone(schema.modal.buttons)
          } break
          }
        }
      } break
      case C.EVENT: {
        let pid = modal.resolveId
        switch (payload.value) {
        case 1: /** entered */ {
        } break
        case 2: /** exited */ {
        } break
        default: }
      } break
      case C.CLICK: {
        let pid = modal.resolveId
        if(o = dialogvars.list[pid]) {
          /** 버튼인덱스 값에 있는 결과값을 리턴한다. */
          const res = modal.buttons[payload?.value]?.value
          /** FIXME: 트랜지션 시간을 동적으로 체크하도록 */
          proc.sleep(200).then(() => { o(res) })
        }
        /** 큐에 쌓여있는 대화창을 처리한다. */
        if (modal.queue.length > 0) {
          setTimeout(() => store.dispatch(slice.actions.modal({ type: C.FETCH })), 0)
        }
        modal.visible = false
        delete dialogvars.list[pid]
      } break
      default: }
    },
    progress: (state, action) => {
      let o: any
      const progress = state.progress
      const payload = action.payload
      switch (payload?.type) {
      case C.VISIBLE: { progress.queue.push(payload) }
      case C.FETCH: {
        if (progress.queue.length > 0) {
          const itm = progress.queue.splice(0, 1)[0]
          switch (itm?.visible) {
          case true: {
            if (!progress.visible) {
              progress.resolveId = itm.resolveId
              progress.visible = true
            } else {
              /** 이미 progress 중인경우 stack 쌓고 종료 */
              progress.stack = progress.stack + 1
              if (itm.resolveId && (o = dialogvars.list[itm.resolveId])) { o(true) }
            }
          } break
          case false: {
            if (progress.visible) {
              /** progress stack 갯수가 0 이상인 경우 stack 만큼 감산되어야 종료 */
              if (progress.stack > 0) {
                progress.stack = progress.stack - 1
                if (itm.resolveId && (o = dialogvars.list[itm.resolveId])) { o(true) }
              } else {
                /** 모든 stack 이 종료된 경우 progress 해제 */
                progress.resolveId = itm.resolveId
                progress.visible = false
              }
            } else {
              /** progress 중이 아닌 경우 그냥 종료 */
              if (itm.resolveId && (o = dialogvars.list[itm.resolveId])) { o(true) }
            }
          } break
          default: }
        }
      } break
      case C.EVENT: {
        let pid = progress.resolveId
        switch (payload.value) {
        case 1: /** entered */ {
          if(o = dialogvars.list[pid]) { o(true) }
          delete dialogvars.list[pid]
        } break
        case 2: /** exited */ {
          if(o = dialogvars.list[pid]) { o(true) }
          delete dialogvars.list[pid]
        } break
        default: }
      } break
      default: }
    },
    authModal(state, action) {
      const p = action.payload
      for (const k in p) { (state.authmodal as any)[k] = p[k] }
    }
  }
})

const store = configureStore({
  reducer: slice.reducer
})

const dialogContext = {
  alert: (msg: string) => dialogContext.modal(msg, C.ALERT),
  confirm: (msg: string) => dialogContext.modal(msg, C.CONFIRM),
  modal: (val: any, type?: string) => new Promise<boolean>((resolve: Function) => {
    let payload: any = { }
    let resolved = false
    if (typeof val === C.STRING) {
      if (type === undefined) { type = C.ALERT }
      payload = {
        type: type,
        resolveId: dialogvars.nextId(resolve),
        message: val
      }
      resolved = true
    } else if (typeof val === C.OBJECT) {
      if (type !== undefined) { val.type = type }
      switch (val.type) {
      case C.ALERT: case C.CONFIRM: {
        payload.resolveId = dialogvars.nextId(resolve)
        resolved = true
      } break
      default: }
      payload = val
    }
    store.dispatch(slice.actions.modal(payload))
    if (!resolved) { resolve() }
  }),
  progress: (val?: any, timeout?: number) => new Promise<void>((resolve: Function) => {
    until(() => {
      let ret = false
      let payload: any = { }
      if (val === undefined || val === true) {
        payload = {
          type: C.VISIBLE,
          resolveId: dialogvars.nextId(resolve),
          visible: true,
          timeout: timeout
        }
        ret = true
      } else if (val === false) {
        payload = {
          type: C.VISIBLE,
          resolveId: dialogvars.nextId(resolve),
          visible: false
        }
        ret = true
      } else if (typeof val === C.OBJECT) {
        if (val.type === C.VISIBLE) {
          val.resolveId = dialogvars.nextId(resolve)
          ret = true
        }
        payload = val
      }
      if (payload?.type !== C.EVENT) {
        store.dispatch(slice.actions.progress(payload))
      }
      if (ret) { resolve() }
      return ret
    }, { maxcheck: 1000, interval: 10 })
  }),
  winpopup(url: string, data: any, option: OptionType) {
    /** 이전에 열린 팝업들을 제거한다 */
    for (let tid in dialogvars.winpopups) {
      const pctx: any = dialogvars.winpopups[tid]
      if (pctx?.close) {
        pctx.close()
        delete dialogvars.winpopups[tid]
      }
    }
    const tid = app.setGlobalTmp(data)
    const wm = window.screen.availWidth
    const hm = window.screen.availHeight
    let target = option?.target || '_blank'
    let width = option?.width || wm / 3
    let height = option?.height || hm / 3
    /** 화면중앙 */
    let left = option?.left || (wm - width) / 2
    /** 상단 1/4 지점 */
    let top = option?.top || (hm - height) / 4
    let menubar = option?.menubar || 'no'
    let scrollbars = option?.scrollbars || 'yes'
    let status = option?.status || 'no'
    let location = option?.location || 'no'
    let resizable = option?.resizable || 'yes'
    if (data) {
      dialogvars.winpopups[tid] = { }
      data.$$POUPCTX$$ = dialogvars.winpopups[tid]
    }
    const hnd = window.open(`${url}?tid=${tid}`, `${target}`,
      `popup=true,width=${width},height=${height},left=${left},top=${top},menubar=${menubar},` +
      `scrollbars=${scrollbars},status=${status},location=${location},resizable=${resizable}`);

    if ([C.LOCAL, C.MY].indexOf(app.profile()) === -1) {
      if (!dialogvars.closeListener) {
        /** window가 리프레시되기 전에 열려있는 모든 창을 닫는다 */
        dialogvars.closeListener = async () => {
          log.debug('CLOSE....')
          for (let tid in dialogvars.winpopups) {
            const pctx: any = dialogvars.winpopups[tid]
            if (pctx?.close) {
              pctx.close()
              delete dialogvars.winpopups[tid]
            }
          }
        }
        window.addEventListener('beforeunload', dialogvars.closeListener)
      }
    }
    return hnd
  },
  subscribe(fnc: any, opt?: any) {
    const debounced = debounce(fnc, Number(opt?.delay || '0'))
    return store.subscribe(debounced)
  },
  getDialogState() {
    return store.getState()
  },
  authModal(v: any) {
    store.dispatch(slice.actions.authModal(v))
  }
}

export default dialogContext