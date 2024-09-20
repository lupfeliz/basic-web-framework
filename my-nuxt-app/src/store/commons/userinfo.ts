import { defineStore } from 'pinia'
import * as C from '@/libs/constants'
import log from '@/libs/log'
import { storeutil as util } from '@/libs/storeutil'
import lodash from 'lodash'

const { debounce } = lodash

export const useUserInfo = defineStore('userInfo', {
  state: () => {
    return {
      userId: '',
      userNm: '',
      passwd: '',
      expireTime: 0
    }
  },
  actions: {
    clear() {
      ((e: any) => {
        e.userId = ''
        e.userNm = ''
        e.passwd = ''
        e.expireTime = 0
      })(this.$state)
      delete localStorage.userInfo
    },
    expandTimeout: debounce(() => {
      const self = useUserInfo()
      const curtime = new Date().getTime()
      if (self.$state?.userId) {
        self.$state.expireTime = curtime + C.SESSION_TIMEOUT - 2000
      }
    }, 300),
  },
  persist: {
    pick: ['userId', 'userNm', 'expireTime'],
    serializer: util.crypto,
    beforeHydrate: util.checkExpire,
    afterHydrate() { },
    debug: false
    // paths: ['userId', 'userNm', 'expireTime'],
    // serializer: util.crypto,
    // beforeRestore: util.checkExpire,
    // afterRestore() { },
    // debug: false
  }
})