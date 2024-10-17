/**
 * @File        : nuxt.config.ts
 * @Author      : 정재백
 * @Since       : 2023-03-22
 * @Description : nextjs 구동설정
 * @Site        : https://devlog.ntiple.com
 **/
import env from 'dotenv'
import path from 'path'
import yaml from 'js-yaml'
import cryptojs from 'crypto-js'
import { copyFileSync, readFileSync, existsSync, rmSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import legacy from '@vitejs/plugin-legacy'
import ReplaceLoader from './env/replace-loader'

const log = { debug: console.log }
const dir = dirname(__filename)

env.config()
const distdir = path.join(dir, 'dist')
if (!existsSync(distdir)) { mkdirSync(distdir) }
/** 커맨드 : npm run dev 했을경우 : dev */
const cmd = String(process.env.npm_lifecycle_event)
/** 개발모드로 실행중인지 여부 */
const prod = process.env.NODE_ENV === 'production'
/** 프로파일별 환경변수를 읽어온다 */
const PROFILE = process.env.PROFILE || 'local'
const yml: any = yaml.load(readFileSync(`${process.cwd()}/env/env-${PROFILE}.yml`, 'utf8'))

const baseURL = `${yml.app.basePath || ''}`
process.env.BASE_DIR = dir
process.env.BASE_URL = baseURL

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
// const apiproxy = [] as any[]
let apiproxy = {} as any
((yml?.api || []) as any[]).map(api => {
  const rewrites: any = {}
  const base = api?.base || '/api'
  rewrites[`^${base}`] = api?.alter || '/api'
  apiproxy = {
    target: api?.server || 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: rewrites,
    pathFilter: [base],
    enableLogger: false,
  }
})

const ReplaceLoaderPlugin = () => {
  return {
    name: 'replace-loader',
    transform(src: any, id: any) {
      try {
        if (id.startsWith(`${dir}/src/`) && (
            id.indexOf('/libs/constants.ts') !== -1 ||
            id.indexOf('/libs/app-context.ts') !== -1)) {
          return { code: ReplaceLoader(src), map: null }
        }
      } catch (ignore) { }
    }
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2024-10-17',
  devtools: { enabled: true },
  components: false,
  modules: ['@pinia/nuxt', 'nuxt-proxy-request'],
  experimental: { viewTransition: true },
  build: {
  },

  proxy: {
    options: apiproxy
  },

  vite: {
    plugins: [
      legacy({
        targets: ['defaults', 'not IE 11', 'chrome > 59', 'firefox > 60'],
        externalSystemJS: false,
      }),
      ReplaceLoaderPlugin()
    ],
    build: {
      rollupOptions: {}
    },
    server: {
      // hmr: {
      //   path: '/hmr',
      //   clientPort: Number(String(process.env['VITE_HMR_CLIENT_PORT'] || '24678'))
      // },
    },
  },

  srcDir: 'src',

  runtimeConfig: {
    public: {
      profile: PROFILE,
      basePath: ''
    }
  },

  app: {
    head: {
      // script: [ { src: `${baseURL}/system.min.js` } ]
    },
    baseURL
  },

  nitro: {
    output: { publicDir: distdir }
  },

  css: [
    'bootstrap/dist/css/bootstrap.css',
    '@/pages/globals.scss',
  ],

  hooks: {
    'vite:extendConfig': (config: any, { isClient, isServer }: any) => {
      const server = config.server as any
      const build = config.build as any
      if (isClient) {
        (config.resolve?.alias as any).vue = 'vue/dist/vue.esm-bundler'
      }
      if (config.mode === 'development') {
        if (isClient) { build.sourcemap = true; }
        if (isServer) { build.sourcemap = 'inline'; }
        build.minify = false
        build.assetsInlineLimit = 0
      }
    }
  },

  pinia: {
    // autoImports: [
    //   'defineStore',
    //   ['defineStore', 'definePiniaStore'],
    // ],
  }
})