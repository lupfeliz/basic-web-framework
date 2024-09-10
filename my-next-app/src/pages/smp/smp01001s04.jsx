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
        let sig, enc, dec, pln
        const JSEncrypt = (await import('jsencrypt')).default
        const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIX1T+dD3zGK8umLDGKRHUz41kR35b1DQ4c4a4MjuYBIkyI9pSukveV0YILFPzRk20akaLgZhZVePihy/SyyoV7M6pQ0Q1n9Y2SQTXSOPxqUZUFPzJAco4vtpb/fPeICT16RMQyzv2zPj02dehzADMmSegzcOYQ/xjBLnWZOlNZQIDAQAB'
        const privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMhfVP50PfMYry6YsMYpEdTPjWRHflvUNDhzhrgyO5gEiTIj2lK6S95XRggsU/NGTbRqRouBmFlV4+KHL9LLKhXszqlDRDWf1jZJBNdI4/GpRlQU/MkByji+2lv9894gJPXpExDLO/bM+PTZ16HMAMyZJ6DNw5hD/GMEudZk6U1lAgMBAAECgYAD/17nOrN3s6DfGZ3BPlWEPOXRv9lmBJxMGgXwi9QDiuefz/ZNmzjjRTN4+0Vrf5YSSOKCawH6mkuTG+ZY2sPKpiIBSX4SXewMIKRhbxOj19iwrNp1gBDK3s/kpHy9+x8b7tuEIITNYreuadYAvVgSMlaJVPdh7uUm39sMnn/aqwJBANRWQBpaOfw3iQ+g7jBrBJz+e5QbmsNZeNUPrk9WbMuhKQkLUP2E4U5noFKV8SZFGo48YPKsC32DxFF3e8kw2fsCQQDxk0ALLlepzdpqVkm6YQ4KtTEweug+L/RdjU5apGZLZI+AGfYIE1JIzyzgdPke92ePnw1wPqFgi0PyzyJn8DgfAkAq5M2IRUfHapSWgqT7RPMmn8XpEnZ+Ffnx2HwW7NeHfyPh/tY6kHhPNWHOrRmM6JLHvuy6uQSNM2waJO/toZ+3AkEAo4WzUl46RNztPhHOsnTEFod0Fob78ixv02u1YDHsdJhLcsEgA3NgvZxPmlhT0ZxS46scY6BhiIJ8qj1/4q9+rQJAbZj4vsQB5SrKcYNR8VVYMP9EYXnFax66QgSjGI3zPJhjAcbdyhDVshFKHcsI3R1dxegLFTbvjYKejzWfHBcBUQ=='
        pln = '테스트'
        {
          sig = new JSEncrypt()
          sig.setPublicKey(publicKey)
          enc = sig.encrypt(pln)
          log.debug('ENC:', enc)
          sig = new JSEncrypt()
          sig.setPrivateKey(privateKey)
          dec = sig.decrypt(enc)
          log.debug('DEC:', dec)
        }
        {
          sig = new JSEncrypt()
          sig.setPrivateKey(privateKey)
          enc = sig.encrypt(pln)
          log.debug('ENC:', enc)
          sig = new JSEncrypt()
          sig.setPublicKey(publicKey)
          dec = sig.decrypt(enc)
          log.debug('DEC:', dec)
        }
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