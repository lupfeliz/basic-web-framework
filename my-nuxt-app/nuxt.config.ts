import env from 'dotenv'
import path from 'path'
import fs from 'fs'

const log = { debug: console.log }

env.config()
const distdir = path.join(__dirname, 'dist')
if (!fs.existsSync(distdir)) { fs.mkdirSync(distdir) }

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
      options: {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' },
        pathFilter: ['/api',]
      }
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
