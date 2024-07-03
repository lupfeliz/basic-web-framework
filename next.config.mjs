/** @type {import('next').NextConfig} */
const nextConfig = () => {
const PRODUCTION = 'production'
const NPM_CMD = process.env.npm_lifecycle_event
const NODE_ENV = process.env.NODE_ENV
const prod = NODE_ENV === PRODUCTION
return {
  output: /generate/.test(NPM_CMD) ? 'export' : undefined,
  distDir: 'dist',
  generateEtags: true,
  reactStrictMode: prod ? true : false,
}}
export default nextConfig();