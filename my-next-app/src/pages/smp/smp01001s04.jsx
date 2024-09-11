/**
 * @File        : usr01001s03.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 샘플4
 * @Site        : https://devlog.ntiple.com
 **/
import app from '@/libs/app-context'
import api from '@/libs/api'
import userContext from '@/libs/user-context'
import crypto from '@/libs/crypto'
import * as C from '@/libs/constants'
import { Block, Form, Button, Input, Select, Container, Textarea } from '@/components'
const { definePage, useSetup, log, goPage, clone, matcher } = app
const userInfo = userContext.getUserInfo()

export default definePage(() => {
  const self = useSetup({
    vars: {
    },
    async mounted() {
      try {
        const JSEncrypt = (await import('jsencrypt')).default
        const { JSEncryptRSAKey } = (await import('jsencrypt/lib/JSEncryptRSAKey'))
        const { BigInteger, parseBigInt } = (await import('jsencrypt/lib/lib/jsbn/jsbn'))
        const { b64tohex, hex2b64 } = (await import('jsencrypt/lib/lib/jsbn/base64'))
        const rsa = (await import('jsencrypt/lib/lib/jsbn/rsa')).default
        let prvk, pubk, sig, enc, dec, pln, k, o
        // prvk = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMhfVP50PfMYry6YsMYpEdTPjWRHflvUNDhzhrgyO5gEiTIj2lK6S95XRggsU/NGTbRqRouBmFlV4+KHL9LLKhXszqlDRDWf1jZJBNdI4/GpRlQU/MkByji+2lv9894gJPXpExDLO/bM+PTZ16HMAMyZJ6DNw5hD/GMEudZk6U1lAgMBAAECgYAD/17nOrN3s6DfGZ3BPlWEPOXRv9lmBJxMGgXwi9QDiuefz/ZNmzjjRTN4+0Vrf5YSSOKCawH6mkuTG+ZY2sPKpiIBSX4SXewMIKRhbxOj19iwrNp1gBDK3s/kpHy9+x8b7tuEIITNYreuadYAvVgSMlaJVPdh7uUm39sMnn/aqwJBANRWQBpaOfw3iQ+g7jBrBJz+e5QbmsNZeNUPrk9WbMuhKQkLUP2E4U5noFKV8SZFGo48YPKsC32DxFF3e8kw2fsCQQDxk0ALLlepzdpqVkm6YQ4KtTEweug+L/RdjU5apGZLZI+AGfYIE1JIzyzgdPke92ePnw1wPqFgi0PyzyJn8DgfAkAq5M2IRUfHapSWgqT7RPMmn8XpEnZ+Ffnx2HwW7NeHfyPh/tY6kHhPNWHOrRmM6JLHvuy6uQSNM2waJO/toZ+3AkEAo4WzUl46RNztPhHOsnTEFod0Fob78ixv02u1YDHsdJhLcsEgA3NgvZxPmlhT0ZxS46scY6BhiIJ8qj1/4q9+rQJAbZj4vsQB5SrKcYNR8VVYMP9EYXnFax66QgSjGI3zPJhjAcbdyhDVshFKHcsI3R1dxegLFTbvjYKejzWfHBcBUQ=='
        // pubk = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIX1T+dD3zGK8umLDGKRHUz41kR35b1DQ4c4a4MjuYBIkyI9pSukveV0YILFPzRk20akaLgZhZVePihy/SyyoV7M6pQ0Q1n9Y2SQTXSOPxqUZUFPzJAco4vtpb/fPeICT16RMQyzv2zPj02dehzADMmSegzcOYQ/xjBLnWZOlNZQIDAQAB'
        /** SUCC */
        {
          prvk = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMhfVP50PfMYry6YsMYpEdTPjWRHflvUNDhzhrgyO5gEiTIj2lK6S95XRggsU/NGTbRqRouBmFlV4+KHL9LLKhXszqlDRDWf1jZJBNdI4/GpRlQU/MkByji+2lv9894gJPXpExDLO/bM+PTZ16HMAMyZJ6DNw5hD/GMEudZk6U1lAgMBAAECgYAD/17nOrN3s6DfGZ3BPlWEPOXRv9lmBJxMGgXwi9QDiuefz/ZNmzjjRTN4+0Vrf5YSSOKCawH6mkuTG+ZY2sPKpiIBSX4SXewMIKRhbxOj19iwrNp1gBDK3s/kpHy9+x8b7tuEIITNYreuadYAvVgSMlaJVPdh7uUm39sMnn/aqwJBANRWQBpaOfw3iQ+g7jBrBJz+e5QbmsNZeNUPrk9WbMuhKQkLUP2E4U5noFKV8SZFGo48YPKsC32DxFF3e8kw2fsCQQDxk0ALLlepzdpqVkm6YQ4KtTEweug+L/RdjU5apGZLZI+AGfYIE1JIzyzgdPke92ePnw1wPqFgi0PyzyJn8DgfAkAq5M2IRUfHapSWgqT7RPMmn8XpEnZ+Ffnx2HwW7NeHfyPh/tY6kHhPNWHOrRmM6JLHvuy6uQSNM2waJO/toZ+3AkEAo4WzUl46RNztPhHOsnTEFod0Fob78ixv02u1YDHsdJhLcsEgA3NgvZxPmlhT0ZxS46scY6BhiIJ8qj1/4q9+rQJAbZj4vsQB5SrKcYNR8VVYMP9EYXnFax66QgSjGI3zPJhjAcbdyhDVshFKHcsI3R1dxegLFTbvjYKejzWfHBcBUQ=='
          enc = 'h3IfqQoLwdAaJTeE30jlesbm0UGCFRBirLFe3lXzi4KzUGpzEr7pb6L+9G4zE1YSHyf2KSUIfH6vePG/Fl8CRZoJZ6FQCC9MYzhxpGk377Z2OVBepz33wgOKKzFz9s7Bk8uxL8ubJUQPl9IZLhcVvbl4ruVc00wGa66lWeMjW1s='
          sig = new JSEncrypt()
          sig.setPrivateKey(prvk)
          log.debug('D:', sig.getKey().d.toRadix(16))
          log.debug('N:', sig.getKey().n.toRadix(16))
          dec = sig.decrypt(enc)
          log.debug('DEC:', dec, sig.getKey())
        }
        {
          // [0:pubenc,prvdec] tx2hbD8rZZeG6tKusB98fJU8UXeGZFxLfcV/udTVZiDEXv4ckAQDyZZDXHof28LxfmLGpDkJXJX9ePUpyVNQvqsiOFo6rOxja8pnx+6EwiuwI8P7khmubTaV/VxjDZJakye85Y+o7/5S3cZmzEPoKxP4bEZ9XWGE8/wzi/9TOdo=
          // [1:prvenc,pubdec] f0f3bU5tVpxAyPqUAF+PIe6j85tCVyX4oWclx8HSxUYbQyzfWXfTOWrHrRauixYgCVUlwRv3kDxQAV1dg5WioI/5FfA3vHHHSfMOGgQnlepEhq2RChxeWJAiKEtUqI+JYFGmYkWXos0SvzFhTJ9gkIC9kIa9fchYR4SjVvJ5Cd4=
          // 테스트중입니다.
          prvk = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALtGiOfF8bU5niMiMssH312DKh0inqEZInz5DKVtupphjK+sQat25cMtUp7z4dhOd9ZtVcWdjSFvIDldKSJfatArS5ZcuLr1U/Ltrro69+2aA3iNwT0Z8psFyLaZgRt/BNKul4tTiit9xoFsLkFqX/PlY4hPiY3/ZKjJjae5g8vtAgMBAAECgYAY0+6Vj6wOQx/Ad6m1Ogt2WcvNBghywiLM37W5/tSk3/bnWVZxdXdbi1gvQ5T2+NwxXNhotQz/WDy07jFkYbMGwPgI1imK1kOddThLE6VIBbVVbmZp9P3aeiHE8+oV7iXd9L2nAUk8KfX/waLU7WsOrf1mCsDTRf5Js0PiHFj5UQJBAOfDOgFEXhz4R/zBnzeaa1ZI3hoRW/h+K66vV+pMVMi0Y7FeKunj1dnbwCvc3v7O8Fx/d/PdCJHUCUiEtZuG92UCQQDO3EudooDxzUZ5ErFx0O4W2CqkmisiBS3MJzr0HzLAKUXD+NAv5Iy7jqhz/t408LIuviR6Sol/2H7P2WxyIo3pAkEAuFKCHWPcXbnwtsre7//2Aget7JmFxdnCsAlwKD1Q6Nbeur+j7aRv/fZRnhDpoUm/zDDsm5xdJm22fGBfdzQeKQJAXecW1EoOarWahh98OYR0cB5UzT/G0Ly1G3W7h1IaQaz6pIlwSC1hzUpnIbDSwgl5eUqLWJA5drWaa1PxrKYO8QJANNSD0e6/VSMSshZU7OddhX+UXGw4vzYE9/DCYX7XrUUb3G0J+FMpmweSr1dPveqCcz5i0Zm101kz9CFzdzMvOA=='
          pubk = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7RojnxfG1OZ4jIjLLB99dgyodIp6hGSJ8+QylbbqaYYyvrEGrduXDLVKe8+HYTnfWbVXFnY0hbyA5XSkiX2rQK0uWXLi69VPy7a66OvftmgN4jcE9GfKbBci2mYEbfwTSrpeLU4orfcaBbC5Bal/z5WOIT4mN/2SoyY2nuYPL7QIDAQAB'
          {
            enc = 'tx2hbD8rZZeG6tKusB98fJU8UXeGZFxLfcV/udTVZiDEXv4ckAQDyZZDXHof28LxfmLGpDkJXJX9ePUpyVNQvqsiOFo6rOxja8pnx+6EwiuwI8P7khmubTaV/VxjDZJakye85Y+o7/5S3cZmzEPoKxP4bEZ9XWGE8/wzi/9TOdo='
            sig = new JSEncrypt()
            sig.setPrivateKey(prvk)
            log.debug('N:', sig.getKey().n.toRadix(16))
            log.debug('D:', sig.getKey().d.toRadix(16))
            window.SIG = sig
            k = sig.getKey()
            const c = parseBigInt(b64tohex(enc), 16)
            log.debug('KEYS:', c, k.n, k.d, k.n.bitLength())
            o = c.modPow(k.d, k.n)
            log.debug('DECRYPT:', o, k.n, (k.n.bitLength() + 7) >> 3)
            o = pkcs1unpad2(o, (k.n.bitLength() + 7) >> 3)
            log.debug('O:', o)
          }
          {
            enc = 'f0f3bU5tVpxAyPqUAF+PIe6j85tCVyX4oWclx8HSxUYbQyzfWXfTOWrHrRauixYgCVUlwRv3kDxQAV1dg5WioI/5FfA3vHHHSfMOGgQnlepEhq2RChxeWJAiKEtUqI+JYFGmYkWXos0SvzFhTJ9gkIC9kIa9fchYR4SjVvJ5Cd4='
            sig = new JSEncrypt()
            sig.setPublicKey(pubk)
            window.SIG = sig
            k = sig.getKey()
            const c = parseBigInt(b64tohex(enc), 16)
            const e = parseBigInt(Number(k.e).toString(16), 16)
            log.debug('N:', sig.getKey().n.toRadix(16))
            log.debug('E:', Number(k.e).toString(16))
            log.debug('KEYS:', c, k.n, e, e.bitLength())
            o = c.modPow(e, k.n)
            log.debug('DECRYPT:', o, k.e, (e.bitLength() + 7) >> 3)
            o = pkcs1unpad1(o, (o.bitLength() + 7) >> 3)
            log.debug('O:', o)
          }
        }
      } catch (e) { log.debug('E:', e) }
      // try {
      //   let sig, enc, dec, pln
      //   const JSEncrypt = (await import('jsencrypt')).default
      //   const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIX1T+dD3zGK8umLDGKRHUz41kR35b1DQ4c4a4MjuYBIkyI9pSukveV0YILFPzRk20akaLgZhZVePihy/SyyoV7M6pQ0Q1n9Y2SQTXSOPxqUZUFPzJAco4vtpb/fPeICT16RMQyzv2zPj02dehzADMmSegzcOYQ/xjBLnWZOlNZQIDAQAB'
      //   const privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMhfVP50PfMYry6YsMYpEdTPjWRHflvUNDhzhrgyO5gEiTIj2lK6S95XRggsU/NGTbRqRouBmFlV4+KHL9LLKhXszqlDRDWf1jZJBNdI4/GpRlQU/MkByji+2lv9894gJPXpExDLO/bM+PTZ16HMAMyZJ6DNw5hD/GMEudZk6U1lAgMBAAECgYAD/17nOrN3s6DfGZ3BPlWEPOXRv9lmBJxMGgXwi9QDiuefz/ZNmzjjRTN4+0Vrf5YSSOKCawH6mkuTG+ZY2sPKpiIBSX4SXewMIKRhbxOj19iwrNp1gBDK3s/kpHy9+x8b7tuEIITNYreuadYAvVgSMlaJVPdh7uUm39sMnn/aqwJBANRWQBpaOfw3iQ+g7jBrBJz+e5QbmsNZeNUPrk9WbMuhKQkLUP2E4U5noFKV8SZFGo48YPKsC32DxFF3e8kw2fsCQQDxk0ALLlepzdpqVkm6YQ4KtTEweug+L/RdjU5apGZLZI+AGfYIE1JIzyzgdPke92ePnw1wPqFgi0PyzyJn8DgfAkAq5M2IRUfHapSWgqT7RPMmn8XpEnZ+Ffnx2HwW7NeHfyPh/tY6kHhPNWHOrRmM6JLHvuy6uQSNM2waJO/toZ+3AkEAo4WzUl46RNztPhHOsnTEFod0Fob78ixv02u1YDHsdJhLcsEgA3NgvZxPmlhT0ZxS46scY6BhiIJ8qj1/4q9+rQJAbZj4vsQB5SrKcYNR8VVYMP9EYXnFax66QgSjGI3zPJhjAcbdyhDVshFKHcsI3R1dxegLFTbvjYKejzWfHBcBUQ=='
      //   pln = '테스트'
      //   {
      //     sig = new JSEncrypt()
      //     sig.setPublicKey(publicKey)
      //     enc = sig.encrypt(pln)
      //     log.debug('ENC:', enc)
      //     sig = new JSEncrypt()
      //     sig.setPrivateKey(privateKey)
      //     dec = sig.decrypt(enc)
      //     log.debug('DEC:', dec)
      //   }
      //   {
      //     sig = new JSEncrypt()
      //     sig.setPrivateKey(privateKey)
      //     enc = sig.encrypt(pln)
      //     log.debug('ENC:', enc)
      //     sig = new JSEncrypt()
      //     sig.setPublicKey(publicKey)
      //     dec = sig.decrypt(enc)
      //     log.debug('DEC:', dec)
      //   }
      // } catch (e) { log.debug('E:', e) }
    }
  })
  const { update, vars, ready } = self()
function pkcs1unpad2(d, n) {
    var b = d.toByteArray();
    var i = 0;
    while (i < b.length && b[i] == 0) {
        ++i;
    }
    if (b.length - i != n - 1 || b[i] != 2) {
        return null;
    }
    ++i;
    while (b[i] != 0) {
        if (++i >= b.length) {
            return null;
        }
    }
    var ret = "";
    while (++i < b.length) {
        var c = b[i] & 255;
        if (c < 128) { // utf-8 decode
            ret += String.fromCharCode(c);
        }
        else if ((c > 191) && (c < 224)) {
            ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
            ++i;
        }
        else {
            ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
            i += 2;
        }
    }
    return ret;
}
function pkcs1unpad1(d, n) {
    var b = d.toByteArray();
    var i = 0;
    while (i < b.length && b[i] == 0) {
        ++i;
    }
    if (b.length - i != n - 1 || b[i] != 1) {
        return null;
    }
    ++i;
    while (b[i] != 0) {
        if (++i >= b.length) {
            return null;
        }
    }
    var ret = "";
    while (++i < b.length) {
        var c = b[i] & 255;
        if (c < 128) { // utf-8 decode
            ret += String.fromCharCode(c);
        }
        else if ((c > 191) && (c < 224)) {
            ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
            ++i;
        }
        else {
            ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
            i += 2;
        }
    }
    return ret;
}
  return (
  <Container>
    <section className='title'>
      <h2></h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form>
        <article>
          { ready() && (
            <>
            </>
          ) }
          <Block className='form-block'>
            <p>
              <label htmlFor='public_key'>PUBLIC KEY</label>
              <br/>
              <Textarea id='public_key' text={` `} />
            </p>
            <p>
              <label htmlFor='private_key'>PRIVATE KEY</label>
              <br/>
              <Textarea id='private_key' text={` `} />
            </p>
            <p>
              <Button id='btn_encrypt'>
                ENCRYPT
              </Button>
            </p>
            <p>
              <label htmlFor='input_message'>INPUT MESSAGE</label>
              <br/>
              <Textarea id='input_message' text={` `} />
            </p>
            <p>
              <label htmlFor='encrypted_message'>ENCRYPTED MESSAGE</label>
              <br/>
              <Textarea id='encrypted_message' text={` `} />
            </p>
            <p>
              <Button id='btn_decrypt'>
                DECRYPT
              </Button>
            </p>
            <p>
              <label htmlFor='decrypted_message'>DECRYPTED MESSAGE</label>
              <br/>
              <Textarea id='decrypted_message' text={` `} />
            </p>
          </Block>
        </article>
      </Form>
    </section>
  </Container>
  )
})