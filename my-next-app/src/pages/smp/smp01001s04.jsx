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
// import NodeRSA from 'encrypt-rsa'
// import { KEYUTIL, RSAKey, KJUR } from 'jsrsasign'
// import {  } from 'jsrsasign-util'
// import cryptojs from 'crypto-js'
// import rsa from 'js-crypto-rsa'
// import NodeRSA from 'node-rsa'

const { definePage, useSetup, log, goPage, clone, matcher } = app
const userInfo = userContext.getUserInfo()

// try {
//   const nodeRSA = new NodeRSA();
//   const { publicKey, privateKey } = nodeRSA.createPrivateAndPublicKeys(2048)
//   log.debug('NODE-RSA:', nodeRSA)
//   log.debug('PUBLIC KEY:', publicKey)
//   log.debug('PRIVATE KEY:', privateKey)
// } catch (e) { log.debug('E:', e) }

export default definePage(() => {
  const self = useSetup({
    vars: {
    },
    async mounted() {
      try {
        const publicKey = '-----BEGIN PUBLIC KEY-----\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgEzCqLqxWSiOTkWFQaPhY6X+qom8\nzzbidCpNu/zxwTieMvnBE4yPCeSRwJMFjJD2UGr7I/WunOsx+rAxYbzoMELw6TdZ\naaKygSLfkncUmbL6MQ1ZCSQQR6weaQj8VeYKNaA3QSqJYXCRPky6LI/o73brTCpE\nsWuVWp577q2PbTDbAgMBAAE=\n-----END PUBLIC KEY-----'
        const privateKey = `-----BEGIN RSA PRIVATE KEY-----
        MIICWwIBAAKBgEzCqLqxWSiOTkWFQaPhY6X+qom8zzbidCpNu/zxwTieMvnBE4yP
        CeSRwJMFjJD2UGr7I/WunOsx+rAxYbzoMELw6TdZaaKygSLfkncUmbL6MQ1ZCSQQ
        R6weaQj8VeYKNaA3QSqJYXCRPky6LI/o73brTCpEsWuVWp577q2PbTDbAgMBAAEC
        gYAdokTrlk4aZx32nuRhdUE4M2H5POgugyxfrJT3qQl0Zza8zvpSGGK0WESlPc4v
        pLgVJRGT5q5z6l6iqN3XxTfkI2LpvoaJzkS7Ow6ODkSfnoaeE5LsBA19BYGGgtw5
        uD4c7YBVJoEWZelSgsfSJdUpq/4YIBDSETA2aXWuC32l4QJBAJjciW9COFow7mH7
        lWveyrBGjGbisv/A9OzJAsjzsgqudvTMCFUrQgRcRlof45TPQzvlCerNg9/Q/Q3W
        oUvjYXECQQCAjVSlzYWtFovvG306VXvhjgR4W5D1Eg1havbeJpdQPgulyPnyBCDR
        6XUeGyH8fTaT0ByDxRqiQnk2r5UuZ5ELAkEAhMF7pqG3OTUnwvbxJTbfh0ot46jc
        1ltpGz/T6Fwk8zvj2eRdFEK2Wf0dqGXri7CZbqoS+9Yywq3JKDyP5s16MQJAI04t
        dEfosavijK3BC9dUaZMGeUO0oQnvMNUerc5tejVAH6z9sFEf7mauqrEK+XwuFBRw
        8GOet/eHsNQyJYd+FwJAPDgogfNfjBV6bQT2UQwHdfzKG1Jfcs5Pz/fLMljsa67I
        osWRyvZU4dRMwmNpo+m9YyKHDuQ/NwwMBhQtYlkzDw==
        -----END RSA PRIVATE KEY-----`;
        {
          let sig, enc, dec, pln
          pln = '테스트'
          const JSEncrypt = (await import('jsencrypt')).default
          const encrypt = new JSEncrypt()
          encrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIX1T+dD3zGK8umLDGKRHUz41kR35b1DQ4c4a4MjuYBIkyI9pSukveV0YILFPzRk20akaLgZhZVePihy/SyyoV7M6pQ0Q1n9Y2SQTXSOPxqUZUFPzJAco4vtpb/fPeICT16RMQyzv2zPj02dehzADMmSegzcOYQ/xjBLnWZOlNZQIDAQAB')
          enc = encrypt.encrypt(pln)
          log.debug('ENC:', enc)
          encrypt.setPrivateKey('MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMhfVP50PfMYry6YsMYpEdTPjWRHflvUNDhzhrgyO5gEiTIj2lK6S95XRggsU/NGTbRqRouBmFlV4+KHL9LLKhXszqlDRDWf1jZJBNdI4/GpRlQU/MkByji+2lv9894gJPXpExDLO/bM+PTZ16HMAMyZJ6DNw5hD/GMEudZk6U1lAgMBAAECgYAD/17nOrN3s6DfGZ3BPlWEPOXRv9lmBJxMGgXwi9QDiuefz/ZNmzjjRTN4+0Vrf5YSSOKCawH6mkuTG+ZY2sPKpiIBSX4SXewMIKRhbxOj19iwrNp1gBDK3s/kpHy9+x8b7tuEIITNYreuadYAvVgSMlaJVPdh7uUm39sMnn/aqwJBANRWQBpaOfw3iQ+g7jBrBJz+e5QbmsNZeNUPrk9WbMuhKQkLUP2E4U5noFKV8SZFGo48YPKsC32DxFF3e8kw2fsCQQDxk0ALLlepzdpqVkm6YQ4KtTEweug+L/RdjU5apGZLZI+AGfYIE1JIzyzgdPke92ePnw1wPqFgi0PyzyJn8DgfAkAq5M2IRUfHapSWgqT7RPMmn8XpEnZ+Ffnx2HwW7NeHfyPh/tY6kHhPNWHOrRmM6JLHvuy6uQSNM2waJO/toZ+3AkEAo4WzUl46RNztPhHOsnTEFod0Fob78ixv02u1YDHsdJhLcsEgA3NgvZxPmlhT0ZxS46scY6BhiIJ8qj1/4q9+rQJAbZj4vsQB5SrKcYNR8VVYMP9EYXnFax66QgSjGI3zPJhjAcbdyhDVshFKHcsI3R1dxegLFTbvjYKejzWfHBcBUQ==')
          dec = encrypt.decrypt(enc)
          log.debug('DEC:', dec)
        }
        {
        }

        // {
        //   const crypto = require('crypto')
        //   const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        //     modulusLength: 1024,
        //     publicKeyEncoding: {
        //       type: 'spki',
        //       format: 'pem'
        //     },
        //     privateKeyEncoding: {
        //       type: 'pkcs8',
        //       format: 'pem'
        //     }
        //   })
        //   log.debug('Public Key:', publicKey)
        //   log.debug('Private Key:', privateKey)
        // }
        // {
        //   let sig, enc, dec, pln
        //   pln = '테스트'
        //   sig = new KJUR.crypto.Signature({ 'alg': 'SHA1withRSA' })
        //   sig.init(privateKey)
        //   sig.updateString(pln)
        //   enc = sig.sign()
        //   log.debug('ENC:', enc)
        // }
        // {
        //   // let sig, enc, dec, pln
        //   // pln = '테스트'
        //   // let rsa = new RSAKey()
        //   // rsa.readPKCS8PubKeyHex()
        //   // enc = rsa.encrypt(pln)
        //   // log.debug('ENC:', enc)
        // }

        // const kpair = KEYUTIL.generateKeypair('RSA', 1024)
        // log.debug('PAIR:',  kpair)

        // var rsa = new RSAKey()
        // rsa.readPrivateKeyFromPEMString(privateKey)
        // var hSig = rsa.signString('aaa', 'sha1')
        // log.debug('SIGN:', hSig)

        // const nodeRSA = new NodeRSA(publicKey, privateKey, 2048);
        // var rsa = new RSAKey();
        // rsa.readPrivateKeyFromPEMString(_PEM_PRIVATE_KEY_STRING_);
        // var hSig = rsa.signString('aaa', 'sha1'); // sign a string 'aaa' with key

        // const { publicKey, privateKey } = nodeRSA.createPrivateAndPublicKeys(2048)
        // log.debug('NODE-RSA:', nodeRSA)
        // log.debug('PUBLIC KEY:', publicKey)
        // log.debug('PRIVATE KEY:', privateKey)
        // const enc = nodeRSA.encryptStringWithRsaPublicKey(publicKey, 'ABCD')
        // log.debug('ENC:', enc)
      } catch (e) { log.debug('E:', e) }
    }
  })
  const { update, vars, ready } = self()
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