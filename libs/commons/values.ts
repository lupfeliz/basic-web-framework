import { log } from '@/libs/commons/log'

import { } from 'crypto-js'

const values = {
  clear(obj: any) {
    if (obj instanceof Array) {
      obj.splice(0, obj.length)
    } else {
      for (const k in obj) {
        delete obj[k]
      }
    }
  },
  range(st: any, ed?: number) {
    let ret = []
    if (st instanceof Array && ed === undefined) {
      ed = Number(st[1])
      st = Number(st[0])
    } else {
      st = Number(st)
      ed = Number(ed)
      if (isNaN(st)) { st = 0 }
      if (isNaN(ed)) { ed = st }
    }
    st = Number(st)
    ed = Number(ed)
    if (st <= ed) {
      for (let inx = st; inx <= ed; inx++) {
        ret.push(inx)
      }
    } else {
      for (let inx = st; inx > ed; inx--) {
        ret.push(inx)
      }
    }
    return ret
  },
  // randomValue(max?: number, min?: number) {
  //   let ret: number = 0;
  //   if (min === undefined) { min = 0; }
  //   if (max !== undefined) {
  //     const array = new Uint32Array(1);
  //     window.crypto.getRandomValues(array);
  //     ret = (array[0] % (max - min)) + min;
  //   } else {
  //     const array = new Uint32Array(2);
  //     window.crypto.getRandomValues(array);
  //     ret = (array[0] / array[1]);
  //   }
  //   log.debug('CHECK:', ret)
  //   return ret;
  // },
  // genAESIv() {
  //   const self = values;
  //   const s4 = () => {
  //     return (((1 + self.randomValue()) * 0x10000) | 0).toString(16).substring(1);
  //   }
  //   log.debug(`S4-1: ${Number(s4())}`)
  //   return Number(s4() + s4() + s4() + s4()).toString(16);
  // },
  // genAESKey() {
  //   const self = values;
  //   const s4 = () => {
  //     return (((1 + self.randomValue()) * 0x10000) | 0).toString(16).substring(1);
  //   }
  //   log.debug(`S4-2: ${s4()}`)
  //   return Number(s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4()).toString(32);
  // },
  // test() {
  //   {
  //     let keySize = 256
  //     let ivSize = 128
  //     let iterations = 100
  //     let pass = 'Secret Password'
  //     let msg = '테스트'
  //     const encrypt = () => {
  //       let salt = CryptoJS.lib.WordArray.random(128/8)
  //       log.debug('SALT:', salt, salt.toString())
  //       let key = CryptoJS.PBKDF2(pass, salt, {
  //         keySize: keySize / 32,
  //         iterations: iterations
  //       })
  //       log.debug('KEY:', key, key.toString())
  //       let iv = CryptoJS.lib.WordArray.random(ivSize/8)
  //       log.debug('IV:', iv, iv.toString())
  //       let encrypted = CryptoJS.AES.encrypt(msg, key, { 
  //         iv: iv, 
  //         padding: CryptoJS.pad.Pkcs7,
  //         mode: CryptoJS.mode.CBC,
  //         hasher: CryptoJS.algo.SHA256
  //       })
  //       log.debug('ENC:', encrypted, encrypted.toString())
  //       let transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
  //       return transitmessage
  //     }
  //     let transitmessage = encrypt()
  //     log.debug('TRANSIT:', transitmessage)
  //     const decrypt = (transitmessage: string) => {
  //       let salt = CryptoJS.enc.Hex.parse(transitmessage.substring(0, 32));
  //       let iv = CryptoJS.enc.Hex.parse(transitmessage.substring(32, 64))
  //       let encrypted = transitmessage.substring(64);
  //       let key = CryptoJS.PBKDF2(pass, salt, {
  //         keySize: keySize / 32,
  //         iterations: iterations
  //       });
  //       let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
  //         iv: iv,
  //         padding: CryptoJS.pad.Pkcs7,
  //         mode: CryptoJS.mode.CBC,
  //         hasher: CryptoJS.algo.SHA256
  //       })
  //       return decrypted;
  //     }
  //     let decrypted = decrypt(transitmessage)
  //     log.debug('DECRYPTED:', decrypted.toString(CryptoJS.enc.Utf8));
  //   }
  // }
}

export { values }