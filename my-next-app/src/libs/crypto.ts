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
    parseBigInt: C.UNDEFINED,
    b64tohex: C.UNDEFINED,
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
        const { parseBigInt } = (await import('jsencrypt/lib/lib/jsbn/jsbn'))
        const { b64tohex } = (await import('jsencrypt/lib/lib/jsbn/base64'))
        context.rsa.parseBigInt = parseBigInt
        context.rsa.b64tohex = b64tohex
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
        log.debug('PRV-DEC', msg)
        return cryptor.decrypt(msg)
      } else {
        log.debug('PUB-DEC', msg)
        let ret = C.UNDEFINED
        const c = context.rsa.parseBigInt(context.rsa.b64tohex(msg), 16)
        const e = tobig(kobj.e)
        log.debug('N:', tohex(kobj?.n))
        log.debug('E:', tohex(kobj?.e))
        // log.debug('KEYS:', c, kobj.n, e, e.bitLength())
        ret = c.modPow(e, kobj.n)
        log.debug('DECRYPT:', tohex(ret))
        ret = pkcs1unpad1(ret, (kobj.n.bitLength() + 7) >> 3)
        return ret
      }
    },
    encrypt: (msg: string, key?: any, type?: any) => {
      let cryptor = context.rsa.cryptor
      if (key) {
        cryptor = new context.rsa.JSEncrypt()
        switch (type) {
          case C.PUBLIC_KEY: { cryptor.setPublicKey(key) } break
          case C.PRIVATE_KEY: { cryptor.setPrivateKey(key) } break
          default: { cryptor.setKey(key) }
        }
      }
      return cryptor.encrypt(msg)
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

const pkcs1unpad1 = (d: any, n: any) => {
  var buf = d.toByteArray();
  var inx = 0;
  while (buf[inx] != 0) {
    if (++inx >= buf.length) { return null; }
  }
  var ret = "";
  while (++inx < buf.length) {
    var c = buf[inx] & 255;
    if (c < 128) {
      ret += String.fromCharCode(c);
    } else if ((c > 191) && (c < 224)) {
      ret += String.fromCharCode(((c & 31) << 6) | (buf[inx + 1] & 63));
      ++inx;
    } else {
      ret += String.fromCharCode(((c & 15) << 12) | ((buf[inx + 1] & 63) << 6) | (buf[inx + 2] & 63));
      inx += 2;
    }
  }
  return ret;
}

export default crypto