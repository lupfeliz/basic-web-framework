/**
 * @File        : crypto.ts
 * @Author      : 정재백
 * @Since       : 2023-10-10
 * @Description : 암호화 유틸
 *                app 내에서 aes 와 rsa 방식 암복호화를 간편하게 다룰 목적으로 작성
 * @Site        : https://devlog.ntiple.com
 **/
import cryptojs from 'crypto-js'
import * as C from './constants'
import log from './log'

type WordArray = cryptojs.lib.WordArray
/** 암호화 기본키 저장소 */
const context = {
  aes: {
    defbit: 256,
    defkey: C.UNDEFINED as WordArray,
    opt: {
      iv: C.UNDEFINED as WordArray,
      mode: cryptojs.mode.CBC,
      padding: cryptojs.pad.Pkcs7
    }
  },
  rsa: {
    JSEncrypt: C.UNDEFINED,
    BigInteger: C.UNDEFINED,
    SecureRandom: C.UNDEFINED,
    parseBigInt: C.UNDEFINED,
    b64tohex: C.UNDEFINED,
    hex2b64: C.UNDEFINED,
    cryptor: C.UNDEFINED,
    defkey: ''
  }
}

context.aes.defkey = cryptojs.enc.Utf8.parse(''.padEnd(context.aes.defbit / 8, '\0'))
context.aes.opt.iv = cryptojs.enc.Hex.parse(''.padEnd(16, '0'))

const NIL_ARR = cryptojs.enc.Hex.parse('00')

const crypto = {
  /** AES 모듈 */
  aes: {
    init: async (key?: any) => {
      if (key) { context.aes.defkey = crypto.aes.key(key) }
    },
    decrypt: (msg: string, key?: any) => {
      let hkey: WordArray = key ? crypto.aes.key(key) : context.aes.defkey
      return cryptojs.AES.decrypt(msg, hkey, context.aes.opt).toString(cryptojs.enc.Utf8)
    },
    encrypt: (msg: string, key?: any) => {
      let hkey: WordArray = key ? crypto.aes.key(key) : context.aes.defkey
      return cryptojs.AES.encrypt(msg, hkey, context.aes.opt).toString()
    },
    key(key: any, bit: number = context.aes.defbit) {
      let ret: any = undefined
      if (key) {
        if (typeof key === C.STRING || typeof key === C.NUMBER) {
          key = String(key)
          const b64len = Math.round(bit * 3 / 2 / 8)
          if (key.length > (b64len)) { key = String(key).substring(0, b64len) }
          if (key.length < (b64len)) { key = String(key).padEnd(b64len, '\0') }
          if (ret === undefined) { try { ret = crypto.b64dec(key) } catch (e) { log.debug('E:', e) } }
          if (ret === undefined) { try { ret = crypto.hexdec(key) } catch (e) { log.debug('E:', e) } }
        } else {
          if (key.__proto__ === cryptojs.lib.WordArray) { ret = key }
        }
      }
      return ret as any as WordArray
    },
    setDefaultKey(key: any, bit: number = context.aes.defbit) {
      if (bit && bit !== context.aes.defbit) { context.aes.defbit = bit }
      context.aes.defkey = this.key(key, bit)
    }
  },
  /** RSA 모듈 / JSEncrypt 에서는 private key 를 사용해야만 암/복호화가 모두 지원된다 */
  rsa: {
    init: async (keyval?: string, keytype?: string) => {
      if (!context.rsa.JSEncrypt) {
        context.rsa.JSEncrypt = (await import('jsencrypt')).default
        const { parseBigInt, BigInteger } = (await import('jsencrypt/lib/lib/jsbn/jsbn'))
        const { SecureRandom } = (await import('jsencrypt/lib/lib/jsbn/rng'))
        const { b64tohex, hex2b64 } = (await import('jsencrypt/lib/lib/jsbn/base64'))
        context.rsa.BigInteger = BigInteger
        context.rsa.SecureRandom = SecureRandom
        context.rsa.parseBigInt = parseBigInt
        context.rsa.b64tohex = b64tohex
        context.rsa.hex2b64 = hex2b64
        const cryptor = context.rsa.cryptor = new context.rsa.JSEncrypt()
        switch (keytype) {
        case C.PRIVATE_KEY: case C.UNDEFINED: { cryptor.setPrivateKey(keyval) } break
        case C.PUBLIC_KEY: { cryptor.setPublicKey(keyval) } break
        }
      }
    },
    decrypt: (msg: string, key?: any) => {
      let cryptor = context.rsa.cryptor
      if (key) {
        cryptor = new context.rsa.JSEncrypt()
        cryptor.setKey(key)
      }
      const kobj = cryptor.getKey()
      if (kobj.d) {
        // log.debug('PRV-DEC', msg)
        return cryptor.decrypt(msg)
      } else {
        // log.debug('PUB-DEC', msg)
        let ret = C.UNDEFINED
        const c = context.rsa.parseBigInt(context.rsa.b64tohex(msg), 16)
        const e = tobig(kobj.e)
        ret = c.modPow(e, kobj.n)
        // log.debug('N:', tohex(kobj?.n))
        // log.debug('E:', tohex(kobj?.e))
        // log.debug('DECRYPT:', tohex(ret))
        ret = pkcsunpad(ret, (kobj.n.bitLength() + 7) >> 3)
        return ret
      }
    },
    encrypt: (msg: string, key?: any) => {
      let cryptor = context.rsa.cryptor
      if (key) {
        cryptor = new context.rsa.JSEncrypt()
        cryptor.setKey(key)
      }
      const kobj = cryptor.getKey()
      if (!kobj.d) {
        return cryptor.encrypt(msg)
      } else {
        // log.debug('PRV-ENC', msg)
        let ret = C.UNDEFINED

        let maxLength = (kobj.n.bitLength() + 7) >> 3
        let c = pkcspad(msg, maxLength);
        ret = c.modPow(tobig(kobj.d), kobj.n)
        // log.debug('PADDING:', tohex(c))
        // log.debug('N:', tohex(kobj?.n))
        // log.debug('D:', tohex(kobj?.d))
        // log.debug('ENCRYPT:', tohex(ret))
        ret = ret.toString(16)
        let length = ret.length
        /** fix zero before result */
        for (var inx = 0; inx < maxLength * 2 - length; inx++) { ret = '0' + ret }
        ret = context.rsa.hex2b64(ret)
        return ret
      }
    }
  },
  b64dec(key: string) {
    let ret = NIL_ARR
    try { ret = cryptojs.enc.Base64.parse(key) } catch (e) { log.debug('E:', e) }
    return ret
  },
  hexdec(key: string) {
    let ret = NIL_ARR
    try { ret = cryptojs.enc.Hex.parse(key) } catch (e) { log.debug('E:', e) }
    return ret
  },
}

