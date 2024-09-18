import * as C from '@/libs/constants'
import log from '@/libs/log'
import CryptoJS from 'crypto-js'

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
  clone(obj: any) {
    return JSON.parse(JSON.stringify(obj))
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
  cryptokeyPBKDF2(salt: string, passphrase: string, iterations: number, keysize: number) {
    return CryptoJS.PBKDF2(passphrase,
      CryptoJS.enc.Hex.parse(salt),
      { keySize: keysize / 32, iterations: iterations }
    )
  },
  encrypt(salt: string, iv: string, passphrase: string, plaintext: string, iterations: number, keysize: number) {
    const key = values.cryptokeyPBKDF2(salt, passphrase, iterations, keysize)
    return CryptoJS.AES.encrypt(plaintext, key, { iv: CryptoJS.enc.Hex.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  },
  decrypt(salt: string, iv: string, passphrase: string, ciphertext: string, iterations: number, keysize: number) {
    const key = values.cryptokeyPBKDF2(salt, passphrase, iterations, keysize)
    return CryptoJS.AES.decrypt(ciphertext, key, { iv: CryptoJS.enc.Hex.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  },
  enc(plaintext: string) {
    const salt = C.HC_DEF_AES_SALT
    const iv = C.HC_DEF_AES_IV
    const passphrase = C.HC_DEF_AES_PASSPHRASE
    const ret = values.encrypt(salt, iv, passphrase, plaintext, 1000, 128)
    return ret.toString()
  },
  dec(ciphertext: string) {
    const salt = C.HC_DEF_AES_SALT
    const iv = C.HC_DEF_AES_IV
    const passphrase = C.HC_DEF_AES_PASSPHRASE
    const ret = values.decrypt(salt, iv, passphrase, ciphertext, 1000, 128)
    return ret.toString(CryptoJS.enc.Utf8)
  }
}

export { values }