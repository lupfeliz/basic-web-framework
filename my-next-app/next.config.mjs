/**
 * @File        : next.config.mjs
 * @Author      : 정재백
 * @Since       : 2023-03-22
 * @Description : nextjs 구동설정
 * @Site        : https://devlog.ntiple.com
 **/
import yaml from 'js-yaml'
import cryptojs from 'crypto-js'
import { copyFileSync, readFileSync, existsSync, rmSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const dir = dirname(fileURLToPath(import.meta.url))

const nextConfig = () => {
/** 커맨드 : npm run dev 했을경우 : dev */
const cmd = process.env.npm_lifecycle_event
/** 개발모드로 실행중인지 여부 */
const prod = process.env.NODE_ENV === 'production'
/** 프로파일별 환경변수를 읽어온다 */
const PROFILE = process.env.PROFILE || 'local'
const yml = yaml.load(readFileSync(`${process.cwd()}/env/env-${PROFILE}.yml`, 'utf8'))
if (!process.env?.PRINTED) {
  console.log('================================================================================')
  console.log(`샘플앱 / 프로파일 : ${PROFILE} / 구동모드 : ${cmd}[${prod}] / API프록시 : ${((yml?.api || [])[0] || {})?.server}`)
  console.log('================================================================================')
  process.env.PRINTED = true
  if (existsSync(`${dir}/babel.config.js`)) { rmSync(`${dir}/babel.config.js`) }
  if (/(bbuild|bgenerate)/.test(cmd)) { copyFileSync(`${dir}/tools/babel/babel.config.js`, `${dir}/babel.config.js`) }
  /** 설정정보 등을 암호화 하여 클라이언트로 보내기 위한 AES 키, replace-loader 에 의해 constants 에 입력된다 */
  const cryptokey = btoa(Array(32).fill('0').map((v, i, l) => l[i] = Math.round(Math.random() * 255)))
  process.env.BUILD_STORE = JSON.stringify({
    CRYPTO_KEY: cryptokey,
    ENCRYPTED: cryptojs.AES.encrypt(JSON.stringify(yml), cryptokey).toString()
  })
}
/** API 프록시 설정 */
const apiproxy = [ ];
(yml?.api || []).map(api => apiproxy.push({
  source: `${api?.base || '/api'}/:path*`,
  destination: `${api?.server || 'http://localhost:8080'}${api?.alter || '/api'}/:path*`
}))
return {
  /** /api 경로로 요청이 들어올 경우 API 자바서버로 프록시 */
  async rewrites() { return apiproxy },
  /** npm run generate 로 빌드시 정적빌드 수행 하도록 */
  output: /generate/.test(cmd) ? 'export' : undefined,
  /** 빌드결과물 생성위치 : /dist */
  distDir: 'dist',
  basePath: yml?.app?.basePath || undefined,
  /** 개발모드에서 페이지가 두번씩 접근되는 현상 방지 */
  reactStrictMode: prod ? true : false,
  /** 빌드타임에 사용되는 설정정보 */
  serverRuntimeConfig: yml,
  /** 브라우저에 전달할 설정정보 */
  publicRuntimeConfig: { profile: PROFILE, basePath: yml.app.basePath || '' },
  /** 웹팩 빌드중 소스코드를 가로채 변경한다 (replace-loader) */
  webpack: (cfg, opt) => {
    cfg.cache = /dev/.test(cmd) ? false : true
    // cfg.infrastructureLogging = { debug: /PackFileCache/ },
    cfg.module.rules.push(
      // { test: /\.(js)$/, generator: { filename: '[name].[ext]' } },
      // { test: /\.(woff2|woff)$/, generator: { filename: '[name].[ext]' } },
    )
    cfg.output.filename = cfg.output.filename.replace('-[chunkhash]', '')
    cfg.output.chunkFilename = cfg.output.chunkFilename.replace('.[contenthash]', '')
    cfg.module.generator.asset.filename = cfg.module.generator.asset.filename.replace('.[hash:8]', '')
    if (cfg.plugins && cfg.module?.rules) {
      for (const plugin of cfg.plugins) {
        if (plugin?.constructor.name === 'CopyFilePlugin') {
          if (plugin.name === 'static/chunks/polyfills-[hash].js') {
            plugin.name = 'static/chunks/polyfills.js'
          }
        }
        if (plugin?.constructor.name === 'NextMiniCssExtractPlugin') {
          plugin.options.filename = plugin.options.filename.replace('[contenthash]', '[name]')
          plugin.options.chunkFilename = plugin.options.chunkFilename.replace('[contenthash]', '[name]')
        }
      }
    }
    cfg?.module?.rules?.push && cfg.module.rules.push({
      test: [ /\/libs\/(constants|app-context)\.[jt]s$/ ],
      loader: `${process.cwd()}/env/replace-loader.js`,
    })
    return cfg
  },
}}

export default nextConfig()
