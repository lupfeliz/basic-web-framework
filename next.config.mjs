import yaml from 'js-yaml'
import fs from 'fs'
const nextConfig = () => {
/** 커맨드 : npm run dev 했을경우 : dev */
const cmd = process.env.npm_lifecycle_event
/** 개발모드로 실행중인지 여부 */
const prod = process.env.NODE_ENV === 'production'
/** 프로파일별 환경변수를 읽어온다 */
const PROFILE = process.env.PROFILE || 'local'
const yml = yaml.load(fs.readFileSync(`${process.cwd()}/env/env-${PROFILE}.yml`, 'utf8'))
const apiproxy = [ ]
for (const itm of yml.api) {
  apiproxy.push({
    source: `${itm.base}/:path*`,
    destination: `${itm.server}${itm.alter}/:path*`
  })
}
/** 설정정보 등을 암호화 하여 클라이언트로 보내기 위한 AES 키 */
process.env.BUILD_STORE = JSON.stringify({ CRYPTO_KEY: `${new Date().getTime()}` })
return {
  /** /api 경로로 요청이 들어올 경우 자바서버로 프록시  */
  async rewrites() { return apiproxy },
  /** npm run generate 로 빌드시 정적빌드 수행 */
  output: /generate/.test(cmd) ? 'export' : undefined,
  /** 빌드결과물 생성위치 : /dist */
  distDir: 'dist',
  /** 개발모드에서 페이지가 두번씩 접근되는 현상 방지 */
  reactStrictMode: prod ? true : false,
  /** 빌드타임에 사용되는 설정정보 */
  serverRuntimeConfig: yml,
  /** 브라우저에 전달할 설정정보 */
  publicRuntimeConfig: { profile: PROFILE },
  webpack: (cfg, opt) => {
    cfg?.module?.rules?.push && cfg.module.rules.push({
      test: [
        /\/libs\/app-context\.[jt]s$/,
        /\/pages\/_document\.[jt]sx$/,
      ],
      loader: `${process.cwd()}/replaceLoader.js`,
    })
    return cfg
  },
}}
export default nextConfig()