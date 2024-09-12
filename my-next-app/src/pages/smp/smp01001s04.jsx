/**
 * @File        : usr01001s03.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 샘플4
 * @Site        : https://devlog.ntiple.com
 **/
import JQ from 'jquery'
import app from '@/libs/app-context'
import api from '@/libs/api'
import userContext from '@/libs/user-context'
import crypto from '@/libs/crypto'
import * as C from '@/libs/constants'
import { Checkbox, Block, Form, Button, Input, Select, Container, Textarea } from '@/components'
const { definePage, useSetup, log, goPage, clone, matcher, sleep, putAll } = app
const userInfo = userContext.getUserInfo()

const PRIVATE_KEY = 'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIklL0trECmxNh3gBScQAGa5hqILaLXyxFg4VAh6MktDTdZbbvpHeMq4owGF0i1RWgTsudOjcT1Su6Jp+2+bQGEGdjow37qOHPuErQXtDXWxAJmnn8RBTpO/w96DZatzg9fU2Ib0fSGDlXTHaRbvSInCpbEwM5h7efnuKjA11VBXAgMBAAECgYAXeaf4zuC7YjwTLQ90ukZ3TvZ+sllAG8gEGdA4i0Iko+ak9I2whZ9lg+lTD2cEntI72ZGNaoKtroWzrVR+rCJ+uLbSVB8n0JAkrtd1eg/dbxIQNFkaFGpwkC0AtQSpgsLly7HjVQ5MrIAlP63ZiK9JdTBdXyajsLJX+R7Dyll6MQJBAKmPt/ZY0rKj21KirA8T4afW2qMVpMyIRTvbvaW7BU69pxyBwJEY3okwNCE4SK94GebVaXR2B7vANCI64NizBw0CQQDPDw9IgT9nLlZk+PRfYcm729qHotm6Uc8GrY0Iz8nkxrmszIz+/XBTsjV4na1gJ6dNMJHdg7gbR9ZsEm7I9FvzAkBsk7krKGmTNtXErqIa7ZI8FZrff4aN6lzbHbTtITse1tbhrDyRLSmjE5juBMqWggOkCtiCWOpO0Z8QpD9CxDEpAkABYXNTo3D9yiRPVg2jGS7ULtodL2vOPz9nJv8awO/ys5SHX3HNPXljRXvvyvVd/8Ww0RMX7AntPKRkYhcVBfQbAkAfups6liYVJLHON6vcVQTh0G9EaSZWDyFdxn+QVNA1BTgyqyA76VUywkiDviDbjWK1gv3UtiF19aQBlDFsvzcq'
const PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJJS9LaxApsTYd4AUnEABmuYaiC2i18sRYOFQIejJLQ03WW276R3jKuKMBhdItUVoE7LnTo3E9Uruiaftvm0BhBnY6MN+6jhz7hK0F7Q11sQCZp5/EQU6Tv8Peg2Wrc4PX1NiG9H0hg5V0x2kW70iJwqWxMDOYe3n57iowNdVQVwIDAQAB'