const tohex = (v: any) => {
  let ret = ''
  if (v?.toRadix && v.toRadix instanceof Function) {
    ret = v.toRadix(16)
  } else if (v && typeof v === 'number') {
    ret = v.toString(16)
  }
  return ret
}
const tobig = (v: any) => {
  let ret = v
  if (v && typeof v === 'number') {
    ret = context.rsa.parseBigInt(v.toString(16), 16)
  }
  return ret
}

const pkcsunpad = (bint: any, len: any) => {
  var buf = bint.toByteArray()
  var inx = 0
  while (buf[inx] != 0) {
    if (++inx >= buf.length) { return null }
  }
  var ret = ''
  while (++inx < buf.length) {
    var c = buf[inx] & 255
    if (c < 128) {
      ret += String.fromCharCode(c)
    } else if ((c > 191) && (c < 224)) {
      ret += String.fromCharCode(((c & 31) << 6) | (buf[inx + 1] & 63))
      ++inx
    } else {
      ret += String.fromCharCode(((c & 15) << 12) | ((buf[inx + 1] & 63) << 6) | (buf[inx + 2] & 63))
      inx += 2
    }
  }
  return ret
}

const pkcspad = (msg: any, pos: any) => {
  /** TODO: fix for utf-8 */
  if (pos < msg.length + 11) { return (log.error('Message too long for RSA')) }
  let buf = []
  let inx = msg.length - 1
  while (inx >= 0 && pos > 0) {
    let ch = msg.charCodeAt(inx--)
    /** encode using utf-8 */
    if (ch < 128) {
      buf[--pos] = ch
    }
    else if ((ch > 127) && (ch < 2048)) {
      buf[--pos] = (ch & 63) | 128
      buf[--pos] = (ch >> 6) | 192
    }
    else {
      buf[--pos] = (ch & 63) | 128
      buf[--pos] = ((ch >> 6) & 63) | 128
      buf[--pos] = (ch >> 12) | 224
    }
  }
  buf[--pos] = 0
  let rng = new context.rsa.SecureRandom()
  let x = []
  /** random non-zero pad */
  while (pos > 2) {
    x[0] = 0
    // while (x[0] == 0) { rng.nextBytes(x) }
    x[0] = 255
    buf[--pos] = x[0]
  }
  // buf[--pos] = 2
  buf[--pos] = 1
  buf[--pos] = 0
  return new context.rsa.BigInteger(buf)
}

export default crypto