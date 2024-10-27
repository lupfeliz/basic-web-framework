/**
 * @File        : next.config.mjs
 * @Author      : 정재백
 * @Since       : 2023-03-22
 * @Description : nextjs 구동설정
 * @Site        : https://devlog.ntiple.com
 **/
import { NextConfig } from 'next'
import yaml from 'js-yaml'
import cryptojs from 'crypto-js'
import { copyFileSync, readFileSync, existsSync, rmSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import log from './src/libs/log'
const dir = dirname(fileURLToPath(import.meta.url))
const nextConfig: () => NextConfig = () => {
/** 커맨드 : npm run dev 했을경우 : dev */
const cmd = String(process.env.npm_lifecycle_event)
/** 개발모드로 실행중인지 여부 */
const prod = process.env.NODE_ENV === 'production'
/** 프로파일별 환경변수를 읽어온다 */
const PROFILE = process.env.PROFILE || 'local'
const yml = yaml.load(readFileSync(`${process.cwd()}/env/env-${PROFILE}.yml`, 'utf8'))
if (!process.env?.PRINTED) {
  log.debug('================================================================================')
  log.debug(`샘플앱 / 프로파일 : ${PROFILE} / 구동모드 : ${cmd}[${prod}] / API프록시 : ${((yml?.api || [])[0] || {})?.server}`)
  log.debug('================================================================================')
  process.env.PRINTED = 'true'
  if (existsSync(`${dir}/babel.config.js`)) { rmSync(`${dir}/babel.config.js`) }
  if (/(bbuild|bgenerate)/.test(cmd)) { copyFileSync(`${dir}/tools/babel/babel.config.js`, `${dir}/babel.config.js`) }
  /** 설정정보 등을 암호화 하여 클라이언트로 보내기 위한 AES 키, replace-loader 에 의해 constants 에 입력된다 */
  const cryptokey = btoa(Array(32).fill('0').map((v, i, l) => l[i] = Math.round(Math.random() * 255)) as any)
  process.env.BUILD_STORE = JSON.stringify({
    CRYPTO_KEY: cryptokey,
    ENCRYPTED: cryptojs.AES.encrypt(JSON.stringify(yml), cryptokey).toString()
  })
}
/** API 프록시 설정 */
const apiproxy = [ ] as any[];
((yml?.api || []) as any[]).map((api: any) => apiproxy.push({
  source: `${api?.base || '/api'}/:path*`,
  destination: `${api?.server || 'http://localhost:8080'}${api?.alter || '/api'}/:path*`
} as any))
return {
  /** /api 경로로 요청이 들어올 경우 API 자바서버로 프록시 */
  async rewrites() { return apiproxy },
  /** npm run generate 로 빌드시 정적빌드 수행 하도록 */
  output: /generate/.test(cmd) ? 'export' : undefined,
  /** 빌드결과물 생성위치 : /dist */
  distDir: 'dist',
  /** 빌드후 갱신이 되지 않는것을 방지하기 위해 시간베이스로 빌드ID 생성 */
  generateBuildId: async () => {
    // return process.env.GIT_HASH
    return `${new Date().getTime()}`
  },
  basePath: yml?.app?.basePath || undefined,
  /** 개발모드에서 페이지가 두번씩 접근되는 현상 방지 */
  reactStrictMode: prod ? true : false,
  /** 빌드타임에 사용되는 설정정보 */
  serverRuntimeConfig: yml,
  /** 브라우저에 전달할 설정정보 */
  publicRuntimeConfig: { profile: PROFILE, basePath: yml?.app?.basePath || '', logLevel: yml?.log?.level || 'debug' },
  /** NEXT-15 에서 sass 빌드가 많이 시끄러우므로 모든 경고 옵션을 꺼둔다. */
  sassOptions: {
    silenceDeprecations: [
      'abs-percent', 'bogus-combinators', 'call-string', 'color-4-api',
      'color-functions', 'color-module-compat', 'css-function-mixin', 'duplicate-var-flags',
      'elseif', 'feature-exists', 'fs-importer-cwd', 'function-units',
      'global-builtin', 'import', 'legacy-js-api', 'mixed-decls',
      'moz-document', 'new-global', 'null-alpha', 'relative-canonical',
      'slash-div', 'strict-unary',
    ]
  },
  devIndicators: { appIsrStatus: false },
  compress: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { serverComponentsHmrCache: false },
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
      cfg.module.rules.push({
        test: [ /\/libs\/(constants|app-context)\.[jt]s$/ ],
        loader: `${process.cwd()}/env/replace-loader.js`,
      })
      cfg.module.rules.push({
        test: [ /\/pages\/.*\.jsx$/ ],
        loader: `${process.cwd()}/env/macro-loader.js`,
      })
    }
    return cfg
  },
}}
export default nextConfig()