export default definePage(() => {
  const self = useSetup({
    name: 'SMP01001S04',
    vars: {
      prvk: PRIVATE_KEY,
      pubk: PUBLIC_KEY,
      msg: '',
      enc: '',
      dec: '',
      encfrom: 1,
      decfrom: 1,
      enctype: 1,
      encopt: [
        { name: 'PUBLIC-KEY', value: 1 },
        { name: 'PRIVATE-KEY', value: 2 }
      ],
      decopt: [
        { name: 'PUBLIC-KEY', value: 2 },
        { name: 'PRIVATE-KEY', value: 1 }
      ],
      prcopt: [
        { name: 'IN-BROWSER', value: 1 },
        { name: 'IN-SERVER', value: 2 }
      ],
    },
    async mounted() {
      log.debug('SMP01001S04 MOUNTED!')
      putAll(window, {
        JQ,
        UPDATE: update,
        VARS: vars
      })
    },
    async updated(mode) {
      log.debug('SMP-UPDATED..', mode)
    }
  })
  const { update, vars, ready } = self()
  const onClick = async (num) => {
    let res
    try {
      switch(num) {
      case 0: {
        vars.prvk = PRIVATE_KEY
        vars.pubk = PUBLIC_KEY
        vars.msg = 'RSA 암복호화를 테스트중입니다.'
        vars.dec = vars.msg
        /** 1: 클라PRV암호화 클라PUB복호화 */
        vars.enc = crypto.rsa.encrypt(vars.dec, vars.prvk)
        vars.dec = crypto.rsa.decrypt(vars.enc, vars.pubk)
        log.debug('ENC1:',vars.enc, ' / DEC1:',vars.dec)
        update(C.UPDATE_ENTIRE)
        await sleep(1000)

        /** 2: 클라PUB암호화 클라PRV복호화 */
        vars.enc = crypto.rsa.encrypt(vars.dec, vars.pubk)
        vars.dec = crypto.rsa.decrypt(vars.enc, vars.prvk)
        log.debug('ENC2:', vars.enc, ' / DEC2:', vars.dec)
        update(C.UPDATE_ENTIRE)
        await sleep(1000)

        /** 3: 서버PRV암호화 서버PUB복호화 */
        vars.enc = (await api.post(`smp01001`, { typ: 'encprv', msg: vars.dec })).result
        vars.dec = (await api.post(`smp01001`, { typ: 'decpub', msg: vars.enc })).result
        log.debug('ENC3:', vars.enc, ' / DEC3:', vars.dec)
        update(C.UPDATE_ENTIRE)
        await sleep(1000)

        /** 4: 서버PUB암호화 서버PRV복호화 */
        vars.enc = (await api.post(`smp01001`, { typ: 'encpub', msg: vars.dec })).result
        vars.dec = (await api.post(`smp01001`, { typ: 'decprv', msg: vars.enc })).result
        log.debug('ENC4:', vars.enc, ' / DEC4:', vars.dec)
        update(C.UPDATE_ENTIRE)
        await sleep(1000)

        /** 5: 서버PRV암호화 클라PUB복호화 */
        vars.enc = (await api.post(`smp01001`, { typ: 'encprv', msg: vars.dec })).result
        vars.dec = crypto.rsa.decrypt(vars.enc, vars.pubk)
        log.debug('ENC5:', vars.enc, ' / DEC5:', vars.dec)
        update(C.UPDATE_ENTIRE)
        await sleep(1000)

        /** 6: 클라PRV암호화 서버PUB복호화 */
        vars.enc = crypto.rsa.encrypt(vars.dec, vars.prvk)
        vars.dec = (await api.post(`smp01001`, { typ: 'decpub', msg: vars.enc })).result
        log.debug('ENC6:', vars.enc, ' / DEC6:', vars.dec)
        update(C.UPDATE_ENTIRE)
        await sleep(1000)

        /** 7: 서버PUB암호화 클라PRV복호화 */
        vars.enc = (await api.post(`smp01001`, { typ: 'encpub', msg: vars.dec })).result
        vars.dec = crypto.rsa.decrypt(vars.enc, vars.prvk)
        log.debug('ENC7:', vars.enc, ' / DEC7:', vars.dec)
        update(C.UPDATE_ENTIRE)
        await sleep(1000)

        /** 8: 클라PUB암호화 서버PRV복호화 */
        vars.enc = crypto.rsa.encrypt(vars.dec, vars.pubk)
        vars.dec = (await api.post(`smp01001`, { typ: 'decprv', msg: vars.enc })).result
        log.debug('ENC8:', vars.enc, ' / DEC8:', vars.dec)
        update(C.UPDATE_ENTIRE)
        await sleep(1000)

      } break
      case 1: {
        vars.enc = ''
        vars.dec = ''
        let key = ''
        update(C.UPDATE_ENTIRE)
        await sleep(100)
        switch (vars.encfrom) {
        case 1: { vars.enc = crypto.rsa.encrypt(vars.msg,  vars.enctype == 1 ? vars.pubk : vars.prvk) } break
        case 2: { vars.enc = (await api.post(`smp01001`, { typ: vars.enctype == 1 ? 'encpub' : 'encprv', msg: vars.msg })).result } break
        }
        log.debug('MSG:', vars.msg, 'ENC:', vars.enc)
        update(C.UPDATE_ENTIRE)
      } break
      case 2: {
        vars.dec = ''
        update(C.UPDATE_ENTIRE)
        await sleep(100)
        switch (vars.decfrom) {
        case 1: { vars.dec = crypto.rsa.decrypt(vars.enc,  vars.enctype == 1 ? vars.prvk : vars.pubk) } break
        case 2: { vars.dec= (await api.post(`smp01001`, { typ: vars.enctype == 1 ? 'decprv' : 'decpub', msg: vars.enc })).result } break
        }
        log.debug('ENC:', vars.enc, ' / DEC:', vars.dec)
        update(C.UPDATE_ENTIRE)
      } break
      default: }
    } catch (e) {
      log.debug('E:', e)
    }
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
            <Button id='btn_encrypt'
              onClick={ () => onClick(0) }
              >
              START
            </Button>
          </Block>
          <Block className='form-block'>
            <p>
              <label htmlFor='public_key'>PUBLIC KEY</label>
              <br/>
              <Textarea id='public_key' model={vars} name='pubk' className='w-full' />
            </p>
            <p>
              <label htmlFor='private_key'>PRIVATE KEY</label>
              <br/>
              <Textarea id='private_key' model={ vars } name='prvk' className='w-full' />
            </p>
            <p>
              <label htmlFor='input_message'>INPUT MESSAGE</label>
              <br/>
              <Textarea id='input_message' model={ vars } name='msg' className='w-full' />
            </p>
            <Block>
              <Button id='btn_encrypt'
                onClick={ () => onClick(1) }
                >
                ENCRYPT
              </Button>
              <Select
                size='small'
                model={ vars }
                name='enctype'
                options={ vars.encopt }
                />
              <Select
                size='small'
                model={ vars }
                name='encfrom'
                options={ vars.prcopt }
                />
            </Block>
            <p>
              <label htmlFor='encrypted_message'>ENCRYPTED MESSAGE</label>
              <br/>
              <Textarea id='encrypted_message' model={ vars } name='enc' className='w-full' />
            </p>
            <Block>
              <Button id='btn_decrypt'
                onClick={ () => onClick(2) }
                >
                DECRYPT
              </Button>
              <Select
                size='small'
                model={ vars }
                name='enctype'
                options={ vars.decopt }
                />
              <Select
                size='small'
                model={ vars }
                name='decfrom'
                options={ vars.prcopt }
                />
            </Block>
            <p>
              <label htmlFor='decrypted_message'>DECRYPTED MESSAGE</label>
              <br/>
              <Textarea id='decrypted_message' model={ vars } name='dec' className='w-full' />
            </p>
          </Block>
        </article>
      </Form>
    </section>
  </Container>
  )
})