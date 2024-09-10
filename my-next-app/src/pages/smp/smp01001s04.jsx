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
        window.crypto.subtle.generateKey({
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        }, true, ['encrypt', 'decrypt'])
        .then((keyPair) => {
          log.debug('KEY-PAIR:', keyPair)
          let encoder = new TextEncoder()
          let decoder = new TextDecoder('utf-8')
          window.crypto.subtle.exportKey('jwk', keyPair.publicKey).then(result => {
            // Show the public key in JSON form
            document.querySelector('#public_key').value = JSON.stringify(result)
          })
          window.crypto.subtle.exportKey('jwk', keyPair.privateKey).then(result => {
            // Show the private key in JSON form
            document.querySelector('#private_key').value = JSON.stringify(result)
          })
          const encryptButton = document.querySelector('#btn_encrypt')
          encryptButton.addEventListener('click', () => {
            // stash the message from the input
            const message = document.querySelector('#input_message').value
            let encoded = new TextEncoder().encode(message)
            // encrypt the message with the public key
            window.crypto.subtle.encrypt(
              { name: 'RSA-OAEP' },
              keyPair.publicKey,
              encoded
            ).then(result => {
              // stash the encrypted result for decryption later
              cipherText = result
              // show a base64 encoded version of the encrypted message
              document.querySelector('#encrypted_message').value = btoa(cipherText)
            })
          })
          const decryptButton = document.querySelector('#btn_decrypt')
          decryptButton.addEventListener('click', () => {
            // decrypt the message, with the private key
            window.crypto.subtle.decrypt(
              {
                name: 'RSA-OAEP'
              },
              keyPair.privateKey,
              cipherText
            ).then(result => {
              // after decryption, show the original message
              document.querySelector('#decrypted_message').value = decoder.decode(result)
            })
          })
        })
      } catch (e) {
        log.debug('E:', e)
      }
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