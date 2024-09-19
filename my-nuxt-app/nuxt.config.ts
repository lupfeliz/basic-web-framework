/**
 * @File        : nuxt.config.ts
 * @Author      : 정재백
 * @Since       : 2023-03-22
 * @Description : nextjs 구동설정
 * @Site        : https://devlog.ntiple.com
 **/
import env from 'dotenv'
import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'
import cryptojs from 'crypto-js'
import { copyFileSync, readFileSync, existsSync, rmSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const dir = dirname(fileURLToPath(import.meta.url))
const log = { debug: console.log }

env.config()
const distdir = path.join(__dirname, 'dist')
if (!fs.existsSync(distdir)) { fs.mkdirSync(distdir) }
/** 커맨드 : npm run dev 했을경우 : dev */
const cmd = String(process.env.npm_lifecycle_event)
/** 개발모드로 실행중인지 여부 */
const prod = process.env.NODE_ENV === 'production'
/** 프로파일별 환경변수를 읽어온다 */
const PROFILE = process.env.PROFILE || 'local'
const yml: any = yaml.load(readFileSync(`${process.cwd()}/env/env-${PROFILE}.yml`, 'utf8'))
if (!process.env?.PRINTED) {
  console.log('================================================================================')
  console.log(`샘플앱 / 프로파일 : ${PROFILE} / 구동모드 : ${cmd}[${prod}] / API프록시 : ${((yml?.api || [])[0] || {})?.server}`)
  console.log('================================================================================')
  process.env.PRINTED = 'true'
  // if (existsSync(`${dir}/babel.config.js`)) { rmSync(`${dir}/babel.config.js`) }
  // if (/(bbuild|bgenerate)/.test(cmd)) { copyFileSync(`${dir}/tools/babel/babel.config.js`, `${dir}/babel.config.js`) }
  /** 설정정보 등을 암호화 하여 클라이언트로 보내기 위한 AES 키, replace-loader 에 의해 constants 에 입력된다 */
  /* @ts-ignore */
  const cryptokey = btoa(Array(32).fill('0').map((v, i, l) => l[i] = Math.round(Math.random() * 255)))
  process.env.BUILD_STORE = JSON.stringify({
    CRYPTO_KEY: cryptokey,
    ENCRYPTED: cryptojs.AES.encrypt(JSON.stringify(yml), cryptokey).toString()
  })
}
/** API 프록시 설정 */
const apiproxy = [] as any[]
((yml?.api || []) as any[]).map(api => {
  const rewrites: any = {}
  const base = api?.base || '/api'
  rewrites[`^${base}`] = api?.alter || '/api'
  apiproxy.push({
    target: api?.server || 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: rewrites,
    pathFilter: [base]
  })
})

export default defineNuxtConfig({
  devtools: { enabled: true },
  components: false,
  modules: ['@pinia/nuxt', 'nuxt-proxy'],
  vite: {
    server: {
      hmr: {
        path: '/hmr',
        clientPort: Number(String(process.env['VITE_HMR_CLIENT_PORT'] || '24678'))
      },
    },
  },
  srcDir: 'src',
  runtimeConfig: {
    proxy: {
      // options: [
      //   {
      //     target: 'http://localhost:8080',
      //     changeOrigin: true,
      //     pathRewrite: { '^/api': '/api' },
      //     pathFilter: ['/api',]
      //   }
      // ]
      options: apiproxy
    }
  },
  nitro: {
    output: { publicDir: distdir }
  },
  css: [
    'bootstrap/dist/css/bootstrap.css',
    '@/assets/css/globals.scss',
  ],
  pinia: {
    autoImports: [
      'defineStore',
      ['defineStore', 'definePiniaStore'],
    ],
  },
})
