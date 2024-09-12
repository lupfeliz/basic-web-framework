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

const context = {
  rsa: {

  }
}

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
        const { SecureRandom } = (await import('jsencrypt/lib/lib/jsbn/rng'))
        const rsa = (await import('jsencrypt/lib/lib/jsbn/rsa')).default
        context.rsa.BigInteger = BigInteger
        context.rsa.SecureRandom = SecureRandom
        let prvk, pubk, sig, enc, dec, pln, k, o
        prvk = 'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIklL0trECmxNh3gBScQAGa5hqILaLXyxFg4VAh6MktDTdZbbvpHeMq4owGF0i1RWgTsudOjcT1Su6Jp+2+bQGEGdjow37qOHPuErQXtDXWxAJmnn8RBTpO/w96DZatzg9fU2Ib0fSGDlXTHaRbvSInCpbEwM5h7efnuKjA11VBXAgMBAAECgYAXeaf4zuC7YjwTLQ90ukZ3TvZ+sllAG8gEGdA4i0Iko+ak9I2whZ9lg+lTD2cEntI72ZGNaoKtroWzrVR+rCJ+uLbSVB8n0JAkrtd1eg/dbxIQNFkaFGpwkC0AtQSpgsLly7HjVQ5MrIAlP63ZiK9JdTBdXyajsLJX+R7Dyll6MQJBAKmPt/ZY0rKj21KirA8T4afW2qMVpMyIRTvbvaW7BU69pxyBwJEY3okwNCE4SK94GebVaXR2B7vANCI64NizBw0CQQDPDw9IgT9nLlZk+PRfYcm729qHotm6Uc8GrY0Iz8nkxrmszIz+/XBTsjV4na1gJ6dNMJHdg7gbR9ZsEm7I9FvzAkBsk7krKGmTNtXErqIa7ZI8FZrff4aN6lzbHbTtITse1tbhrDyRLSmjE5juBMqWggOkCtiCWOpO0Z8QpD9CxDEpAkABYXNTo3D9yiRPVg2jGS7ULtodL2vOPz9nJv8awO/ys5SHX3HNPXljRXvvyvVd/8Ww0RMX7AntPKRkYhcVBfQbAkAfups6liYVJLHON6vcVQTh0G9EaSZWDyFdxn+QVNA1BTgyqyA76VUywkiDviDbjWK1gv3UtiF19aQBlDFsvzcq'
        pubk = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJJS9LaxApsTYd4AUnEABmuYaiC2i18sRYOFQIejJLQ03WW276R3jKuKMBhdItUVoE7LnTo3E9Uruiaftvm0BhBnY6MN+6jhz7hK0F7Q11sQCZp5/EQU6Tv8Peg2Wrc4PX1NiG9H0hg5V0x2kW70iJwqWxMDOYe3n57iowNdVQVwIDAQAB'
        {
          await crypto.rsa.init()
          let enc, dec, msg
          msg = 'gvqmcserjsbwopctwijjblupauxywlRSA 암복호화 테스트 중입니다'
          {
            enc = crypto.rsa.encrypt(msg, pubk)
            log.debug('ENC1:', enc)
            dec = crypto.rsa.decrypt(enc, prvk)
            log.debug('DEC1:', dec)
          }
          {
            enc = crypto.rsa.encrypt(msg, prvk)
            log.debug('ENC2:', enc)
            // enc = 'Qgk6W4v0yDYlqiX3U2xI9iO2BnT9lqmZXVZNR8q/3SlPg2+8bbuAF+FcWkkDVyy20TcSdhtHvUdRak7lBxg6tSF+8R/ZOiw64+df3KKgNgTjl3U2p0Y8i4umfOMw7J4m9MRp94xopnkvv1O9P4+179nVmwiyVYpgVP34G00UpTU='
            // log.debug('ENC2:', enc)
            dec = crypto.rsa.decrypt(enc, pubk)
            log.debug('DEC2:', dec)
          }
        }
        // {
        //   let test1 = '1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff006776716d637365726a7362776f70637477696a6a626c757061757879776c52534120ec9594ebb3b5ed98b8ed999420ed858cec8aa4ed8ab820eca491ec9e85eb8b88eb8ba4';
        //   let msg = 'gvqmcserjsbwopctwijjblupauxywlRSA 암복호화 테스트 중입니다'
        //   const cryptor = new JSEncrypt()
        //   cryptor.setKey(prvk)
        //   const kobj = cryptor.getKey()
        //   let maxLength = (kobj.n.bitLength() + 7) >> 3
        //   let test3 = pkcspad(msg, maxLength)
        //   log.debug('TEST:', test1)
        //   log.debug('PKCS:', test3.toString(16))
        // }
      } catch (e) { log.debug('E:', e) }
    }
  })
  const { update, vars, ready } = self()
  function pkcspad(s, n) {
    if (n < s.length + 11) { // TODO: fix for utf-8
      console.error('Message too long for RSA')
      return null
    }
    var ba = []
    var i = s.length - 1
    while (i >= 0 && n > 0) {
      var c = s.charCodeAt(i--)
      if (c < 128) { // encode using utf-8
        ba[--n] = c
      }
      else if ((c > 127) && (c < 2048)) {
        ba[--n] = (c & 63) | 128
        ba[--n] = (c >> 6) | 192
      }
      else {
        ba[--n] = (c & 63) | 128
        ba[--n] = ((c >> 6) & 63) | 128
        ba[--n] = (c >> 12) | 224
      }
    }
    ba[--n] = 0
    var rng = new context.rsa.SecureRandom()
    var x = []
    while (n > 2) { // random non-zero pad
      x[0] = 0
      // while (x[0] == 0) {
      //   rng.nextBytes(x)
      // }
      x[0] = 255
      ba[--n] = x[0]
    }
    // ba[--n] = 2
    ba[--n] = 1
    ba[--n] = 0
    return new context.rsa.BigInteger(ba)
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